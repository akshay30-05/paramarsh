import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMailto, validateContact } from "./contact.ts";

const TOPICS = ["General Inquiry", "Media & Press"];
const valid = {
  name: "  Asha Verma ",
  email: "Asha@Example.com",
  organization: "",
  topic: "General Inquiry",
  message: "Hello, I would like to talk about a project.",
  consent: true,
  website: "",
};

test("accepts a complete message and trims and lowercases fields", () => {
  const r = validateContact(valid, TOPICS);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.data.name, "Asha Verma");
    assert.equal(r.data.email, "asha@example.com");
  }
});

test("reports every missing required field", () => {
  const r = validateContact({}, TOPICS);
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.deepEqual(Object.keys(r.errors).sort(), ["consent", "email", "message", "name", "topic"]);
  }
});

test("rejects an invalid email address", () => {
  const r = validateContact({ ...valid, email: "asha@example" }, TOPICS);
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.errors.email);
});

test("rejects a topic that is not on the list", () => {
  const r = validateContact({ ...valid, topic: "Free money" }, TOPICS);
  assert.equal(r.ok, false);
  if (!r.ok) assert.ok(r.errors.topic);
});

test("rejects a message that is too short or too long", () => {
  const short = validateContact({ ...valid, message: "hi" }, TOPICS);
  const long = validateContact({ ...valid, message: "x".repeat(4001) }, TOPICS);
  assert.equal(short.ok, false);
  assert.equal(long.ok, false);
});

test("flags spam when the hidden honeypot field is filled", () => {
  const r = validateContact({ ...valid, website: "http://spam.example" }, TOPICS);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.spam, true);
});

test("treats non-object input as empty, not as a crash", () => {
  assert.equal(validateContact(null, TOPICS).ok, false);
  assert.equal(validateContact("text", TOPICS).ok, false);
});

test("builds an encoded mailto link with the topic in the subject", () => {
  const r = validateContact({ ...valid, organization: "Acme & Co" }, TOPICS);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  const link = buildMailto("queries@paramarsh.dev", r.data);
  assert.ok(link.startsWith("mailto:queries@paramarsh.dev?subject="));
  assert.ok(link.includes(encodeURIComponent("[General Inquiry]")));
  assert.ok(link.includes(encodeURIComponent("Organization: Acme & Co")));
});
