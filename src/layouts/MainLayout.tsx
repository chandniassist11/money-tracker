import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-100 to-slate-200/50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default MainLayout;
