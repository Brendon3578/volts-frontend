import { createBrowserRouter, Outlet } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Authentication/Login";
import { SignUp } from "@/pages/Authentication/SignUp";
import { GroupDetails } from "@/pages/Group/GroupDetails";
import { GroupSettings } from "@/pages/Group/GroupSettings";
import { ShiftDetail } from "@/pages/ShiftDetail";
import { NotFound } from "@/pages/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./DashboardLayout";
import { OrganizationDashboardPage } from "../pages/Organization/OrganizationDashboardPage";
import { OrganizationDetailsPage } from "../pages/Organization/OrganizationDetailsPage";
import { OrganizationSettingsPage } from "../pages/Organization/OrganizationSettingsPage";

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
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard", // TODO: refazer página de dashboard
            element: <OrganizationDashboardPage />,
          },
          // {
          //   path: "/groups",
          //   element: <Groups />,
          // },
          {
            path: "/organizations", // TODO: refazer isso aqui
            element: <OrganizationDashboardPage />,
          },
          {
            path: "/organizations/:id",
            element: <OrganizationDetailsPage />,
          },
          {
            path: "/organizations/:id/settings",
            element: <OrganizationSettingsPage />,
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
  // {
  //   path: "/discover",
  //   element: <Dashboard />,
  // },

  // Rota 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
