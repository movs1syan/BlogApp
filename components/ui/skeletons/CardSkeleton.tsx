import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = ({ count = 1 }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-skeleton pb-3">
          <Skeleton height={150} />
          <Skeleton height={50} />
          <div className="flex items-center mt-3 w-full">
            <Skeleton circle width={50} height={50} />
            <div className="flex flex-col ml-3 w-[120px]">
              <Skeleton width="100%" height={10} />
              <Skeleton width="80%" height={10} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;