# Paramarsh website: Beyond the Surface

Website for **Paramarsh Global Sustainable Development Pvt. Ltd.** (Varanasi, Uttar Pradesh).
The homepage is an interactive documentary about what meaningful development takes, built around four
principles: Competence, Consistency, Transparency and Benevolence. Around it sits a conventional
corporate website.

> **Status: restart.** The earlier single-page showcase is superseded. The site is being rebuilt from
> scratch along the roadmap below. Current goal: **G1, the visual prototype**.

**Stack:** Next.js (App Router) + TypeScript, Tailwind CSS v4, Three.js with React Three Fiber and Drei,
GSAP ScrollTrigger. See `CLAUDE.md` for the full decisions and the working agreements.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm test
npm run lint
npm run build
```

Requires Node 20+. Developed on Node 24.

## The documentary (home page)

| # | Sequence | Idea |
|---|---|---|
| 00 | Opening film | "Progress is easy to promise. Making it meaningful is harder." |
| 01 | Competence | Before we act, we understand. Explorable terrain with contextual layers |
| 02 | Consistency | The standard should never change. Architectural corridor and project lifecycle |
| 03 | Transparency | Nothing important should be hidden. Methods, Sources, Decisions, Limitations |
| 04 | Benevolence | Development is ultimately about people. Documentary photography and video |
| 05 | Conclusion | What progress leaves behind. Routes to Our Work and Contact |

## Site map

`/` Home · `/who-we-are` · `/what-we-do` · `/how-we-do-it` · `/our-work` · `/careers` · `/contact` ·
`/privacy` · `/terms`

## Roadmap

| Goal | Scope |
|---|---|
| G1 | Creative foundation and visual prototype (one polished sequence) |
| G2 | Opening documentary, chapter indicator and navigation |
| G3 | Competence and Consistency chapters |
| G4 | Transparency and Benevolence chapters |
| G5 | Orchestration: transitions, chapter navigation, conclusion |
| G6 | Corporate website pages |
| G7 | Production readiness: performance, accessibility, SEO, analytics |

## Principles for contributors

- Every animation must communicate something. 3D is an environment, not an ornament.
- Essential text stays in semantic HTML, never inside video or 3D.
- Every chapter works without the 3D scene, with reduced motion, and without audio.
- Never invent company claims. Label placeholders and hypothetical examples clearly.
- Targets: LCP under 2.5 s, CLS under 0.1, Lighthouse accessibility 95+.

## Docs

`docs/` holds the company tech stack, colour system and the earlier plan. The creative blueprint and
the chapter user stories live in the team's Claude Project.
