import { Mail, MapPin } from "lucide-react";
import { COMPANY, CONTACT } from "@/content/site";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-20 bg-cloud text-ink">
      <div className="section-wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow">{CONTACT.eyebrow}</p>
          <h2 id="contact-title" data-reveal className="h2 mt-4 text-balance">
            {CONTACT.title}
          </h2>
          <p data-reveal className="lead mt-6 max-w-[38ch]">
            {CONTACT.intro}
          </p>

          <ul data-reveal className="mt-12 space-y-6">
            <li className="flex items-start gap-4">
              <span className="contact-icon" aria-hidden="true">
                <MapPin size={18} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                  Headquarters
                </span>
                <span className="mt-1 block font-medium text-deep-navy">{COMPANY.location}</span>
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="contact-icon" aria-hidden="true">
                <Mail size={18} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                  Email
                </span>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-link mt-1 inline-block"
                >
                  {COMPANY.email}
                </a>
              </span>
            </li>
          </ul>
        </div>

        <div data-reveal className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
