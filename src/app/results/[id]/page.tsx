// src/app/results/[id]/page.tsx
import ResultDetailClient from "./ResultDetailClient";
import { fetchTypingSession, fetchTypingDetails } from "@/app/typing/actions";


export const dynamic = 'force-dynamic';

// 注意這裡的型別改變了：params 現在是一個 Promise
export default async function ResultDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. 必須先 await 解開 params，才能取得真實的 id
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. 使用正確的 id 呼叫資料庫
  const session = await fetchTypingSession(id);
  const details = await fetchTypingDetails(id);

  // 3. 傳遞給 Client Component
  return (
    <ResultDetailClient 
      initialSession={session} 
      initialDetails={details} 
    />
  );
}