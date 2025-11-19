import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Settings, Bell, Building2 } from "lucide-react";
import type { SidebarLink } from "../types/layout";
import { Sidebar } from "./../components/layout/common/Sidebar";

const sidebarItems: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Organizações",
    href: "/organizations",
    icon: Building2,
  },
  // {
  //   title: "Grupos",
  //   href: "/groups",
  //   icon: Users,
  // },
  // {
  //   title: "Calendário",
  //   href: "/calendar",
  //   icon: Calendar,
  // },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardLayout() {
  const location = useLocation();

  const sidebarItem = sidebarItems.find((item) =>
    location.pathname.startsWith(item.href)
  );
  const currentPage = {
    title: sidebarItem?.title || "Dashboard",
    Icon: sidebarItem?.icon || Home,
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      <Sidebar sidebarItems={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#fdfdfd] border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 ">
              <div className="p-1.5 bg-primary rounded-md">
                <currentPage.Icon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {currentPage.title}
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
          <div className="p-6 px-8 lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl  mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
