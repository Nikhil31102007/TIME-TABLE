import rawPlan from "@/data/study-plan.generated.json";
import { slugify } from "@/lib/utils";

type RawPlan = typeof rawPlan;
type RawPhaseKey = keyof RawPlan["phases"];
type RawEntry = RawPlan["phases"][RawPhaseKey][number];

export type SectionId =
  | "overview"
  | "phase-1"
  | "phase-2"
  | "phase-3"
  | "strategy"
  | "fallback";

export type SubjectId =
  | "chemistry"
  | "mathematics"
  | "beee"
  | "dsa"
  | "bioinformatics"
  | "computer-workshop"
  | "uhv";

export type DayKind = "day" | "hackathon" | "exam";
export type DayType = "full" | "half" | "light" | "hackathon" | "exam";
export type BlockKind =
  | "study"
  | "revision"
  | "mock"
  | "recovery"
  | "admin"
  | "logistics";

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  short: string;
  credits: number;
  targetHours: number;
  units: string[];
  priority: "critical" | "high" | "medium" | "support";
  strapline: string;
}

export interface PlannerBlock {
  id: string;
  time: string;
  text: string;
  subjects: SubjectMeta[];
  type: BlockKind;
  minutes: number;
}

export interface PlannerDay {
  id: string;
  week: string;
  kind: DayKind;
  dayType: DayType;
  badge: string;
  title: string;
  subtitle: string;
  note: string;
  description: string;
  phaseId: RawPhaseKey;
  blocks: PlannerBlock[];
  focusSubjects: SubjectMeta[];
  productiveMinutes: number;
  supportMinutes: number;
}

export interface PlannerPhase {
  id: RawPhaseKey;
  anchor: SectionId;
  label: string;
  eyebrow: string;
  range: string;
  description: string;
  entries: PlannerDay[];
}

const subjectMeta: SubjectMeta[] = [
  {
    id: "chemistry",
    name: "Chemistry",
    short: "CH",
    credits: 4,
    targetHours: 16,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "critical",
    strapline: "Reactions, mechanisms, and recall-heavy scoring lanes.",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    short: "MA",
    credits: 4,
    targetHours: 16,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "critical",
    strapline: "Method marks, repetition, and worked examples decide the score.",
  },
  {
    id: "beee",
    name: "BEEE",
    short: "BE",
    credits: 4,
    targetHours: 14,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "high",
    strapline: "Numericals and labeled circuit diagrams are the fastest points.",
  },
  {
    id: "dsa",
    name: "DSA",
    short: "DS",
    credits: 4,
    targetHours: 18,
    units: ["Searching", "Sorting", "Stack", "Queue", "Linked List"],
    priority: "critical",
    strapline: "Trace-first learning with algorithm logic on paper.",
  },
  {
    id: "bioinformatics",
    name: "Bioinformatics",
    short: "BI",
    credits: 3,
    targetHours: 10,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "medium",
    strapline: "Theory compression and flowchart-based retention.",
  },
  {
    id: "computer-workshop",
    name: "Computer Workshop",
    short: "CW",
    credits: 2,
    targetHours: 6,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "support",
    strapline: "Practical task memory, quick command recall, skim-friendly.",
  },
  {
    id: "uhv",
    name: "UHV",
    short: "UH",
    credits: 1,
    targetHours: 4,
    units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    priority: "support",
    strapline: "Definition-heavy and intentionally capped to avoid over-investing.",
  },
];

const subjectByName = new Map(subjectMeta.map((subject) => [subject.name, subject]));

const phaseMeta: Record<
  RawPhaseKey,
  Pick<PlannerPhase, "label" | "eyebrow" | "range" | "description" | "anchor">
> = {
  phase1: {
    anchor: "phase-1",
    label: "Phase 1",
    eyebrow: "Coverage Sprint",
    range: "Apr 18 - May 1",
    description:
      "Front-load the four heavy subjects before the hackathon takes four days out of the calendar.",
  },
  phase2: {
    anchor: "phase-2",
    label: "Phase 2",
    eyebrow: "Compression Revision",
    range: "May 2 - May 8",
    description:
      "Finish the lighter subjects, compress notes into summaries, and shift into PYQ-driven revision.",
  },
  phase3: {
    anchor: "phase-3",
    label: "Phase 3",
    eyebrow: "Mock and Triage",
    range: "May 9 - May 11",
    description:
      "Run exam-like attempts, patch weak spots only, and protect energy heading into the papers.",
  },
};

const navItems: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "phase-1", label: "Phase 1" },
  { id: "phase-2", label: "Phase 2" },
  { id: "phase-3", label: "Phase 3" },
  { id: "strategy", label: "Strategy" },
  { id: "fallback", label: "Fallback" },
];

const dayTypeMeta: Record<
  DayType,
  {
    label: string;
    tone: string;
    glow: string;
  }
