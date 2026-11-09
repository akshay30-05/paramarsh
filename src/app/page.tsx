import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Journey from "@/components/documentary/Journey";
import Opening from "@/components/documentary/Opening";
import CompetenceExplore from "@/components/documentary/CompetenceExplore";
import ChapterIndicator from "@/components/documentary/ChapterIndicator";
import { CompetenceStory, UpcomingChapters, Conclusion } from "@/components/documentary/Chapters";
import { COMPANY } from "@/content/site";

// Structured data for search engines. Built only from our own constants.
const ORG_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  alternateName: COMPANY.name,
  url: COMPANY.url,
  logo: `${COMPANY.url}/brand/symbol.png`,
  email: COMPANY.email,
  foundingDate: "2023",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Varanasi",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
}).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSON_LD }} />
      <SiteNav home />
      <ChapterIndicator />
      <main id="main">
        <Journey>
          <Opening />
          <CompetenceExplore />
        </Journey>
        <CompetenceStory />
        <UpcomingChapters />
        <Conclusion />
      </main>
      <SiteFooter />
    </>
  );
}
