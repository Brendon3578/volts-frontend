import { memo } from "react";
import { cn } from "../../lib/utils";

interface GroupColorSelectorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: string | undefined;
  label: string;
  isSelected: boolean;
}

export const GroupColorSelector = memo(
  ({
    color,
    label,
    className,
    isSelected,
    ...props
  }: GroupColorSelectorProps) => {
    return (
      <button
        type="button"
        title={label}
        className={cn(
          `cursor-pointer w-6 h-6 rounded-full border-foreground/15 border hover:scale-125 transition-all`,
          className,
          isSelected && "scale-125"
        )}
        style={{ backgroundColor: color }}
        {...props}
      />
    );
  }
);
