# Adaptive Study Planner UI

A premium interactive study timetable built with Next.js App Router, TypeScript, Tailwind CSS, Radix primitives, Framer Motion, GSAP, and Lenis.

The interface turns the provided April 18 to May 11 exam plan into an execution-focused product experience:

- Animated hero with key exam stats
- Sticky section navigation
- Expandable phase-based timetable
- Subject unit tracker with persisted progress
- Daily execution panel with checklist + session timer
- Strategy timeline and fallback planning
- Analytics for coverage, execution, and projected score

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Radix UI primitives with shadcn-style wrappers
- Framer Motion
- GSAP + ScrollTrigger
- Lenis

## Commands

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Data Source

The planner data is generated from:

`C:/Users/mishr/Downloads/exam_study_timetable_apr18_may11.html`

To regenerate the typed JSON after updating the source HTML:

```bash
npm run generate:data
```

Generated output:

- [src/data/study-plan.generated.json](C:/Users/mishr/OneDrive/Desktop/college/semester%202/time%20table/src/data/study-plan.generated.json)

Generator:

- [scripts/generate-study-plan.mjs](C:/Users/mishr/OneDrive/Desktop/college/semester%202/time%20table/scripts/generate-study-plan.mjs)

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    planner/
    providers/
    ui/
  data/
    study-plan.generated.json
  hooks/
    use-persisted-map.ts
  lib/
    study-plan.ts
    utils.ts
scripts/
  generate-study-plan.mjs
```

## Notes

- Progress toggles are persisted in `localStorage`.
- The app is statically buildable and passed both lint and production build checks.
- `next.config.ts` pins `turbopack.root` to this project directory to avoid workspace-root warnings.
