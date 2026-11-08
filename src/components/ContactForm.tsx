"use client";

import { useRef, useState, type FocusEvent, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { COMPANY, CONTACT_TOPICS } from "@/content/site";
import {
  CONTACT_LIMITS,
  buildMailto,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "handoff"; href: string }
  | { kind: "error"; message: string };

type ApiReply = { success: boolean; error?: string; errors?: ContactErrors; fallback?: "mailto" };

const FIELD_LABELS: Record<ContactField, string> = {
  name: "Full name",
  email: "Email address",
  organization: "Organization",
  topic: "Subject",
  message: "Message",
  consent: "Consent",
};
const FIELD_ORDER: ContactField[] = ["name", "email", "organization", "topic", "message", "consent"];
const SUMMARY_MIN = 2; // one error: focus the field; two or more: focus a summary

function withField(errors: ContactErrors, name: ContactField, msg?: string): ContactErrors {
  const rest = Object.fromEntries(
    Object.entries(errors).filter(([key]) => key !== name),
  ) as ContactErrors;
  return msg ? { ...rest, [name]: msg } : rest;
}

function focusField(name: ContactField) {
  document.getElementById(`contact-${name}`)?.focus();
}

function readForm(form: HTMLFormElement): Record<string, unknown> {
  const fd = new FormData(form);
  return {
    name: fd.get("name"),
    email: fd.get("email"),
    organization: fd.get("organization"),
    topic: fd.get("topic"),
    message: fd.get("message"),
    consent: fd.get("consent") === "on",
    website: fd.get("website"),
  };
}

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [attempted, setAttempted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // After the first submit attempt, fields re-check as the visitor leaves them.
  const handleBlur = (e: FocusEvent<HTMLFormElement>) => {
    const target = e.target as EventTarget;
    const name = (target instanceof HTMLElement ? target.getAttribute("name") : null) as ContactField;
    if (!FIELD_ORDER.includes(name) || (!attempted && !errors[name])) return;
    const result = validateContact(readForm(e.currentTarget), CONTACT_TOPICS);
    const msg = result.ok ? undefined : result.errors[name];
    setErrors((prev) => withField(prev, name, msg));
  };

  const handOff = (data: ContactInput) => {
    const href = buildMailto(COMPANY.email, data);
    setStatus({ kind: "handoff", href });
    window.location.href = href;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const result = validateContact(readForm(form), CONTACT_TOPICS);
    if (!result.ok) {
      if (result.spam) return setStatus({ kind: "sent" });
      setAttempted(true);
      setErrors(result.errors);
      const invalid = FIELD_ORDER.filter((f) => result.errors[f]);
      if (invalid.length >= SUMMARY_MIN) requestAnimationFrame(() => summaryRef.current?.focus());
      else focusField(invalid[0]);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const body = (await res.json().catch(() => ({ success: false }))) as ApiReply;
      if (body.success) {
        form.reset();
        return setStatus({ kind: "sent" });
      }
      if (body.fallback === "mailto") return handOff(result.data);
      if (body.errors) setErrors(body.errors);
      setStatus({ kind: "error", message: body.error ?? "Something went wrong. Please try again." });
    } catch {
      handOff(result.data);
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="form-panel" role="status">
        <CheckCircle2 size={36} className="text-clarity-blue" aria-hidden="true" />
        <h3 className="mt-5 font-display text-2xl font-semibold text-deep-navy">Thank you.</h3>
        <p className="mt-2 leading-relaxed">Your message is with the team. We will reply by email.</p>
        <button
          type="button"
          className="btn btn-ghost mt-8"
          onClick={() => {
            setAttempted(false);
            setStatus({ kind: "idle" });
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldProps = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorFor = (name: ContactField) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="field-error">
        {errors[name]}
      </p>
    ) : null;

  const sending = status.kind === "sending";
  const invalid = FIELD_ORDER.filter((f) => errors[f]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      className="form-panel"
      aria-label="Send a message"
    >
      {attempted && invalid.length >= SUMMARY_MIN && (
        <div
          ref={summaryRef}
          className="error-summary"
          role="alert"
          tabIndex={-1}
          aria-labelledby="contact-error-title"
        >
          <p id="contact-error-title" className="font-display text-lg font-semibold text-deep-navy">
            Please check {invalid.length} fields
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {invalid.map((f) => (
              <li key={f}>
                <button type="button" onClick={() => focusField(f)}>
                  {FIELD_LABELS[f]}: {errors[f]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="contact-name">Full name *</label>
          <input {...fieldProps("name")} type="text" autoComplete="name" maxLength={CONTACT_LIMITS.name} required />
          {errorFor("name")}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email address *</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" maxLength={CONTACT_LIMITS.email} required />
          {errorFor("email")}
        </div>
        <div className="field">
          <label htmlFor="contact-organization">Organization / company</label>
          <input
            {...fieldProps("organization")}
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.organization}
          />
          {errorFor("organization")}
        </div>
        <div className="field">
          <label htmlFor="contact-topic">Subject *</label>
          <select {...fieldProps("topic")} defaultValue="" required>
            <option value="" disabled>
              Select a topic…
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errorFor("topic")}
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="contact-message">Message *</label>
          <textarea {...fieldProps("message")} rows={5} maxLength={CONTACT_LIMITS.message} required />
          {errorFor("message")}
        </div>
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            {...fieldProps("consent")}
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-clarity-blue"
          />
          <span>
            I agree that Paramarsh may use these details to reply to my message, as described in the{" "}
            <a href="/privacy" className="underline underline-offset-2">
              privacy policy
            </a>
            .
          </span>
        </label>
        {errorFor("consent")}
      </div>

      {status.kind === "error" && (
        <p className="field-error mt-5" role="alert">
          {status.message}
        </p>
      )}
      {status.kind === "handoff" && (
        <p className="mt-5 flex items-start gap-2 rounded-sm bg-human-mint/60 p-4 text-sm" role="status">
          <Mail size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Your message is ready in your email app. If it did not open,{" "}
            <a href={status.href} className="font-medium underline underline-offset-2">
              open it here
            </a>{" "}
            or write to {COMPANY.email}.
          </span>
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto" disabled={sending}>
        {sending ? "Sending…" : "Send message"}
        {!sending && <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}
