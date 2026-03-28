import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type ToastVariant = "success" | "error" | "warning";

export interface CustomToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  icon?: string;
  duration?: number;
  dismissible?: boolean;
}

const variantStyles = {
  success: {
    container: "bg-success-subdude border-success",
    iconBg: "bg-success",
    icon: "solar:check-circle-outline",
  },
  error: {
    container: "bg-destructive-subdude border-destructive",
    iconBg: "bg-destructive",
    icon: "solar:close-circle-outline",
  },
  warning: {
    container: "bg-warning-subdude border-warning",
    iconBg: "bg-warning",
    icon: "solar:danger-triangle-outline",
  },
};

export function showCustomToast({
  variant = "success",
  title,
  description,
  icon,
  duration,
  dismissible = true,
}: CustomToastOptions) {
  const styles = variantStyles[variant];
  const iconToUse = icon || styles.icon;

  return toast.custom(
    (t) => (
      <div
        className={`${styles.container} min-w-[460px] rounded-2xl border px-4 py-3`}
      >
        <div className="flex items-center justify-start gap-4">
          <div className={`${styles.iconBg} rounded-full p-2`}>
            <Icon icon={iconToUse} className="size-4 text-white" />
          </div>
          <div className="flex flex-1 flex-col">
            <h1>{title}</h1>
            {description && (
              <p className="text-subdude text-sm">{description}</p>
            )}
          </div>
          {dismissible && (
            <Button variant="icon" size="icon" onClick={() => toast.dismiss(t)}>
              <Icon icon="meteor-icons:xmark" className="text-subdude size-4" />
            </Button>
          )}
        </div>
      </div>
    ),
    { duration },
  );
}

// Convenience functions for each variant
export function toastSuccess(
  title: string,
  description?: string,
  options?: Partial<CustomToastOptions>,
) {
  return showCustomToast({
    variant: "success",
    title,
    description,
    ...options,
  });
}

export function toastError(
  title: string,
  description?: string,
  options?: Partial<CustomToastOptions>,
) {
  return showCustomToast({ variant: "error", title, description, ...options });
}

export function toastWarning(
  title: string,
  description?: string,
  options?: Partial<CustomToastOptions>,
) {
  return showCustomToast({
    variant: "warning",
    title,
    description,
    ...options,
  });
}
