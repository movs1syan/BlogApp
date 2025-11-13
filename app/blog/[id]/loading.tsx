export default function Loading() {
  return (
    <main className={"pt-5 md:max-w-200"}>
      <div className="flex flex-col gap-3">
        <div className="h-[450px] rounded-md w-full bg-gray-300 animate-pulse"></div>
        <div className="w-[20%] h-4 rounded-md bg-gray-300 animate-pulse"></div>
        <div className="flex flex-col gap-3 mt-3">
          <div className="w-[40%] h-4 rounded-md bg-gray-300 animate-pulse"></div>
          <div className="w-[50%] h-4 rounded-md bg-gray-300 animate-pulse"></div>
          <div className="w-full h-25 rounded-md bg-gray-300 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="flex flex-col gap-3 w-[30%]">
            <div className="h-3 rounded-md bg-gray-300 animate-pulse"></div>
            <div className="h-3 w-[80%] rounded-md bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}