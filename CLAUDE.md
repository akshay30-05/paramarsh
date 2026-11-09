# CLAUDE.md: Paramarsh website project

Project brief and working notes. Read this first in every session.

## Status: restart (Beyond the Surface)

The earlier showcase build (four 3D shards, pinned pillars, single landing page) is **superseded**. The
site is being rebuilt from scratch around the approved **Beyond the Surface** creative direction: an
interactive documentary homepage plus a conventional corporate website. The old code stays in git history
(commit `3905571`) for reference only. Do not extend it; rebuild section by section against the plan below.

Source documents (in the Claude Project "paramarsh"):

- `Paramarsh_Beyond_the_Surface_Creative_Blueprint.pdf`: creative direction, stack, roadmap G1 to G7.
- `Paramarsh_Detailed_Pillar_User_Stories.docx`: chapter scripts, user stories, acceptance criteria.

If the company gives new instructions, they override this file.

## Who and what

- Akshay is a frontend web developer intern at Paramarsh and is building the company website.
- Repo: https://github.com/akshay30-05/paramarsh (Akshay's own account).
- Mac: Apple silicon, Node 24.

## The company

- Paramarsh Global Sustainable Development Pvt. Ltd., Uttar Pradesh (registered 2023, research and experimental development). Site: https://www.paramarsh.dev
- Contact on the live site: Varanasi, Uttar Pradesh, `queries@paramarsh.dev`.
- Live site today: tagline "Building a more responsible future"; four SDG focus areas (03, 12, 04, 09); strategic approach (Research, Innovation, Scale); careers; contact; Privacy and Terms.
- There is no "Paramarsh Mall" product. That was a voice-to-text mix-up. Never mention it.

## Creative direction (approved)

- **Core statement:** visitors should not only see what Paramarsh does; they should understand how Paramarsh thinks.
- **Direction:** interactive documentary. Cinematic photography and video, editorial typography, restrained environmental 3D, human-centred story.
- **Intensity:** balanced. Immersive but easy to navigate; immersion must never block services, work, careers or contact.
- **Key rule:** every animation must communicate something. 3D is an environment the visitor enters, not an object they look at.
- **Audience:** clients, development partners and stakeholders.
- **Journey:** Curiosity, Discovery, Understanding, Confidence, Connection.

### Story structure: opening + four chapters + conclusion

| # | Sequence | Line | Environment |
|---|---|---|---|
| 00 | Opening film, the question | "Progress is easy to promise. Making it meaningful is harder." Then: "What does it actually take to create meaningful development?" | Full-screen cinematic landscape, slow forward camera |
| 01 | Competence | Before we act, we understand. | Explorable terrain with layers: geography, people, economics, environment |
| 02 | Consistency | The standard should never change. | Long architectural corridor; light and weather change, structure holds; lifecycle milestones (brief, research, planning, implementation, evaluation, learning) |
| 03 | Transparency | Nothing important should be hidden. | Translucent architecture; selectable layers: Methods, Sources, Decisions, Limitations |
| 04 | Benevolence | Development is ultimately about people. | Documentary photography and video; individual, community and environment perspectives |
| 05 | Conclusion, what progress leaves behind | "The work is never just about what we build. It is about how we build it, why we build it, and who it serves." | Quiet editorial close; routes to Our Work, Start a Conversation, Who We Are |

Pillar promises: Competence, grounded in research and a multidisciplinary team. Consistency, the same
standard on the first project and the fiftieth. Transparency, methods, sources and limits stay visible.
Benevolence, every idea is judged by who it helps, not only who it pays. Full scripts, user stories and
acceptance criteria are in the pillar user stories document.

### Site architecture

Home (the documentary), Who We Are, What We Do, How We Do It (the four pillars with evidence), Our Work,
Careers, Contact. Next.js routes: `/`, `/who-we-are`, `/what-we-do`, `/how-we-do-it`, `/our-work`,
`/careers`, `/contact`, plus `/privacy` and `/terms`.

## Decided stack

| Area | Choice |
|---|---|
| Framework | **Next.js (App Router) + TypeScript** with React. The blueprint suggests Vite; the team stays on Next.js for search visibility and Vercel. Revisit only if the mentor requires Vite. |
| Styling | Tailwind CSS v4; tokens in `src/app/globals.css` |
| 3D | Three.js, React Three Fiber, Drei. Scenes load with `dynamic(..., { ssr: false })`; every scene and scroll component is a client component |
| Scroll and animation | GSAP + ScrollTrigger; Lenis only if it stays accessible and reliable |
| Assets | Blender for environments, GLB (Draco/Meshopt, KTX2), FFmpeg for responsive video encodes |
| Fonts | Instrument Serif (display) and Manrope (body), via `next/font` |
| Hosting | Vercel |

Rendering strategy: real-time 3D for terrain, interactive layers and camera movement; pre-rendered video
for complex cinematic transitions and footage; native HTML for all text, navigation, buttons and forms.
Use the cheapest medium that achieves the effect.

