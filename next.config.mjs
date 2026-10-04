/** @type {import('next').NextConfig} */
const nextConfig = {
  // `next dev` would otherwise append its own agent notes to CLAUDE.md (project rules file).
  agentRules: false,
  images: {
    // Any Vercel Blob public store, so moving to another account's store needs no config change.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
