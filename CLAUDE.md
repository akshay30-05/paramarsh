# CLAUDE.md: Paramarsh website project

Project brief and working notes. Read this first in every session.

## Who and what

- Akshay is a frontend web developer intern at Paramarsh and is building the company website landing page.
- Current phase: a short **demo for a showcase** to the company. After it, the company will give instructions and real work starts.
- Repo: https://github.com/akshay30-05/paramarsh (Akshay's own account; started empty).
- Local folder: `~/Desktop/paramarsh` (linked to that repo).
- Mac: Apple silicon, Node 24.

## The company

- Paramarsh Global Sustainable Development Pvt. Ltd., Uttar Pradesh (registered 2023, research and experimental development). Site: https://www.paramarsh.dev
- Contact on the live site: Varanasi, Uttar Pradesh, `queries@paramarsh.dev`.
- Live site today: tagline "Building a more responsible future"; "Advancing sustainable systems through research, innovation, and cross-sector collaboration"; four SDG focus areas (03 Good Health and Well-Being, 12 Responsible Consumption and Production, 04 Quality Education, 09 Industry, Innovation and Infrastructure); a "Strategic Approach" section (only "Research" was visible); careers ("Learn, Build and Evolve"); contact; footer with Privacy and Terms.
- "Paramarsh Mall" (in Akshay's first message) was a **voice-to-text mix-up** for "Paramarsh may receive great heights". There is no Mall product. The page is for the company and the Mall is not mentioned anywhere.

## Brief from the company

1. **Hero: four pillars.** Competence, transparency, benevolence, consistency. The four pillars are what the website relies on, and they are the "trust equation" (no separate framework).
2. **Geometry:** fragmented and asymmetric.
3. **Scrolling:** "warm" = smooth and soft, with eased transitions (not a colour). Smooth scroll with eased motion everywhere.
4. **Colours:** the company colour system below.
5. **Stack:** Next.js, React as the core framework, React Three Fiber, Three.js.
6. **Textures loading:** Drei.
7. **Animations:** GSAP.
8. **Interaction:** React Three Fiber.
9. **Web performance:** 60 fps, model optimisation, texture baking, shader/material optimisation.

## Decided stack

| Area | Choice |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** with React. The company PDF listed Vite; Next.js was chosen for search visibility and Vercel. Akshay is to confirm this with his mentor. |
| Styling | Tailwind CSS (v4; theme tokens in `src/app/globals.css`) |
| 3D | Three.js, React Three Fiber, Drei (client-only canvas) |
| Animation | GSAP, ScrollTrigger |
| Smooth scroll | Lenis, synced to GSAP's ticker |
| UI transitions | Motion for React (in the company stack; not used yet) |
| Others (from the company stack) | Zustand only if needed; Lucide React icons; GLB/glTF models; Blender and Spline for 3D assets; Git + GitHub; Vercel |
| Fonts | Self-hosted via `@fontsource-variable`: Bricolage Grotesque (display), Hanken Grotesk (body) |
| Performance | Lazy loading, code splitting, WebP/AVIF images, compressed 3D models (Draco/Meshopt, KTX2), capped pixel ratio, static fallback for low-end devices |
| Accessibility | Reduced-motion support, keyboard navigation, visible focus |

Full company stack: `docs/Informatie_Tech_Stack.pdf`. Same content in `docs/Paramarsh_Tech_Stack_and_Plan.xlsx`.

## Colour system (company-provided)

Image: `docs/colour-system.png`.

| Token | HEX | Role | Intent |
|---|---|---|---|
| Deep Navy | `#13233A` | Primary brand / headings | Competence, stability, seriousness |
| Clarity Blue | `#246BFE` | Primary action / links | Orientation, focus, forward movement |
| Open Cyan | `#56C8E8` | Diagram / secondary accent | Openness and explanation |
| Human Mint | `#CDEFE5` | Supportive backgrounds | Care, calm and psychological safety |
| Insight Yellow | `#F5C451` | Selective highlight | Attention and discovery, without alarm |
| Ink | `#172033` | Body copy | Softer than black; high readability |
| Cloud | `#F4F7FA` | Panels / page background | Separation without visual noise |
| Caution Red | `#B5473A` | Errors / risk only | Clear warning; never decorative |

Rules: do not add colours without approval. Insight Yellow is used sparingly and Caution Red only for errors. Pillar shards use Clarity Blue (competence), Open Cyan (transparency), Human Mint (benevolence), Insight Yellow (consistency).

## Planned page structure

1. Navigation (minimal sticky bar: logo, Contact)
2. **Hero:** headline, subline, one call to action; four asymmetric shards beside it
3. **Trust forms:** scroll joins the shards into one form
4. **The four pillars:** one scroll beat each, with promise and proof
5. Focus areas (SDG 03, 04, 09, 12)
6. Strategic approach
7. About
8. Careers
9. Contact: a form that emails `queries@paramarsh.dev` (Next.js route plus an email service such as Resend; API key only in Vercel env settings; spam trap, rate limit, server-side validation, privacy consent). Needs company DNS access to send from the `paramarsh.dev` domain.
10. Footer (Privacy, Terms)

## Site status (showcase build)

The full landing page lives in this folder (the demo zip was unpacked here and extended). Run with `npm install`, then `npm run dev`. Checked in a browser at 1440×900 and 375×812. Build, lint and unit tests pass. See `README.md` for structure.

- Sections built: header (phone menu), hero, pinned trust pillars, focus areas, strategic approach (Research, Innovation, Scale, from the live site), who we are, careers, contact form, footer, placeholder Privacy and Terms pages.
- All copy lives in `src/content/site.ts`. Live-site wording is used where it exists. Placeholder lines are marked `PLACEHOLDER`.
- Contact: `POST /api/contact` validates input, rate-limits, and has a honeypot. It sends via Resend only if `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are set; otherwise the form opens the visitor's email app, addressed to queries@paramarsh.dev.
- Assets: the company symbol was downloaded from paramarsh.dev into `public/brand/`, plus a generated light version, favicon, Apple icon and Open Graph card. The symbol's green is the company's logo colour and is not in the colour system. It appears only in the logo.
- 3D: the shards are double-sided. They shrink on narrow and square-ish screens, and the canvas stops rendering once the content covers it.

### Earlier two-window demo notes

- **Window 1:** navy hero; four shards drift beside the headline, with pointer parallax; one entrance animation.
- **Window 2:** the page pins; background eases navy to cloud; shards join into one icosahedron; each pillar is read in turn while its shard lights up; at the end all four show together.
- Reduced motion: no Lenis, no pinning, shards already joined.
- Key files: `src/components/Experience.tsx` (layout, Lenis, ScrollTrigger, copy), `src/components/Scene.tsx` (3D), `src/lib/sceneState.ts` (shared scroll state), `src/app/globals.css` (tokens, pillar positions).
- **All copy is demo copy.** The headline and subline come from the live site. The four pillar lines are placeholders, to be replaced with the company's wording.
- Not tested: real-GPU frame rate on a laptop and a mid-range phone. Check before the showcase.

## Open items

- Company instructions after the showcase (these override this file).
- Confirm Next.js over Vite with the mentor.
- Strategic approach: the live site lists Research, Innovation and Scale. Deeper detail for each is still needed.
- Privacy Policy and Terms of Service text.
- Real pillar promises and proof points.
- Whether the repo stays on Akshay's account or moves to a company GitHub organisation.
- Contact form: recipients, DNS access for sending, mentor approval for an email service.
- Analytics: undecided.

## Working agreements

- **Plan before building.** Ask before large steps.
- **Never push or commit without Akshay's explicit approval, every session.** Pushing needs the repo attached with push access, which Akshay approves each time.
- Never invent claims about the company. Mark placeholder copy clearly.
- Never commit secrets (API keys, tokens). Use environment variables.
- The company brief and colour system come first. Installed design skills are advisory only.
- Targets: 60 fps, small first load, text before 3D, accessible, reduced-motion safe.

## Installed tooling (Akshay's Mac, global Claude Code skills)

- `frontend-design` (Anthropic): `~/.claude/skills/frontend-design`
- `ui-ux-pro-max` (installed with `npx ui-ux-pro-max-cli init --ai claude --global`)
- Note: global `npm install -g` failed with a permissions error on this Mac. Use `npx`, or set an npm prefix in the home folder.

## Assets in `docs/`

- `Informatie_Tech_Stack.pdf`: company-provided technology stack
- `colour-system.png`: company-provided colour system
- `Paramarsh_Tech_Stack_and_Plan.xlsx`: stack, colours, plan implications, landing page plan, open questions
