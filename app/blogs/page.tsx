import { LegacyRedirect } from "@/components/legacy-redirect"

// The old list page now points at the node map
export const metadata = {
  title: "Moved",
  robots: { index: false },
  alternates: { canonical: "/" },
}

export default function LegacyBlogsPage() {
  return <LegacyRedirect to="/" />
}
