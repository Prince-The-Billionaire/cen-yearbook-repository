import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Same request as the robots meta tag, but it also covers images and API routes.
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // The "Funny" album was renamed "After Hours": keep old links working.
      { source: "/memories/funny", destination: "/memories/after-hours", permanent: false },
    ];
  },
};

export default nextConfig;
