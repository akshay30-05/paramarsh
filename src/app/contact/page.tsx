import { pageMetadata } from "@/components/ComingSoonPage";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";
import { COMPANY } from "@/content/site";

export const metadata = pageMetadata("/contact");

export default function Page() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Start a conversation"
      intro="Partnerships, research, projects or careers: write to us and the team will get back to you."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-6 text-[0.95rem]">
          <div>
            <p className="eyebrow-doc">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="mt-2 inline-block font-display text-2xl underline decoration-ochre underline-offset-4">
              {COMPANY.email}
            </a>
          </div>
          <div>
            <p className="eyebrow-doc">Location</p>
            <p className="mt-2">{COMPANY.location}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
