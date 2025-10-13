import { ChartColumn, ChevronRight, Menu, SquareCheckBig } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

// Import images
import VoltsLogo from "@/assets/Volts_lg.svg";
import VoltsName from "@/assets/Volts_lg_name.svg";
import HeroImage from "@/assets/landing-page-hero-image.png";
import EncontreSuaCausa from "@/assets/Encontre_sua_causa 1.png";
import FacaADiferenca from "@/assets/Faca_a_diferenca 1.png";
import CrescaInspire from "@/assets/creca_inspire 1.png";
import RobsonImage from "@/assets/Robson_ta 1.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

type homeCard = {
  key: string;
  title: string;
  imageUrl: string;
  color: string;
  description: string;
};

const homeCardsDetailsList: homeCard[] = [
  {
    key: "encontre_sua_causa",
    title: "Encontre a sua causa",
    color: "#ECCB54",
    description:
      "Explore diversas oportunidades e encontre projetos que se alinham com suas paixões e habilidades",
    imageUrl: EncontreSuaCausa,
  },
  {
    key: "faca_a_diferenca",
    title: "Faça a Diferença",
    color: "#EA703C",
    description:
      "Contribua com seu tempo e talento para causas importantes e veja o impacto real de suas ações.",
    imageUrl: FacaADiferenca,
  },
  {
    key: "creca_inspire",
    title: "Cresça e Inspire",
    color: "#49B5AE",
    description:
      "Desenvolva novas habilidades, conheça pessoas incríveis e inspire outros a se juntarem ao movimento.",
    imageUrl: CrescaInspire,
  },
];

const HomeInfoList = [
  {
    key: "gestao_simplificada",
    title: "Gestão Simplificada de Equipes",
    description:
      "Receba notificações, analise perfis e aprove novos voluntários com apenas um clique, mantendo sua equipe sempre segura e alinhada.",
    icon: SquareCheckBig,
    color: "text-green-500",
  },
  {
    key: "escalas_automatizadas",
    title: "Escalas e Presença Automatizadas",
    description:
      "Crie escalas, permita que voluntários se inscrevam e controle a presença com check-in e check-out via QR Code. Diga adeus às planilhas manuais.",
    icon: ChartColumn,
    color: "text-sky-500",
  },
  {
    key: "relatorios_dados",
    title: "Relatórios e Dados Estratégicos",
    description:
      "Acesse relatórios de participação, controle equipamentos e gerencie vouchers para tomar decisões baseadas em dados e mostrar o impacto real das suas ações.",
    icon: SquareCheckBig,
    color: "text-orange-500",
  },
];

