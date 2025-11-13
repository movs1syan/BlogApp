import React, { Suspense } from 'react';
import Loading from "@/app/blog/[id]/loading";


const Layout= ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default Layout;