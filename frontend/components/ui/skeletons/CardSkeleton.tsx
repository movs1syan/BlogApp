const CardSkeleton = ({ count = 1 }: { count: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-skeleton pb-3">
          <div className="h-[150px] w-full rounded-md bg-gray-300 animate-pulse"></div>
          <div className="h-[50px] w-full rounded-md bg-gray-300 animate-pulse mt-3"></div>

          <div className="flex items-center gap-3 mt-3 w-full">
            <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>

            <div className="flex flex-col gap-3 ml-3 w-[120px]">
              <div className="h-3 w-full rounded-md bg-gray-300 animate-pulse"></div>
              <div className="h-3 w-[80%] rounded-md bg-gray-300 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;