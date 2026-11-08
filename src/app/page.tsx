import Experience from "@/components/Experience";
import FocusAreas from "@/components/sections/FocusAreas";
import Approach from "@/components/sections/Approach";
import About from "@/components/sections/About";
import Careers from "@/components/sections/Careers";
import Contact from "@/components/sections/Contact";
import SiteFooter from "@/components/SiteFooter";
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
      <Experience>
        <FocusAreas />
        <Approach />
        <About />
        <Careers />
        <Contact />
      </Experience>
      <SiteFooter />
    </>
  );
}
