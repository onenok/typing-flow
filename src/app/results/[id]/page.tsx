// src\app\results\[id]\page.tsx

import ResultDetailClient from "./ResultDetailClient";

export const runtime = "edge";
export const dynamic = 'force-dynamic';
export default function ResultDetailPage() {
  return <ResultDetailClient />;
}