function HomeCard({ title, imageUrl, color, description }: homeCard) {
  return (
    <div className="group relative md:size-100 size-80 flex flex-col items-center justify-end gap-2 font-poppins hover:scale-105 transition-transform">
      <h6 className="z-40 text-2xl md:text-3xl font-bold mb-auto text-neutral-800 text-shadow-xs">
        {title}
      </h6>
      <p
        className="z-30 px-4 h-22 flex items-center justify-center text-sm md:text-base text-center font-semibold rounded-2xl shadow-lg"
        style={{ background: color }}
      >
        {description}
      </p>
      <img
        src={imageUrl}
        className="absolute z-20 bottom-0 left-1/2 -translate-x-1/2 size-60 md:size-80 object-contain"
      />
      <div
        className="z-10 absolute w-[calc(100%+32px)] h-[calc(88px+32px)] -bottom-4 border rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity delay-100"
        style={{ borderColor: color }}
      />
      <div
        className="z-10 absolute w-[calc(100%+64px)] h-[calc(88px+64px)] -bottom-8 border rounded-2xl  opacity-0 group-hover:opacity-50 transition-opacity delay-150"
        style={{ borderColor: color }}
      />
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="bg-gray-50 border-b-gray-500/50 border shadow-2xl flex items-center justify-center h-20 w-full  px-8 ">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={VoltsLogo} className="size-15" />
            <img src={VoltsName} className="h-10" />
          </div>

          {/* Menu Mobile */}
          <div className="block sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant={"outline"} className="size-10">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="p-2 pb-4 rounded-b-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src={VoltsLogo} className="size-10" alt="Volts Logo" />
                    <img src={VoltsName} className="h-8" alt="Volts Name" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-3 px-2">
                  <Button
                    variant="ghost"
                    className="justify-between w-full text-lg p-6"
                  >
                    Recursos
                    <span>
                      <ChevronRight />
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-between w-full text-lg p-6"
                  >
                    Comunidade
                    <span>
                      <ChevronRight />
                    </span>
                  </Button>
                  <hr className="border-neutral-300 my-4" />
                  <Button
                    onClick={() => navigate("/login")}
                    className=" w-full text-lg py-6"
                  >
                    Entrar
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Menu Desktop */}
          <ul className="hidden sm:flex gap-2">
            <li>
              <Button variant="link">Recursos</Button>
            </li>
            <li>
              <Button variant="link">Comunidade</Button>
            </li>
            <li>
              <Button onClick={() => navigate("/login")}>Entrar</Button>
            </li>
          </ul>
        </div>
      </header>

      <section className="relative md:h-[624px] h-[calc(100vh-80px)] bg-linear-to-br from-primary/80 via-sky-500 to-indigo-500/80 w-full">
        <img
          src={HeroImage}
          className="z-10 absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(70vw,782px)] object-cover"
        />

        <div className="relative z-20 px-10 py-5 pt-20 flex flex-col md:justify-end h-full gap-6 max-w-7xl mx-auto">
          <h3 className="text-white font-poppins font-bold text-5xl md:text-6xl text-shadow-xl text-center md:text-left">
            Sua Energia Transforma
          </h3>
          <p className=" text-white font-poppins font-bold text-xl md:text-3xl text-shadow-lg max-w-5xl text-center md:text-left">
            A plataforma completa para conectar, organizar e engajar voluntários
          </p>
          <div className="flex flex-wrap gap-6 md:mt-4 mt-10 justify-center md:justify-start">
            <Button
              size="xl"
              variant="secondary"
              className="font-semibold font-poppins shadow-lg bg-radial-[at_50%_25%] from-yellow-300 via-secondary to-yellow-600/50 to-90% hover:scale-105"
              onClick={() => navigate("/discover")}
            >
              Quero ser Voluntário
            </Button>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white font-poppins bg-radial-[at_50%_25%] from-neutral-50 via-neutral-100 to-neutral-300/60 to-90% text-neutral-800 font-semibold hover:bg-neutral-200 shadow-lg hover:scale-105"
              onClick={() => navigate("/discover")}
            >
              Já tenho uma conta
            </Button>
          </div>
        </div>
      </section>

      <section className="py-25 sm:px-8 px-2 w-full bg-linear-to-br from-white to-neutral-50 border-b border-slate-300">
        <div className="container mx-auto flex flex-col items-center">
          <h3 className="font-poppins text-3xl md:text-6xl font-bold text-neutral-800 mb-10 text-shadow-md text-center">
            Descubra o Poder do Voluntariado
          </h3>
          <div className="flex flex-wrap justify-center gap-10 mt-10 mb-20">
            {homeCardsDetailsList.map((card) => (
              <HomeCard
                key={card.key}
                title={card.title}
                color={card.color}
                description={card.description}
                imageUrl={card.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-25 sm:px-8 px-2 w-full bg-linear-to-br from-white to-neutral-50">
        <div className="container mx-auto flex flex-col items-center">
          <h3 className="font-poppins text-4xl md:text-6xl font-bold text-neutral-800 mb-10 text-shadow-md text-center">
            Menos caos, mais impacto.
          </h3>
          <h5 className="font-poppins md:text-2xl  text-neutral-800 mb-10 text-shadow-md text-center">
            A ferramenta completa para organizar, engajar e mensurar o trabalho
            da sua equipe de voluntários.
          </h5>

          <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full max-w-6xl gap-8">
            <div>
              <img
                src={RobsonImage}
                alt="robson"
                className="object-cover h-[min(600px,70vw)]"
              />
            </div>
            <div className="">
              <ul>
                {HomeInfoList.map((info) => {
                  return (
                    <li key={info.key} className="mb-6 flex gap-4">
                      <info.icon
                        className={`size-6 md:size-8 min-w-8 mt-1 ${info.color}`}
                      />
                      <div>
                        <h6 className="font-poppins text-xl md:text-2xl font-bold text-neutral-800 mb-2">
                          {info.title}
                        </h6>
                        <p className="font-poppins text-base md:text-lg text-neutral-700 max-w-xl">
                          {info.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Button
                size="lg"
                className="ml-11 font-poppins mt-4 bg-gradient-to-r from-primary to-sky-400 text-white shadow-lg hover:scale-105 hover:from-primary/90 hover:to-sky-400/90"
                onClick={() => navigate("/discover")}
              >
                Cadastre sua Organização
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-10 text-sm md:text-base w-full flex flex-col md:flex-row justify-between bg-slate-300/40 border-t border-slate-300 text-slate-600 font-semibold font-poppins text-center gap-8 md:gap-4">
        <p>Volts &copy; 2025. Todos os direitos reservados.</p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <a href="#" className="hover:underline">
            Política de Privacidade
          </a>
          <a href="#" className="hover:underline">
            Termos de Serviço
          </a>
          <a href="#" className="hover:underline">
            Contato
          </a>
        </div>
      </footer>
    </div>
  );
}
