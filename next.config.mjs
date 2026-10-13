/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Old indexed URLs end in "/", and GitHub Pages serves folder/index.html for them
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Don't let `next dev` write an AGENTS.md into the repo when an AI agent runs it
  agentRules: false,
}

export default nextConfig
