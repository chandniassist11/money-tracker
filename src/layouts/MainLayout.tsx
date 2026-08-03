import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen aurora-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative flex flex-1 flex-col lg:pl-[272px]">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default MainLayout;
