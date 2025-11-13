interface PermissionProps {
  can: boolean;
  children: React.ReactNode;
}

export function WithPermission({ can, children }: PermissionProps) {
  if (!can) return null;
  return <>{children}</>;
}
