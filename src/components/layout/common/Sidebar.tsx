import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../context/AuthContext";
import type { SidebarLink } from "../../../types/layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SidebarProps = {
  sidebarItems: SidebarLink[];
};

export function Sidebar({ sidebarItems }: SidebarProps) {
  const { logout, state } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Desconectado com sucesso!");
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-50 border-r transition-all duration-300 h-screen",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Cabeçalho */}
      <div
        className={cn(
          "flex items-center p-4 border-b border-b-gray-50",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <h2 className="text-2xl font-bold text-gray-900">Volts</h2>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navegação */}
      <nav
        className={cn(
          "flex-1 px-2 py-4 flex flex-col gap-2",
          collapsed && "items-center"
        )}
      >
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {state.user?.name || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {state.user?.email || "email@example.com"}
              </p>
            </div>
            {!collapsed && (
              <Button variant="outline" size={"sm"} onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {collapsed && (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 transition-all",
              collapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
