import { memo } from "react";
import { cn } from "../../lib/utils";

interface GroupIconSelectorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  isSelected: boolean;
}

export const GroupIconSelector = memo(
  ({
    Icon,
    label,
    iconColor = "text-gray-700",
    isSelected,
    ...props
  }: GroupIconSelectorProps) => {
    return (
      <button
        type="button"
        className={cn(
          "flex items-center justify-center cursor-pointer w-10 h-10 p-2 rounded-full  hover:bg-neutral-600/15 transition-all",
          isSelected && "scale-125 bg-neutral-600/10"
        )}
        title={label}
        {...props}
      >
        <Icon className={iconColor} />
      </button>
    );
  }
);
