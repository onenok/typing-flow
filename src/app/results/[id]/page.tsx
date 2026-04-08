// src/app/results/[id]/page.tsx
import ResultDetailClient from "./ResultDetailClient";
import { fetchTypingSession, fetchTypingDetails } from "@/app/typing/actions";

export const dynamic = 'force-dynamic';

// params: [id]
export default async function ResultDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. await unwrap params to get the id
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. fetch data from server
  const session = await fetchTypingSession(id);
  const details = await fetchTypingDetails(id);

  // 3. give to Client Component
  return (
    <ResultDetailClient 
      initialSession={session} 
      initialDetails={details} 
    />
  );
}