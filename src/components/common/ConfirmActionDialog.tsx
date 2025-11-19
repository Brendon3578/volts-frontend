import { memo, useState, useCallback, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmActionDialogProps {
  title: string;
  description?: string;
  trigger?: ReactNode;
  children?: ReactNode;
  onConfirm: () => Promise<void>;
  variant?: "default" | "destructive";
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Um componente genérico de diálogo de confirmação.
 * Otimizado para evitar re-renderizações desnecessárias.
 */
export const ConfirmActionDialog = memo(function ConfirmActionDialog({
  title,
  description,
  trigger,
  children,
  onConfirm,
  variant = "default",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ConfirmActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await onConfirm();
      // usa flushSync implicitamente, mas evita duplo render
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [onConfirm]);

  console.log("oi");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div>{children}</div>}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant}
            disabled={loading}
            className="min-w-22"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
