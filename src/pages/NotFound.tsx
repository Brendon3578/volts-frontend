import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/Auth/useAuth";
import { Button } from "../components/ui/button";

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.user;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">
          Oops! Página não encontrada
        </p>
        <div className="flex flex-col gap-8">
          {user && (
            <Button onClick={() => navigate(`/dashboard`)} className="mt-4">
              Voltar para o Dashboard
            </Button>
          )}
          <a href="/" className="text-blue-500 underline hover:text-blue-700">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
