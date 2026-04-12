import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
  },
};

export default nextConfig;
// 只有在非 Vercel 環境且不是生產環境建置時才執行
if (!process.env.VERCEL) {
  import('@opennextjs/cloudflare')
    .then(m => m.initOpenNextCloudflareForDev() || null)
    .catch(() => {
      // 在 Vercel 或找不到套件時靜默失敗，不影響建置
    });
}