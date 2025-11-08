import { createBrowserRouter, Outlet } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Authentication/Login";
import { SignUp } from "@/pages/Authentication/SignUp";
import { Dashboard } from "@/pages/Dashboard";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { Groups } from "@/pages/Group/Groups";
import { GroupDetails } from "@/pages/Group/GroupDetails";
import { GroupSettings } from "@/pages/Group/GroupSettings";
import { ShiftDetail } from "@/pages/ShiftDetail";
import { NotFound } from "@/pages/NotFound";
import { DataProvider } from "@/api/providers/DataProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./DashboardLayout";
import { OrganizationDashboard } from "../pages/Organization/OrganizationDashboard";

export const router = createBrowserRouter([
  // Rotas públicas (sem layout)
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },

  // Rotas autenticadas com layout
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: (
          <DataProvider>
            <DashboardLayout />
          </DataProvider>
        ),
        children: [
          {
            path: "/dashboard",
            element: <OrganizationDashboard />,
          },
          {
            path: "/groups",
            element: <Groups />,
          },
          {
            path: "/groups/:id",
            element: <GroupDetails />,
          },
          {
            path: "/groups/:id/settings",
            element: <GroupSettings />,
          },
          {
            path: "/shifts/:id",
            element: <ShiftDetail />,
          },
        ],
      },
    ],
  },

  // Rota discover (mantém o Dashboard antigo)
  {
    path: "/discover",
    element: <Dashboard />,
  },

  // Rota 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
