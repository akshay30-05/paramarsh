import PageShell from "@/components/PageShell";
import { COMPANY } from "@/content/site";

// Shared shell for the privacy and terms pages. The legal text itself must
// come from the company; this page only says that it is being prepared.
export default function LegalPage({ title }: { title: string }) {
  return (
    <PageShell eyebrow="Legal" title={title}>
      <p className="reading">
        This page is being prepared. For any question about how {COMPANY.legalName} handles information, please
        write to{" "}
        <a href={`mailto:${COMPANY.email}`} className="underline decoration-ochre underline-offset-4">
          {COMPANY.email}
        </a>
        .
      </p>
    </PageShell>
  );
}
