"use client"

import { useEffect, useRef, useState } from "react"
import DOMPurify from "dompurify"
import { ArrowUpRight, Heart, MessageSquare } from "lucide-react"

const API_BASE = "https://dev.to/api"
// Without this, dev.to can answer with something other than JSON
const API_HEADERS = { accept: "application/vnd.forem.api-v1+json" }
// Deeper replies stop indenting so threads stay readable on a phone
const MAX_INDENT_DEPTH = 3
// Long discussions start collapsed so the page doesn't end in a wall of comments
const INITIAL_THREADS = 10

export interface DevtoComment {
  id_code: string
  created_at: string
  body_html: string
  user?: { name: string; username: string; profile_image_90?: string }
  children: DevtoComment[]
}

export interface Discussion {
  reactions: number
  commentCount: number
  comments: DevtoComment[]
}

type State = { status: "idle" | "loading" | "error" } | { status: "ready"; discussion: Discussion }

let purifyConfigured = false

// Comment HTML comes from dev.to, so strip anything active and open links in a new tab
function sanitize(html: string): string {
  if (!purifyConfigured) {
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank")
        node.setAttribute("rel", "nofollow noopener noreferrer")
      }
      if (node.tagName === "IMG") node.setAttribute("loading", "lazy")
    })
    purifyConfigured = true
  }
  return DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "form", "input", "button", "iframe", "script"],
    FORBID_ATTR: ["style", "class", "id"],
  })
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: API_HEADERS })
  if (!response.ok) throw new Error(`dev.to ${path}: ${response.status}`)
  return response.json()
}

async function loadDiscussion(articleId: number): Promise<Discussion> {
  const [article, comments] = await Promise.all([
    fetchJson<{ public_reactions_count: number; comments_count: number }>(`/articles/${articleId}`),
    fetchJson<DevtoComment[]>(`/comments?a_id=${articleId}`),
  ])
  return { reactions: article.public_reactions_count, commentCount: article.comments_count, comments }
}

const formatCommentDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

function Comment({ comment, depth }: { comment: DevtoComment; depth: number }) {
  const user = comment.user
  return (
    <li>
      <article className={depth === 0 ? "py-5" : "pt-4"}>
        <header className="flex items-center gap-2.5">
          {user?.profile_image_90 && (
            <img src={user.profile_image_90} alt="" width={28} height={28} loading="lazy" className="size-7 rounded-full ring-1 ring-border" />
          )}
          {user ? (
            <a
              href={`https://dev.to/${user.username}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-cyan"
            >
              {user.name}
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">Deleted user</span>
          )}
          {user ? (
            <a
              href={`https://dev.to/${user.username}/comment/${comment.id_code}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="hud-label hover:text-foreground"
            >
              <time dateTime={comment.created_at}>{formatCommentDate(comment.created_at)}</time>
            </a>
          ) : (
            <time dateTime={comment.created_at} className="hud-label">{formatCommentDate(comment.created_at)}</time>
          )}
        </header>
        <div className="devto-comment mt-2 text-sm leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: sanitize(comment.body_html) }} />
      </article>
      {comment.children.length > 0 && (
        <ul className={`${depth < MAX_INDENT_DEPTH ? "ml-3.5 border-l border-border/60 pl-4 md:pl-6" : ""} ${depth === 0 ? "mb-5" : ""}`}>
          {comment.children.map((child) => (
            <Comment key={child.id_code} comment={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function DevtoDiscussion({ articleId, url, mock = false }: { articleId: number; url: string; mock?: boolean }) {
  const [state, setState] = useState<State>({ status: "idle" })
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Only call dev.to once the reader gets near the end of the node
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let cancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setState({ status: "loading" })
        // The NODE_ENV check lets the production build drop the fixture chunk entirely
        const load =
          process.env.NODE_ENV === "development" && mock
            ? import("@/lib/devto-mock").then((m) => m.loadMockDiscussion())
            : loadDiscussion(articleId)
        load
          .then((discussion) => !cancelled && setState({ status: "ready", discussion }))
          .catch(() => !cancelled && setState({ status: "error" }))
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(section)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [articleId, mock])

  const discussion = state.status === "ready" ? state.discussion : null
  const threads = discussion ? (showAll ? discussion.comments : discussion.comments.slice(0, INITIAL_THREADS)) : []
  const hiddenThreads = discussion ? discussion.comments.length - threads.length : 0

  const discussButton = (
    <a
      href={`${url}#comments`}
      target="_blank"
      rel="noopener noreferrer"
      className="hud-chip border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20"
    >
      Discuss on dev.to
      <ArrowUpRight className="size-3" />
    </a>
  )

  // An open section rather than another card, so it doesn't read as part of the node navigation above
  return (
    <section ref={sectionRef} className="mt-14 border-t border-border/60 pt-10" aria-labelledby="discussion-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hud-label flex items-center gap-2 text-cyan">
            <MessageSquare className="size-3.5" aria-hidden />
            // via dev.to
            {mock && <span className="rounded border border-amber-400/50 px-1.5 text-amber-300">Mock data</span>}
          </p>
          <h2 id="discussion-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Discussion
          </h2>
          <div className="mt-2 flex min-h-4 items-center gap-4">
            {discussion && (
              <>
                <span className="hud-label flex items-center gap-1.5">
                  <Heart className="size-3" aria-hidden />
                  {plural(discussion.reactions, "reaction")}
                </span>
                <span className="hud-label flex items-center gap-1.5">
                  <MessageSquare className="size-3" aria-hidden />
                  {plural(discussion.commentCount, "comment")}
                </span>
              </>
            )}
          </div>
        </div>
        {discussButton}
      </div>

      <div className="mt-6" aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && <p className="hud-label py-4">Loading comments…</p>}
        {state.status === "error" && <p className="py-4 text-sm text-muted-foreground">Comments could not be loaded. Read them on dev.to.</p>}
        {discussion && discussion.comments.length === 0 && (
          <p className="py-4 text-sm text-muted-foreground">No comments yet. Start the discussion on dev.to.</p>
        )}
        {threads.length > 0 && (
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {threads.map((comment) => (
              <Comment key={comment.id_code} comment={comment} depth={0} />
            ))}
          </ul>
        )}
        {hiddenThreads > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setShowAll(true)} className="hud-chip hover:border-cyan hover:text-cyan">
              Show {plural(hiddenThreads, "more thread")}
            </button>
            {discussButton}
          </div>
        )}
        {threads.length > 0 && hiddenThreads === 0 && <div className="mt-5">{discussButton}</div>}
      </div>
    </section>
  )
}
