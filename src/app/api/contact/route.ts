import { NextResponse } from "next/server";
import { CONTACT_TOPICS, COMPANY } from "@/content/site";
import { validateContact, type ContactInput } from "@/lib/contact";

// Sends contact form messages through Resend (https://resend.com) when it is
// configured. Without the env vars, it answers 503 with `fallback: "mailto"`
// so the form can hand the message to the visitor's own email app instead.

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MAX_BODY_BYTES = 16 * 1024;

// In-memory, per server instance. Good enough for a small site; use a shared
// store (e.g. Upstash Redis) if the form starts receiving abuse.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_MAX;
  hits.set(ip, limited ? recent : [...recent, now]);
  return limited;
}

type Reply = {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
  fallback?: "mailto";
};

const reply = (body: Reply, status: number) => NextResponse.json(body, { status });

async function sendWithResend(d: ContactInput, key: string, from: string, to: string) {
  const text = [
    `Topic: ${d.topic}`,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Organization: ${d.organization || "-"}`,
    "",
    d.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email,
      subject: `[Website] ${d.topic}: ${d.name}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return reply({ success: false, error: "Too many messages. Please try again later." }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return reply({ success: false, error: "Message is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ success: false, error: "Invalid request." }, 400);
  }

  const result = validateContact(body, CONTACT_TOPICS);
  if (!result.ok) {
    // Pretend success to bots so they do not retry.
    if (result.spam) return reply({ success: true }, 200);
    return reply({ success: false, error: "Please check the form.", errors: result.errors }, 422);
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || COMPANY.email;
  if (!key || !from) {
    return reply({ success: false, fallback: "mailto" }, 503);
  }

  try {
    await sendWithResend(result.data, key, from, to);
    return reply({ success: true }, 200);
  } catch (error) {
    console.error("[contact] send failed", error instanceof Error ? error.message : error);
    return reply({ success: false, fallback: "mailto" }, 502);
  }
}
