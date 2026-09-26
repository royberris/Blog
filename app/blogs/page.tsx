import type { Metadata } from "next"
import { LegacyRedirect, legacyRedirectMetadata } from "@/components/legacy-redirect"

// The old /blogs/ list page now points at the node index
export const metadata: Metadata = legacyRedirectMetadata("/nodes/")

export default function LegacyBlogsPage() {
  return <LegacyRedirect to="/nodes/" />
}
