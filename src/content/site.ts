// All page copy in one place.
// Opening, chapter and conclusion copy comes from the approved Beyond the Surface documents.
// Anything marked PLACEHOLDER must be replaced with real, approved Paramarsh material.

export const COMPANY = {
  name: "Paramarsh",
  legalName: "Paramarsh Global Sustainable Development Pvt. Ltd.",
  descriptor: "Global Sustainable Development",
  email: "queries@paramarsh.dev",
  location: "Varanasi, Uttar Pradesh",
  url: "https://www.paramarsh.dev",
} as const;

export const OPENING = {
  line1: "Progress is easy to promise. Making it meaningful is harder.",
  line2: "What does it actually take to create meaningful development?",
  // PLACEHOLDER: the landscape is drawn artwork until real fieldwork footage is supplied.
  placeholderNote: "Placeholder landscape. Real fieldwork footage to follow.",
} as const;

export type Chapter = {
  id: string;
  number: string;
  title: string;
  line: string;
  promise: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "competence",
    number: "01",
    title: "Competence",
    line: "Before we act, we understand.",
    promise: "Grounded in research and built by a multidisciplinary team.",
  },
  {
    id: "consistency",
    number: "02",
    title: "Consistency",
    line: "The standard should never change.",
    promise: "The same standard on the first project and the fiftieth.",
  },
  {
    id: "transparency",
    number: "03",
    title: "Transparency",
    line: "Nothing important should be hidden.",
    promise: "Methods, sources and limits stay visible to the people we work with.",
  },
  {
    id: "benevolence",
    number: "04",
    title: "Benevolence",
    line: "Development is ultimately about people.",
    promise: "Every idea is judged by who it helps, not only who it pays.",
  },
] as const;

export const COMPETENCE_COPY = [
  "Every challenge has a context.",
  "Before we look for answers, we need to understand the questions, the people and the circumstances that shape them.",
  "Meaningful development requires more than good intentions. It requires rigorous research, grounded evidence and people who understand the complexity of the challenges they are working to solve.",
  "We bring different disciplines, perspectives and expertise together so that decisions have a reason behind them.",
] as const;

export const CONCLUSION = {
  eyebrow: "Conclusion",
  title: "What progress leaves behind",
  line: "The work is never just about what we build. It is about how we build it, why we build it, and who it serves.",
  pillars: "Competence. Consistency. Transparency. Benevolence.",
  invitation: "Let's build something meaningful together.",
} as const;

// Competence: the explorable terrain. The intro and close lines come from the
// pillar user stories; the four layer explanations are PROPOSED copy derived
// from that document and need Paramarsh's approval.
export const COMPETENCE_EXPLORE = {
  intro: "Every challenge exists within a larger context. Look closer.",
  prompt: "Choose a layer to bring it into focus.",
  close: "Looking at a problem from only one angle can lead to an incomplete understanding.",
  note: "Illustrative landscape, not a real project site.",
} as const;

export type LayerId = "geography" | "people" | "economics" | "environment";

export const LAYERS: readonly { id: LayerId; label: string; text: string }[] = [
  {
    id: "geography",
    label: "Geography",
    text: "The shape of the land comes first. Terrain decides where water runs, where roads can go and how hard a place is to reach, long before any plan is drawn.",
  },
  {
    id: "people",
    label: "People",
    text: "Where people live, travel, work and gather. A plan that looks efficient on a map can still miss the places and routes people actually depend on.",
  },
  {
    id: "economics",
    label: "Economics",
    text: "The systems and resources that shape what is possible: how goods, work and income move between places, and who is connected to them.",
  },
  {
    id: "environment",
    label: "Environment",
    text: "Land, water and ecosystems are not background scenery. They are part of the context in which every decision has consequences.",
  },
] as const;

export const COMPETENCE_TRANSITION =
  "Understanding is where it begins. But insight only becomes valuable when the same care is carried through the work.";

// Corporate pages from the blueprint's site architecture. Their content arrives in G6.
export const PAGES = [
  { label: "Who We Are", href: "/who-we-are", purpose: "Identity, mission, values, team and organisation background." },
  { label: "What We Do", href: "/what-we-do", purpose: "Services, capabilities and areas of expertise." },
  { label: "How We Do It", href: "/how-we-do-it", purpose: "The four principles, methodologies and working practices." },
  { label: "Our Work", href: "/our-work", purpose: "Projects, case studies, evidence and outcomes." },
  { label: "Careers", href: "/careers", purpose: "People, culture and opportunities." },
  { label: "Contact", href: "/contact", purpose: "Enquiries, partnerships and the contact form." },
] as const;

export const NAV_LINKS = [{ label: "Contact", href: "/contact" }] as const;

// Topics from the paramarsh.dev contact form (used by the contact form, built in G6)
export const CONTACT_TOPICS = [
  "Partnership & Collaboration",
  "Research & Projects",
  "Media & Press",
  "Careers & Volunteering",
  "General Inquiry",
] as const;
