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
}

export default nextConfig
