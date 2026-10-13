// Fixture discussion for `pnpm dev`, so the dev.to panel can be styled without a synced article.
// Loaded through a dynamic import, so it never ends up in the production bundle.
import type { DevtoComment, Discussion } from "@/components/devto-discussion"

// Initials avatar as an inline SVG, so the mock works offline
function avatar(initials: string, hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><rect width="90" height="90" fill="hsl(${hue} 55% 35%)"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#fff">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const users = {
  ana: { name: "Ana Kowalski", username: "anakowalski", profile_image_90: avatar("AK", 200) },
  sam: { name: "Sam Okafor", username: "samokafor", profile_image_90: avatar("SO", 280) },
  roy: { name: "Roy Berris", username: "royberris", profile_image_90: avatar("RB", 160) },
  lee: { name: "Lee Jansen", username: "leejansen", profile_image_90: avatar("LJ", 30) },
}

const comments: DevtoComment[] = [
  {
    id_code: "mock1",
    created_at: "2026-10-08T09:12:00Z",
    user: users.ana,
    body_html:
      "<p>Great write-up. We ran into the same problem and ended up putting the context in <code>x-agent-hints</code> extensions on the OpenAPI spec.</p><p>Did you consider <a href=\"https://modelcontextprotocol.io\">MCP</a> for discovery instead?</p>",
    children: [
      {
        id_code: "mock2",
        created_at: "2026-10-08T11:40:00Z",
        user: users.roy,
        body_html:
          "<p>Thanks Ana! We did, and MCP works well for discovery. The schema stays the source of truth though:</p><pre><code>components:\n  schemas:\n    Order:\n      description: A confirmed order, never a draft\n</code></pre>",
        children: [
          {
            id_code: "mock3",
            created_at: "2026-10-08T12:05:00Z",
            user: users.ana,
            body_html: "<blockquote><p>The schema stays the source of truth</p></blockquote><p>Agreed, that's the part most teams skip.</p>",
            children: [
              {
                id_code: "mock4",
                created_at: "2026-10-08T13:30:00Z",
                user: users.lee,
                body_html: "<p>Fourth level reply, to check that deep threads stop indenting on a phone.</p>",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id_code: "mock5",
    created_at: "2026-10-09T16:20:00Z",
    user: users.sam,
    body_html:
      "<p>Sanitizer check: the image below has an <code>onerror</code> handler and there is a script tag after it. Neither should run.</p><img src=\"https://invalid.example/x.png\" onerror=\"alert('xss')\"><script>alert('xss')</script><p style=\"color:red\">This paragraph had an inline red style.</p>",
    children: [],
  },
  {
    id_code: "mock6",
    created_at: "2026-10-10T08:00:00Z",
    body_html: "<p>[deleted]</p>",
    children: [],
  },
  // Enough extra threads to show the "Show more threads" button
  ...Array.from({ length: 10 }, (_, i) => ({
    id_code: `mockx${i}`,
    created_at: `2026-10-${String(10 + (i % 2)).padStart(2, "0")}T1${i % 10}:00:00Z`,
    user: i % 2 ? users.lee : users.sam,
    body_html: `<p>Extra thread ${i + 1}: short comment with a list.</p><ul><li>first point</li><li>second point</li></ul>`,
    children: [],
  })),
]

const countComments = (list: DevtoComment[]): number => list.reduce((sum, c) => sum + 1 + countComments(c.children), 0)

export async function loadMockDiscussion(): Promise<Discussion> {
  // A short delay keeps the loading state visible
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { reactions: 42, commentCount: countComments(comments), comments }
}
