// src\app\practice\page.tsx
import { Suspense } from "react";
import LoadingScreen from "@/app/components/loadingScreen/loadingScreen";
import PracticeClient from "./PracticeClient";

;

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="h-full bg-linear-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    }>
      <PracticeClient />
    </Suspense>
  );
}