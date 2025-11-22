import { memo, useMemo } from "react";

type UserIconProps = {
  userFullName?: string;
};

function getUserInitials(name?: string): string {
  if (!name) return "";

  const parts = name.split(" ").filter(Boolean);
  const first = parts[0];

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts[parts.length - 1];
  return (first[0] + last[0]).toUpperCase();
}

export const UserIcon = memo(function UserIcon({
  userFullName,
}: UserIconProps) {
  const userInitials = useMemo(
    () => getUserInitials(userFullName),
    [userFullName]
  );

  return (
    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
      <span className="font-poppins text-sm font-bold">{userInitials}</span>
    </div>
  );
});
