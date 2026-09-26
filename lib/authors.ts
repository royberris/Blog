import authorsConfig from "@/data/authors.json"

export interface Author {
  name: string
  role: string
  bio: string
  avatar?: string
  github?: string
}

export function getAuthor(name: string | undefined | null): Author | null {
  if (!name) return null
  const entry = (authorsConfig as Record<string, Omit<Author, "name">>)[name]
  return entry ? { name, ...entry } : null
}

export function getAllAuthors(): Author[] {
  return Object.keys(authorsConfig).map((name) => getAuthor(name)!)
}
