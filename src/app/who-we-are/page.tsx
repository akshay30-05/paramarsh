import ComingSoonPage, { pageMetadata } from "@/components/ComingSoonPage";

export const metadata = pageMetadata("/who-we-are");

export default function Page() {
  return <ComingSoonPage href="/who-we-are" />;
}
