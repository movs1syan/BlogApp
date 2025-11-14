import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <main className={"pt-5"}>
      <div className="h-[500px] w-full rounded-md bg-gray-300 animate-pulse"></div>

      <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-10"}>
        <CardSkeleton count={9} />
      </div>
    </main>
  );
}