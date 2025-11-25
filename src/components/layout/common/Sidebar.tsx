import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import type { SidebarLink } from "../../../types/layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../context/Auth/useAuth";
import VoltsLogo from "@/assets/Volts_lg.svg";
import VoltsName from "@/assets/Volts_lg_name.svg";
import { UserIcon } from "./UserIcon";

type SidebarProps = {
  sidebarItems: SidebarLink[];
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
};

export function Sidebar({
  sidebarItems,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const { logout, state } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Carregar estado salvo
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const handleCollapse = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    localStorage.setItem("sidebar-collapsed", String(newValue));
  };

  const handleLogout = () => {
    logout();
    toast.success("Desconectado com sucesso!");
  };

  return (
    <>
      {/* BACKDROP — visível só no mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={cn(
          "flex flex-col bg-gray-50 border-r transition-all duration-300 h-screen fixed md:static z-40",

          // Desktop largura normal/colapsada
          collapsed ? "md:w-20" : "md:w-64",

          // Mobile slide-in/out
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
      >
        {/* Cabeçalho */}
        <div
          className={cn(
            "flex items-center p-4 border-b border-b-gray-200",
            collapsed ? "justify-center md:justify-center" : "justify-between"
          )}
        >
          {/* LOGO — oculto quando colapsado */}
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={VoltsLogo} className="size-10" />
              <img src={VoltsName} className="h-6" />
            </div>
          )}

          {/* BOTÃO COLLAPSE — APENAS DESKTOP */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleCollapse}
            className="hidden md:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>

          {/* BOTÃO FECHAR — SOMENTE MOBILE */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegação */}
        <nav
          className={cn(
            "flex-1 px-2 py-4 flex flex-col gap-2",
            collapsed && "items-center"
          )}
        >
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "justify-center"
                )}
                onClick={() => setIsMobileOpen(false)} // Fecha no mobile
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4">
              <Link className="group flex gap-3 items-center" to="/me/profile">
                <UserIcon userFullName={state.user?.name} />
                <div className="flex-1 min-w-0 group-hover:underline">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {state.user?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {state.user?.email || "email@example.com"}
                  </p>
                </div>
              </Link>

              <Button variant="outline" size={"sm"} onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          {collapsed && (
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
