import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <main className={"pt-5"}>
      <Skeleton height={500} />

      <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-10"}>
        <CardSkeleton count={9} />
      </div>
    </main>
  );
}