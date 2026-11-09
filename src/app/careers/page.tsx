import ComingSoonPage, { pageMetadata } from "@/components/ComingSoonPage";

export const metadata = pageMetadata("/careers");

export default function Page() {
  return <ComingSoonPage href="/careers" />;
}
