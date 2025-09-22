// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Home } from "./pages/Home";
import { DataProvider } from "./api/providers/DataProvider";
// import { DataProvider } from "./providers/DataProvider";
// import Index from "./pages/Index";
// import Groups from "./pages/Groups";
// import GroupDetail from "./pages/GroupDetail";
// import ShiftDetail from "./pages/ShiftDetail";
// import NotFound from "./pages/NotFound";

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
              {/* <Route path="/groups" element={<Groups />} /> */}
              {/* <Route path="/groups/:id" element={<GroupDetail />} /> */}
              {/* <Route path="/shifts/:id" element={<ShiftDetail />} /> */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
