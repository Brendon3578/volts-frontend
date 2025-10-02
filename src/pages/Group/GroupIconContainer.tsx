import { memo, useMemo } from "react";
import { getBrightness, getGroupIcon } from "../../utils";
import { House } from "lucide-react";

interface GroupIconContainerProps {
  color: string | undefined;
  groupIconId: string | undefined;
  containerClassName?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

interface GroupIconProps {
  groupIconId: string | undefined;
  className: string;
}

const GroupIcon = memo(({ groupIconId, className }: GroupIconProps) => {
  const selectedIcon = useMemo(() => getGroupIcon(groupIconId), [groupIconId]);

  if (!selectedIcon) return <House className={className} />;

  return <selectedIcon.Icon className={className} />;
});

export const GroupIconContainer = memo(function GroupIconContainer({
  color,
  groupIconId,
  containerClassName = "mt-1 flex items-center justify-center w-10 h-10 min-w-10 rounded-sm border border-foreground/15 mr-4",
  iconClassName = "h-6 w-6",
  children,
}: GroupIconContainerProps) {
  const backgroundStyle = useMemo(
    () => ({ backgroundColor: color || "var(--primary)" }),
    [color]
  );

  const brightness = useMemo(() => {
    const colorValue = color || "oklch(0.6096 0.1498 249.1703)"; // fallback para cor padrão
    return getBrightness(colorValue);
  }, [color]);

  const textColorClass = useMemo(
    () => (brightness > 128 ? "text-black/80" : "text-white"),
    [brightness]
  );

  const finalIconClassName = `${iconClassName} ${textColorClass}`;

  console.log("oi");

  return (
    <div className={containerClassName} style={backgroundStyle}>
      {children ? (
        children
      ) : (
        <GroupIcon groupIconId={groupIconId} className={finalIconClassName} />
      )}
    </div>
  );
});
