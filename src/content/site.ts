// All page copy in one place.
// Copy marked "from paramarsh.dev" is the company's current wording.
// Copy marked "PLACEHOLDER" is demo copy and must be replaced with the company's wording.

export const COMPANY = {
  name: "Paramarsh",
  legalName: "Paramarsh Global Sustainable Development Pvt. Ltd.",
  descriptor: "Global Sustainable Development",
  email: "queries@paramarsh.dev",
  location: "Varanasi, Uttar Pradesh",
  url: "https://www.paramarsh.dev",
} as const;

export const NAV = [
  { label: "Who we are", href: "#about" },
  { label: "What we do", href: "#focus" },
  { label: "How we do it", href: "#approach" },
  { label: "Careers", href: "#careers" },
] as const;

// From paramarsh.dev
export const HERO = {
  title: "Building a more responsible future",
  subline:
    "Advancing sustainable systems through research, innovation and cross-sector collaboration.",
} as const;

// Pillar names come from the company brief. The lines are PLACEHOLDER copy.
export const PILLARS = [
  {
    name: "Competence",
    line: "Grounded in research and built by a multidisciplinary team.",
    color: "#246BFE",
  },
  {
    name: "Transparency",
    line: "Methods, sources and limits stay visible to the people we work with.",
    color: "#56C8E8",
  },
  {
    name: "Benevolence",
    line: "Every idea is judged by who it helps, not only who it pays.",
    color: "#CDEFE5",
  },
  {
    name: "Consistency",
    line: "The same standard on the first project and the fiftieth.",
    color: "#F5C451",
  },
] as const;

// From paramarsh.dev
export const FOCUS_AREAS = [
  {
    sdg: "03",
    title: "Good Health and Well-Being",
    text: "Supporting thoughtful, human-centered ideas that contribute to healthier lives and outcomes.",
    color: "#246BFE",
  },
  {
    sdg: "12",
    title: "Responsible Consumption and Production",
    text: "Encouraging better use of resources, smarter systems, and lower-waste thinking.",
    color: "#56C8E8",
  },
  {
    sdg: "04",
    title: "Quality Education",
    text: "Advancing learning experiences, access, and capability-building with a future-ready lens.",
    color: "#CDEFE5",
  },
  {
    sdg: "09",
    title: "Industry, Innovation and Infrastructure",
    text: "Building for practical innovation, resilient systems, and sustainable progress.",
    color: "#F5C451",
  },
] as const;

// From paramarsh.dev
export const APPROACH = {
  title: "Our strategic approach",
  intro: "We believe in shaping ideas with clarity and purpose.",
  steps: [
    {
      name: "Research",
      text: "Grounded exploration to understand context, opportunity, and direction.",
    },
    {
      name: "Innovation",
      text: "Translating ideas into thoughtful, future-ready concepts.",
    },
    {
      name: "Scale",
      text: "Building with the intent for long-term relevance and wider impact.",
    },
  ],
} as const;

// From paramarsh.dev (facts from the company registration)
export const ABOUT = {
  statement:
    "We are a thoughtful, multidisciplinary team focused on building ideas with long-term value.",
  sdgNote:
    "Our work is grounded in the UN Sustainable Development Goals, a shared blueprint for a more equitable and resilient world.",
  facts: [
    { label: "Founded", value: "2023" },
    { label: "Headquarters", value: "Varanasi, Uttar Pradesh" },
    { label: "Field", value: "Research and experimental development" },
    { label: "Focus", value: "Four UN Sustainable Development Goals" },
  ],
} as const;

// From paramarsh.dev
export const CAREERS = {
  eyebrow: "Learn, Build and Evolve",
  title: "We are a small team with ambitious goals",
  text: "We welcome curious and energetic individuals who value ownership, adaptability, and impactful work.",
  openTitle: "Don't see the right role?",
  openText: "We're always looking for exceptional people. Send us a speculative application.",
} as const;

// Title from paramarsh.dev. The intro line is PLACEHOLDER copy.
export const CONTACT = {
  eyebrow: "Get in touch",
  title: "Let's talk about what you are building",
  intro:
    "Partnerships, research, media or careers: write to us and the team will get back to you.",
} as const;

// From paramarsh.dev
export const FOOTER_LINE =
  "Advancing sustainable systems through research, innovation, and collaboration.";

// Topics from the paramarsh.dev contact form
export const CONTACT_TOPICS = [
  "Partnership & Collaboration",
  "Research & Projects",
  "Media & Press",
  "Careers & Volunteering",
  "General Inquiry",
] as const;
