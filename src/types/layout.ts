import type { LucideProps } from "lucide-react";

type SidebarLink = {
  title: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export type { SidebarLink };
