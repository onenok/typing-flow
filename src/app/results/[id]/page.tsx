// src/app/results/[id]/page.tsx
import ResultDetailClient from "./ResultDetailClient";
import { fetchTypingSession, fetchTypingDetails } from "@/app/typing/actions";

export const runtime = "edge";
export const dynamic = 'force-dynamic';

export default async function ResultDetailPage({ params }: { params: { id: string } }) {
  // 1. 在伺服器端直接呼叫 Action 獲取資料 (這不會產生 HTTP POST 請求)
  const session = await fetchTypingSession(params.id);
  const details = await fetchTypingDetails(params.id);

  // 2. 將抓到的資料作為 Props 傳遞給 Client Component
  return (
    <ResultDetailClient 
      initialSession={session} 
      initialDetails={details} 
    />
  );
}