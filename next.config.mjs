/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages target: the Next image optimizer is not available on the
  // edge runtime, so thumbnails are served unoptimized. Every <Image> still
  // carries explicit width/height so CLS stays at 0.
  images: {
    unoptimized: true,
  },
  // Games portal — keep the powered-by header off.
  poweredByHeader: false,
};

export default nextConfig;
