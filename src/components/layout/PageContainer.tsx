import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="page-content mx-auto max-w-7xl">{children}</div>
    </main>
  );
};

export default PageContainer;
