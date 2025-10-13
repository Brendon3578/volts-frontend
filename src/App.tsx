// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Dashboard } from "./pages/Dashboard";
import { DataProvider } from "./api/providers/DataProvider";
import { Groups } from "./pages/Group/Groups";
import { GroupDetails } from "./pages/Group/GroupDetails";
import { NotFound } from "./pages/NotFound";
import { ShiftDetail } from "./pages/ShiftDetail";
import { GroupSettings } from "./pages/Group/GroupSettings";
import { Home } from "./pages/Home";
import { Login } from "./pages/Authentication/Login";
import { SignUp } from "./pages/Authentication/SignUp";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/discover" element={<Dashboard />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupDetails />} />
              <Route path="/groups/:id/settings" element={<GroupSettings />} />
              <Route path="/shifts/:id" element={<ShiftDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
