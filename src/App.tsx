// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { router } from "./routes/router";
import { AuthProvider } from "./context/Auth/AuthProvider";
import { DEFAULT_REACT_QUERY_STALE_TIME } from "./utils";

// Criando uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: DEFAULT_REACT_QUERY_STALE_TIME, // 5 minutos: tempo que os dados são considerados "frescos"
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
