//src\app\quiz\page.tsxs
import { Suspense } from "react";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";
import QuizClient from "./QuizClient";

export const runtime = "edge";

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    }>
      <QuizClient />
    </Suspense>
  );
}