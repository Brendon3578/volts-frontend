import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Settings, Bell, Building2, Menu } from "lucide-react";
import type { SidebarLink } from "../types/layout";
import { Sidebar } from "../components/layout/common/Sidebar";
import { useState } from "react";

const sidebarItems: SidebarLink[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Organizações", href: "/organizations", icon: Building2 },
  { title: "Configurações", href: "/me/profile", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItem = sidebarItems.find((item) =>
    location.pathname.startsWith(item.href)
  );

  const CurrentIcon = sidebarItem?.icon || Home;
  const CurrentTitle = sidebarItem?.title || "Dashboard";

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        sidebarItems={sidebarItems}
        isMobileOpen={isOpen}
        setIsMobileOpen={() => setIsOpen(!isOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#fdfdfd] border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 ">
              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 rounded-md border hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>

              <div className="p-1.5 bg-primary rounded-md hidden md:flex">
                <CurrentIcon className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-2xl font-semibold text-gray-800 font-poppins">
                {CurrentTitle}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#fdfdfd]">
          <div className="p-4 pb-6 px-2 md:p-6 md:px-8 lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
