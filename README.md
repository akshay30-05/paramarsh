# Paramarsh website

Landing page for **Paramarsh Global Sustainable Development Pvt. Ltd.** (Varanasi, Uttar Pradesh),
built for the company showcase. Content follows the live site at
[paramarsh.dev](https://www.paramarsh.dev). Design follows the company brief: four trust pillars,
fragmented and asymmetric geometry, warm smooth scrolling and the company colour system.

**Stack:** Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, React Three Fiber + Drei + Three.js,
GSAP ScrollTrigger, Lenis, Lucide icons.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (contact form validation)
npm run lint
npm run build    # production build check
```

Requires Node 20+. Developed on Node 24.

## Page structure

| # | Section | Notes |
|---|---|---|
| 1 | Header | Logo, nav, contact. A full-screen menu on phones and tablets |
| 2 | Hero | Headline from the live site. Four pillar shards in 3D, with pointer parallax |
| 3 | Trust pillars | Pinned scroll beat. Shards join into one form while each pillar lights up |
| 4 | Focus areas | SDG 03, 12, 04, 09, with copy from the live site |
| 5 | Strategic approach | Research, Innovation, Scale |
| 6 | Who we are | Statement and company facts |
| 7 | Careers | Speculative application by email |
| 8 | Contact | Validated form, honeypot, rate limit, consent |
| 9 | Footer | Links, Privacy and Terms pages (placeholders) |

## Contact form

`POST /api/contact` validates every field on the server (`src/lib/contact.ts`, shared with the browser).
It rejects oversized bodies, rate-limits by IP and drops honeypot submissions.

- **With email configured** (`RESEND_API_KEY` and `CONTACT_FROM_EMAIL`, see `.env.example`), the
  message is sent through [Resend](https://resend.com) to `CONTACT_TO_EMAIL`.
- **Without it** (the default), the form opens the visitor's email app with the message filled in,
  addressed to `queries@paramarsh.dev`. Nothing is lost, and no key is needed for the demo.

Sending from `@paramarsh.dev` needs DNS access to verify the domain in Resend.

## Where things live

| Path | Role |
|---|---|
| `src/content/site.ts` | **All copy.** Placeholder lines are marked `PLACEHOLDER` |
| `src/components/Experience.tsx` | Hero, pinned pillars, Lenis, all scroll animation |
| `src/components/Scene.tsx` | The 3D shards. Pauses rendering once content covers it |
| `src/components/sections/*` | Focus areas, approach, about, careers, contact |
| `src/components/SiteHeader.tsx`, `SiteFooter.tsx` | Navigation and footer |
| `src/lib/contact.ts` | Contact validation (unit-tested in `contact.test.ts`) |
| `src/app/api/contact/route.ts` | Contact endpoint |
| `src/app/globals.css` | Colour tokens, fonts, component styles |
| `public/brand/` | Company symbol (from paramarsh.dev) and a light version for dark backgrounds |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` | Favicon and social share card |

## Accessibility and performance

- `prefers-reduced-motion`: no smooth scroll, no pinning, no reveal animation, and the shards start
  already joined.
- Skip link, visible focus states, labelled form errors, keyboard-friendly menu (Esc closes it).
- The 3D canvas loads only in the browser, lowers its pixel ratio when frame rate drops, and stops
  rendering once page content covers it. The text renders before the 3D.
- Self-hosted variable fonts (Bricolage Grotesque, Hanken Grotesk). No external requests.

## Before going live

- Replace the placeholder copy in `src/content/site.ts` (pillar lines, contact intro).
- Add the real Privacy Policy and Terms of Service text.
- Check frame rate on a real laptop GPU and on a mid-range phone.
- Set the email env vars in Vercel if the form should send directly.
