import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl animate-fade-in">{children}</div>
    </main>
  );
};

export default PageContainer;
