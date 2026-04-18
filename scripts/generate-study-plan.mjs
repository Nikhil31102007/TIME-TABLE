import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const root = process.cwd();
const sourcePath =
  process.argv[2] ?? "C:/Users/mishr/Downloads/exam_study_timetable_apr18_may11.html";
const outputPath = path.join(root, "src", "data", "study-plan.generated.json");

const html = fs.readFileSync(sourcePath, "utf8");
const $ = load(html);

const replacements = new Map([
  ["â€”", "—"],
  ["â€“", "–"],
  ["â†’", "→"],
  ["â€˜", "‘"],
  ["â€™", "’"],
  ["â€œ", "“"],
  ["â€\u009d", "”"],
  ["â€¦", "…"],
  ["Ã—", "×"],
  ["Â", ""],
]);

const repairText = (value = "") => {
  let next = value;
  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to);
  }
  return next;
};

const clean = (value = "") => repairText(value).replace(/\s+/g, " ").trim();
const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseListCard = (element) => ({
  id: slugify(clean($(element).find(".st").first().text())),
  title: clean($(element).find(".st").first().text()),
  items: $(element)
    .find(".si")
    .map((_, item) => clean($(item).text()))
    .get()
    .filter(Boolean),
});

const parseOverview = () => {
  const section = $("#s-ov");

  const stats = section
    .find(".g3 .mc")
    .map((_, element) => ({
      label: clean($(element).find(".ml").text()),
      value: Number.parseInt(clean($(element).find(".mv").text()), 10),
    }))
    .get();

  const timeline = section
    .find(".phase-strip .ps")
    .map((_, element) => {
      const style = $(element).attr("style") ?? "";
      const flexMatch = style.match(/flex:(\d+)/);
      return {
        label: clean($(element).text()),
        weight: flexMatch ? Number.parseInt(flexMatch[1], 10) : 1,
        variant: clean(($(element).attr("class") ?? "").replace("ps", "")),
      };
    })
    .get();

  const legends = section
    .find(".leg .badge")
    .map((_, element) => clean($(element).text()))
    .get();

  const phaseCards = section
    .find(".g2 .sc")
    .map((_, element) => parseListCard(element))
    .get();

  const subjectHours = section
    .find(".pr")
    .map((_, element) => {
      const subject = clean($(element).find(".sp").first().text());
      const hoursLabel = clean($(element).find(".prp").text());
      const widthStyle = $(element).find(".pbar").attr("style") ?? "";
      const percentMatch = widthStyle.match(/width:(\d+)%/);
      const hourMatch = hoursLabel.match(/(\d+)/);

      return {
        subject,
        hoursLabel,
        hours: hourMatch ? Number.parseInt(hourMatch[1], 10) : 0,
        progressPercent: percentMatch ? Number.parseInt(percentMatch[1], 10) : 0,
      };
    })
    .get();

  return {
    stats,
    timeline,
    legends,
    phaseCards,
    subjectHours,
  };
};

const parseScheduleSection = (sectionId) => {
  const section = $(`#s-${sectionId}`);
  let currentWeek = "";
  const items = [];

  section.children().each((_, element) => {
    const node = $(element);
    if (node.hasClass("wsep")) {
      currentWeek = clean(node.text());
      return;
    }

    if (!node.hasClass("dc")) {
      return;
    }

    const className = node.attr("class") ?? "";
    const badge = clean(node.find(".dh .badge").first().text());
    const title = clean(node.find(".dtitle").first().text());
    const subtitle = clean(node.find(".dsub").first().text());
    const note = clean(node.find(".dnote").first().text());
    const description =
      !node.find(".tb").length && node.find(".tt2").first().length
        ? clean(node.find(".tt2").first().text())
        : "";

    const blocks = node
      .find(".tb")
      .map((_, block) => {
        const textNode = $(block).find(".tt2").first();
        return {
          time: clean($(block).find(".tl").first().text()),
          text: clean(textNode.text()),
          subjects: textNode
            .find(".sp")
            .map((_, token) => clean($(token).text()))
            .get(),
        };
      })
      .get();

    items.push({
      id: slugify(`${currentWeek}-${title || badge}`),
      week: currentWeek,
      kind: className.includes("hack")
        ? "hackathon"
        : className.includes("exam")
          ? "exam"
          : "day",
      badge,
      title,
      subtitle,
      note,
      description,
      blocks,
    });
  });

  return items;
};

const parseStrategy = () => {
  const section = $("#s-st");
  const cards = [];
  const subjectTactics = [];

  section.find(".sc").each((_, element) => {
    const title = clean($(element).find(".st").first().text());

    if (title === "Subject-specific tactics") {
      $(element)
        .find("span.sp")
        .each((__, token) => {
          const subject = clean($(token).text());
          const body = clean($(token).next(".si").text());
          subjectTactics.push({
            subject,
            body,
          });
        });
      return;
    }

    cards.push(parseListCard(element));
  });

  return {
    cards,
    subjectTactics,
  };
};

const parseFallback = () =>
  $("#s-fb .sc")
    .map((_, element) => ({
      ...parseListCard(element),
      variant: clean($(element).attr("style") ?? ""),
    }))
    .get();

const data = {
  generatedAt: new Date().toISOString(),
  overview: parseOverview(),
  phases: {
    phase1: parseScheduleSection("p1"),
    phase2: parseScheduleSection("p2"),
    phase3: parseScheduleSection("p3"),
  },
  strategy: parseStrategy(),
  fallback: parseFallback(),
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Generated ${path.relative(root, outputPath)} from ${sourcePath}`);
