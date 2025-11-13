import {
  Home,
  Bell,
  Cloud,
  FileText,
  Heart,
  Image,
  Lock,
  Mail,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Church,
  Package,
  PawPrint,
  Recycle,
  Users,
} from "lucide-react";

type IconOption = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  id: string;
};

const iconOptions: IconOption[] = [
  { Icon: Home, label: "Casa", id: "home" },
  { Icon: Users, label: "Usuário", id: "users" },
  { Icon: Bell, label: "Notificações", id: "bell" },
  { Icon: Package, label: "Pacote", id: "package" },
  { Icon: PawPrint, label: "Animal", id: "pawprint" },
  { Icon: Clock, label: "Relógio", id: "clock" },
  { Icon: Cloud, label: "Nuvem", id: "cloud" },
  { Icon: Recycle, label: "Sustentabilidade", id: "recycle" },
  { Icon: FileText, label: "Documento", id: "filetext" },
  { Icon: Heart, label: "Coração", id: "heart" },
  { Icon: Image, label: "Imagem", id: "image" },
  { Icon: Lock, label: "Cadeado", id: "lock" },
  { Icon: Mail, label: "E-mail", id: "mail" },
  { Icon: MapPin, label: "Localização", id: "mappin" },
  { Icon: MessageCircle, label: "Mensagem", id: "messagecircle" },
  { Icon: Church, label: "Igreja", id: "church" },
  { Icon: Star, label: "Estrela", id: "star" },
];

function getGroupIcon(iconId: string | undefined) {
  const iconObj = iconOptions.find((icon) => icon.id === iconId);
  return iconObj ? iconObj : null;
}

export { iconOptions, getGroupIcon };
