import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";
import React from "react";

export default function Loading() {
  return (
    <main className={"pt-5"}>
      <div className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="h-6 w-10 rounded-md bg-gray-300 animate-pulse"></div>
        <div className="h-10 w-130 rounded-md bg-gray-300 animate-pulse"></div>

        <div className={"flex flex-col items-center justify-center gap-3"}>
          <div className="h-3 w-170 rounded-md bg-gray-300 animate-pulse"></div>
          <div className="h-3 w-70 rounded-md bg-gray-300 animate-pulse"></div>
        </div>

        <div className="h-10 w-100 rounded-md bg-gray-300 animate-pulse mt-7"></div>
      </div>

      <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-10"}>
        <CardSkeleton count={9} />
      </div>
    </main>
  );
}