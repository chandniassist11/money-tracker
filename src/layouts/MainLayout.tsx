import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default MainLayout;