> = {
  full: {
    label: "Full Day",
    tone: "text-[var(--text-primary)]",
    glow: "from-[rgba(245,158,11,0.22)] to-transparent",
  },
  half: {
    label: "Half Day",
    tone: "text-[var(--text-primary)]",
    glow: "from-[rgba(37,99,235,0.24)] to-transparent",
  },
  light: {
    label: "Light Day",
    tone: "text-[var(--muted)]",
    glow: "from-[rgba(245,245,245,0.14)] to-transparent",
  },
  hackathon: {
    label: "Hackathon",
    tone: "text-[var(--accent)]",
    glow: "from-[rgba(245,158,11,0.16)] to-transparent",
  },
  exam: {
    label: "Exam",
    tone: "text-[var(--text-primary)]",
    glow: "from-[rgba(37,99,235,0.18)] to-transparent",
  },
};

const replacementPairs = [
  ["—", "-"],
  ["–", "-"],
  ["→", ""],
  ["’", "'"],
  ["“", '"'],
  ["”", '"'],
  ["×", "x"],
] as const;

function normalizeText(value: string) {
  return replacementPairs.reduce(
    (next, [from, to]) => next.replaceAll(from, to),
    value,
  );
}

function detectSubjects(text: string, existing: SubjectMeta[]) {
  const matches = new Map(existing.map((subject) => [subject.id, subject]));

  for (const subject of subjectMeta) {
    if (text.includes(subject.name)) {
      matches.set(subject.id, subject);
    }
  }

  return [...matches.values()];
}

function classifyBlock(text: string): BlockKind {
  const normalized = normalizeText(text).toLowerCase();

  if (
    normalized.includes("break") ||
    normalized.includes("lunch") ||
    normalized.includes("rest") ||
    normalized.includes("walk") ||
    normalized.includes("sleep")
  ) {
    return "recovery";
  }

  if (
    normalized.includes("pack exam bag") ||
    normalized.includes("photograph all notes") ||
    normalized.includes("plan the day") ||
    normalized.includes("coverage audit") ||
    normalized.includes("subject audit")
  ) {
    return "logistics";
  }

  if (
    normalized.includes("mock") ||
    normalized.includes("pyq") ||
    normalized.includes("timed")
  ) {
    return "mock";
  }

  if (
    normalized.includes("revision") ||
    normalized.includes("review") ||
    normalized.includes("skim") ||
    normalized.includes("cheat sheet")
  ) {
    return "revision";
  }

  if (
    normalized.includes("plan") ||
    normalized.includes("checklist") ||
    normalized.includes("daily review")
  ) {
    return "admin";
  }

  return "study";
}

function parseTimePart(value: string, inheritedMeridiem?: "AM" | "PM") {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const meridiem = (match[3]?.toUpperCase() ?? inheritedMeridiem) as
    | "AM"
    | "PM"
    | undefined;

  if (!meridiem) {
    return null;
  }

  let nextHours = hours % 12;
  if (meridiem === "PM") {
    nextHours += 12;
  }

  return nextHours * 60 + minutes;
}

function getDurationMinutes(range: string) {
  const normalized = normalizeText(range);
  const match = normalized.match(/^(.+?)\s*-\s*(.+)$/);

  if (!match) {
    return 0;
  }

  const [, startRaw, endRaw] = match;
  const endMeridiemMatch = endRaw.match(/\b(AM|PM)\b/i);
  const startMeridiemMatch = startRaw.match(/\b(AM|PM)\b/i);
  const endMinutes = parseTimePart(endRaw);
  const startMinutes = parseTimePart(
    startRaw,
    (startMeridiemMatch?.[1] ?? endMeridiemMatch?.[1])?.toUpperCase() as
      | "AM"
      | "PM"
      | undefined,
  );

  if (startMinutes === null || endMinutes === null) {
    return 0;
  }

  return Math.max(endMinutes - startMinutes, 0);
}

function resolveDayType(badge: string, kind: DayKind): DayType {
  if (kind === "hackathon") return "hackathon";
  if (kind === "exam") return "exam";
  if (badge.toLowerCase().includes("full")) return "full";
  if (badge.toLowerCase().includes("half")) return "half";
  return "light";
}

function buildDay(phaseId: RawPhaseKey, entry: RawEntry): PlannerDay {
  const kind = entry.kind as DayKind;
  const dayType = resolveDayType(entry.badge, kind);

  const blocks = entry.blocks.map((block, index) => {
    const seededSubjects = block.subjects
      .map((subjectName) => subjectByName.get(subjectName))
      .filter((subject): subject is SubjectMeta => Boolean(subject));
    const subjects = detectSubjects(block.text, seededSubjects);
    const type = classifyBlock(block.text);
    const minutes = getDurationMinutes(block.time);

    return {
      id: `${entry.id}-${index + 1}`,
      time: block.time,
      text: block.text,
      subjects,
      type,
      minutes,
    };
  });

  const focusSubjects = Array.from(
    new Map(
      blocks
        .flatMap((block) => block.subjects)
        .map((subject) => [subject.id, subject]),
    ).values(),
  );

  return {
    id: entry.id,
    week: entry.week,
    kind,
    dayType,
    badge: entry.badge,
    title: entry.title,
    subtitle: entry.subtitle,
    note: entry.note,
    description: entry.description,
    phaseId,
    blocks,
    focusSubjects,
    productiveMinutes: blocks
      .filter((block) => block.type !== "recovery")
      .reduce((total, block) => total + block.minutes, 0),
    supportMinutes: blocks
      .filter((block) => block.type === "recovery")
      .reduce((total, block) => total + block.minutes, 0),
  };
}

