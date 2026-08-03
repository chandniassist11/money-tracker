import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#f6f7f9]">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-40" />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative flex flex-1 flex-col lg:pl-[264px]">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default MainLayout;