Vite to Next.js translation: app router instead of `routes.tsx`; `next/font`; `"use client"` on scene and
scroll components.

## Colour palette (blueprint, suggested)

| Token | HEX | Role |
|---|---|---|
| Midnight charcoal | `#111A24` | Cinematic openings, deep sections |
| Warm editorial white | `#E9E8E2` | Main reading environments |
| Muted sage | `#A9B8B1` | Environmental accents |
| Earth ochre | `#B58A52` | Warm highlights, details |
| Deep slate blue | `#263D52` | Research and information |

The earlier company colour system (Deep Navy `#13233A`, Clarity Blue `#246BFE`, Open Cyan `#56C8E8`,
Human Mint `#CDEFE5`, Insight Yellow `#F5C451`, Ink `#172033`, Cloud `#F4F7FA`, Caution Red `#B5473A`,
see `docs/colour-system.png`) is **not removed**. The blueprint palette is the working default for the
documentary; the mentor must confirm how the two relate. Do not add colours beyond these two sets without
approval. Use Caution Red only for errors.

## Roadmap (G1 to G7)

| Goal | Scope | Deliverable |
|---|---|---|
| G1 | Creative foundation and **visual prototype**: tokens, type, one polished sequence (opening landscape, typography, nav, scroll camera, one transition into an environment, one meaningful interaction, transition to editorial text) | Approved visual system and prototype |
| G2 | Opening documentary: opening scene, video and typography, scroll orchestration, nav, chapter indicator | Working opening |
| G3 | Competence and Consistency chapters | Two complete chapters |
| G4 | Transparency and Benevolence chapters | Two complete chapters |
| G5 | Orchestration: connect scenes, camera and scroll timelines, chapter navigation, conclusion and CTAs | Full homepage documentary |
| G6 | Corporate website pages; connect pillars to evidence | Complete site |
| G7 | Production readiness: responsive, optimisation, accessibility, cross-browser, SEO, analytics | Production site |

**Current goal: G1.** Build order: tokens and fonts, static layout (opening, nav, chapter indicator),
scroll orchestration, terrain scene with mobile fallback, layer interaction with accessibility paths,
real-device performance check, demo.

## Experience rules

- Scroll drives camera and chapter progression and never hijacks basic browser behaviour.
- Persistent chapter indicator, direct chapter jumps, and a clear skip-documentary option.
- Audio and video are muted by default, with accessible controls and a no-audio path.
- Every chapter must be understandable without interacting with the 3D scene.
- All essential text lives in semantic HTML, never baked into video or 3D surfaces.
- Reduced motion: replace camera travel with fades and static compositions.
- Touch: tap alternatives for hover; simplified drag gestures.

## Performance and accessibility targets

- Lighthouse performance 90+ where practical, accessibility 95+, CLS under 0.1, LCP under 2.5 s.
- Lazy-load scenes; dispose unused 3D assets; never run several heavy scenes at once.
- Static or video fallback on low-power devices and when WebGL is unavailable.
- Keyboard navigation, visible focus, contrast, captions or transcripts for spoken content.
- Test on a real laptop GPU and a mid-range phone, not only the dev machine.

## Content and authenticity (non-negotiable)

- Never invent project results, community impact, research findings, client relationships or capabilities.
- Hypothetical examples must be labelled illustrative. Where evidence is missing, use philosophical storytelling, not fictional case studies.
- Real people and communities appear only with informed consent and permission.
- Mark all placeholder copy and placeholder imagery clearly (`PLACEHOLDER`).

Needed from Paramarsh: mission and positioning, real service descriptions, team profiles and photos,
case studies, research methodology, quality and governance practices, reports and data sources,
stakeholder engagement evidence, logos and brand guidelines, fieldwork footage and permissions.

## Open items

- Company instructions after the showcase (these override this file).
- Mentor confirmation: Next.js over Vite, and the colour palette (blueprint set vs company colour system).
- All real content listed above.
- Footage: real fieldwork or approved imagery; placeholder landscape for the G1 prototype.
- Privacy Policy and Terms of Service text.
- Contact form: recipients, DNS access for sending from `paramarsh.dev`, approval for an email service.
- Whether the repo stays on Akshay's account or moves to a company GitHub organisation.
- Analytics: undecided. The blueprint suggests comparing the documentary against a simpler homepage variant.

## Working agreements

- **Plan before building.** Ask before large steps.
- **Never push or commit without Akshay's explicit approval, every session.** Pushing needs the repo attached with push access, which Akshay approves each time.
- Never commit secrets. Use environment variables.
- Installed design skills are advisory only.
- Targets: small first load, text before 3D, accessible, reduced-motion safe.

## Assets in `docs/`

- `Informatie_Tech_Stack.pdf`: company-provided technology stack
- `colour-system.png`: company-provided colour system
- `Paramarsh_Tech_Stack_and_Plan.xlsx`: earlier stack and plan