const phases: PlannerPhase[] = (Object.entries(rawPlan.phases) as [
  RawPhaseKey,
  RawEntry[],
][]).map(([phaseId, entries]) => ({
  id: phaseId,
  ...phaseMeta[phaseId],
  entries: entries.map((entry) => buildDay(phaseId, entry)),
}));

const allEntries = phases.flatMap((phase) => phase.entries);
const allStudyDays = allEntries.filter((entry) => entry.kind === "day");
const totalTargetHours = rawPlan.overview.subjectHours.reduce(
  (total, item) => total + item.hours,
  0,
);

const scheduledMinutesBySubject = subjectMeta.map((subject) => {
  const minutes = allStudyDays.reduce((total, day) => {
    return (
      total +
      day.blocks.reduce((blockTotal, block) => {
        if (!block.subjects.length || !block.minutes) {
          return blockTotal;
        }

        const hasSubject = block.subjects.some(
          (candidate) => candidate.id === subject.id,
        );

        if (!hasSubject) {
          return blockTotal;
        }

        return blockTotal + block.minutes / block.subjects.length;
      }, 0)
    );
  }, 0);

  return {
    subject,
    scheduledHours: Number((minutes / 60).toFixed(1)),
  };
});

const overviewStats = [
  ...rawPlan.overview.stats,
  {
    label: "Target study hours",
    value: totalTargetHours,
  },
];

const strategyCards = rawPlan.strategy.cards.map((card) => ({
  id: card.id,
  title: card.title,
  items: card.items,
}));

const fallbackCards = rawPlan.fallback.map((card) => ({
  id: card.id,
  title: card.title,
  items: card.items,
  tone: (card.variant.includes("danger")
    ? "danger"
    : card.variant.includes("warning")
      ? "warning"
      : "neutral") as "danger" | "warning" | "neutral",
}));

const subjectInsights = rawPlan.strategy.subjectTactics
  .map((item) => {
    const subject = subjectByName.get(item.subject);
    if (!subject) return null;
    return {
      ...item,
      subject,
    };
  })
  .filter(
    (
      item,
    ): item is {
      subject: SubjectMeta;
      body: string;
    } => Boolean(item),
  );

export const plannerMeta = {
  name: "Adaptive Study Planner",
  sgpa: 6.68,
  targetScore: "40/50 in every subject",
  examStartDate: "May 11, 2026",
  planStartDate: "April 18, 2026",
  hackathonRange: "April 24-27, 2026",
  sections: navItems,
};

export const plannerData = {
  subjects: subjectMeta,
  subjectByName,
  phases,
  allEntries,
  allStudyDays,
  overviewStats,
  overviewCards: rawPlan.overview.phaseCards,
  timeline: rawPlan.overview.timeline,
  legends: rawPlan.overview.legends,
  subjectHours: rawPlan.overview.subjectHours,
  subjectInsights,
  scheduledMinutesBySubject,
  strategyCards,
  fallbackCards,
  nextStudyDay: allStudyDays[0]!,
  totalTargetHours,
  totalStudyDays: allStudyDays.length,
  totalBlocks: allStudyDays.reduce((count, day) => count + day.blocks.length, 0),
};

export function getSubjectStorageKey(subjectId: SubjectId, unit: string) {
  return `${subjectId}:${slugify(unit)}`;
}

export function getTaskStorageKey(dayId: string, blockId: string) {
  return `${dayId}:${blockId}`;
}

export function getSubjectTone(subjectId: SubjectId) {
  const tones: Record<SubjectId, string> = {
    chemistry: "border-white/10 bg-white/[0.05] text-white",
    mathematics: "border-white/10 bg-white/[0.04] text-white",
    beee: "border-[rgba(37,99,235,0.26)] bg-[rgba(37,99,235,0.12)] text-[#c8d8ff]",
    dsa: "border-[rgba(245,158,11,0.24)] bg-[rgba(245,158,11,0.1)] text-[#ffd48c]",
    bioinformatics: "border-white/10 bg-white/[0.035] text-[var(--muted)]",
    "computer-workshop":
      "border-[rgba(37,99,235,0.2)] bg-[rgba(37,99,235,0.08)] text-[#dce8ff]",
    uhv: "border-white/10 bg-transparent text-[var(--muted)]",
  };

  return tones[subjectId];
}

export function getDayTone(dayType: DayType) {
  return dayTypeMeta[dayType];
}
