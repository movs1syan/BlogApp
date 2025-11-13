import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <main className={"pt-5 w-full md:max-w-200"}>
      <div className="flex flex-col gap-3">
        <Skeleton height={450} />
        <Skeleton width={200} />
        <div className="flex flex-col gap-3">
          <Skeleton width={400} />
          <Skeleton width={500} />
          <Skeleton height={100} />
        </div>
        <div className="flex items-center gap-3 w-full">
          <Skeleton circle width={50} height={50} />
          <div className="flex flex-col w-[120px]">
            <Skeleton width="100%" height={10} />
            <Skeleton width="80%" height={10} />
          </div>
        </div>
      </div>
    </main>
  );
}