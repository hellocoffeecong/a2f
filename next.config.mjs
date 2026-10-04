/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Any Vercel Blob public store, so moving to another account's store needs no config change.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
