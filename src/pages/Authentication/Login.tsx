import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronLeft,
  CornerDownLeft,
  Gauge,
  MessagesSquare,
  UsersRound,
} from "lucide-react";
import { LoginForm } from "../../components/layout/LoginForm";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const loginCardList = [
  {
    title: "Organizar grupos e funções de forma prática",
    icon: UsersRound,
    color: "bg-blue-500",
  },
  {
    title: "Criar e gerenciar escalas em poucos cliques",
    icon: BriefcaseBusiness,
    color: "bg-cyan-500",
  },
  {
    title: "Conectar-se com voluntários com facilidade",
    icon: MessagesSquare,
    color: "bg-teal-500",
  },
  {
    title: "Acompanhar o engajamento e resultados da equipe",
    icon: Gauge,
    color: "bg-indigo-500",
  },
];

export function Login() {
  return (
    <div className="min-h-screen bg-background lg:grid grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center bg-linear-to-tr from-sky-700 via-blue-500 to-sky-300">
        <div className="relative z-100 bg-white/15 border border-white/20 border-b-white/30 border-r-white/30 p-8 max-w-md xl:max-w-xl rounded-lg shadow backdrop-blur">
          <p className="font-poppins text-3xl xl:text-4xl font-bold text-white mb-4">
            Já pensou em tornar a gestão do voluntariado simples e eficiente?
          </p>
          <p className="font-poppins text-2xl xl:text-3xl font-bold text-white mb-4">
            Com o Volts, você pode:
          </p>
          <ul className="list-disc list-inside mt-2 text-white">
            {loginCardList.map((item, index) => (
              <li
                key={index}
                className="mb-2 xl:mb-4 flex items-center gap-2 xl:gap-4"
              >
                <span
                  className={`${item.color} size-8 xl:size-10 min-w-8 xl:min-w-10 p-1 rounded-lg flex items-center justify-center shadow `}
                >
                  <item.icon className="size-5 xl:size-6" />
                </span>
                <span className="font-poppins text-base xl:text-lg">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute rounded-full size-[max(30vw,400px)] bg-blue-500 top-10 -left-24 bg-radial-[at_25%_25%] from-blue-400 to-blue-500 to-75%" />

        <div className="absolute rounded-full size-[max(20vw,300px)] bg-blue-500 bottom-3 -right-10 bg-radial-[at_25%_25%] from-blue-500 to-blue-700 to-75%" />
      </div>

      <div className="z-100 min-h-screen w-full flex items-center justify-center bg-neutral-50 border border-l-neutral-100 shadow">
        <div className="p-6 w-full max-w-lg ">
          <Button
            variant={"outline"}
            className="absolute top-4 left-4 text-white hover:text-white"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          </Button>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
