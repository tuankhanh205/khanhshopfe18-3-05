import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Nav />
      </div>

      {/* Sidebar + Nội dung chính */}
      <div className="flex w-full pt-16">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-16 h-screen bg-white shadow-md transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Nội dung chính */}
        <div className={`flex-1 p-6 transition-all duration-300 overflow-auto ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
