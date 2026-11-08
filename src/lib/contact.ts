// Contact form validation, shared by the browser form and the server route.
// No imports, so it also runs under `node --test` without a bundler.

export const CONTACT_LIMITS = {
  name: 120,
  email: 200,
  organization: 160,
  topic: 80,
  message: 4000,
  messageMin: 10,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string;
  consent: boolean;
  /** Honeypot: hidden from people, so it must stay empty. */
  website: string;
}

export type ContactField = Exclude<keyof ContactInput, "website">;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors; spam?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

/** Validates untrusted input and returns trimmed, typed data or field errors. */
export function validateContact(raw: unknown, topics: readonly string[]): ContactResult {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data: ContactInput = {
    name: text(src.name),
    email: text(src.email).toLowerCase(),
    organization: text(src.organization),
    topic: text(src.topic),
    message: text(src.message),
    consent: src.consent === true || src.consent === "on" || src.consent === "true",
    website: text(src.website),
  };

  if (data.website) return { ok: false, errors: {}, spam: true };

  const errors: ContactErrors = {};
  const L = CONTACT_LIMITS;

  if (!data.name) errors.name = "Please enter your name.";
  else if (data.name.length > L.name) errors.name = `Please keep this under ${L.name} characters.`;

  if (!data.email) errors.email = "Please enter your email address.";
  else if (data.email.length > L.email || !EMAIL_RE.test(data.email))
    errors.email = "Please enter a valid email address.";

  if (data.organization.length > L.organization)
    errors.organization = `Please keep this under ${L.organization} characters.`;

  if (!topics.includes(data.topic)) errors.topic = "Please choose a topic.";

  if (data.message.length < L.messageMin)
    errors.message = `Please write at least ${L.messageMin} characters.`;
  else if (data.message.length > L.message)
    errors.message = `Please keep this under ${L.message} characters.`;

  if (!data.consent) errors.consent = "Please agree so we can reply to you.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Builds a mailto: link carrying the message, used when no email service is set up. */
export function buildMailto(to: string, d: ContactInput): string {
  const subject = `[${d.topic}] Message from ${d.name}`;
  const lines = [d.message, "", "---", `Name: ${d.name}`, `Email: ${d.email}`];
  const body = (d.organization ? [...lines, `Organization: ${d.organization}`] : lines).join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
