import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      {children}
    </main>
  );
};

export default PageContainer;