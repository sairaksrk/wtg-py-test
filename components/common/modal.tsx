import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";

import { JSX, useEffect } from "react";
import { cn } from "@/utils/helpers";
import { Button } from "../ui/button";

interface ModalProps {
  open: boolean;
  hideBorder?: boolean;
  header?: string;
  subHeader?: string;
  children: JSX.Element;
  size?: "sm" | "md" | "lg" | "xl" | "rp";
  multiple?: boolean;
  onClose?: () => void;
}

export default function Modal({
  open,
  header,
  subHeader,
  children,
  size = "md",
  multiple = false,
  hideBorder = false,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      // Pushing the change to the end of the call stack
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [open]);

  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault();
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && onClose) onClose();
      }}
    >
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay
              forceMount
              asChild
              className={cn(
                multiple ? "z-1002" : "z-1000",
                "data-[state=open]:animate-overlayShow absolute inset-0 h-full w-screen bg-black/30",
              )}
            >
              <motion.div
                className="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: 0.1,
                }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onPointerDownOutside={avoidDefaultDomBehavior}
              onInteractOutside={avoidDefaultDomBehavior}
              className={cn(
                multiple ? "z-1003" : "z-1001",
                size == "sm"
                  ? "max-w-[480px]"
                  : size == "md"
                    ? "max-w-5xl"
                    : size == "lg"
                      ? "max-w-6xl"
                      : size == "rp"
                        ? "max-w-[720px]"
                        : "max-w-[1440px]",
                "data-[state=open]:animate-contentShow fixed top-0 left-[50%] h-full w-full translate-x-[-50%] rounded-[20px] bg-white pb-6 focus:outline-none md:top-[50%] md:h-auto md:translate-y-[-50%]",
              )}
            >
              <motion.div
                initial={{ y: -5, scaleX: 0.95 }}
                animate={{ y: 0, scaleX: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className="dialog-body"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: 0.15,
                  }}
                >
                  <DialogPrimitive.Title />
                  <DialogPrimitive.Description />
                  {/* <div
                    className={`${onClose != null ? "border-b border-dashed" : ""} mx-6 flex border-[#E1E2E3] py-6 ${onClose != null ? "items-start justify-between" : "items-center justify-start"}`}
                  > */}
                  <div
                    className={`${onClose != null ? "" : ""} ${hideBorder ? "border-0" : "border-b border-dashed"} mx-6 flex items-center border-[#D4D4D8] py-6 ${onClose != null ? "justify-between" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-2">
                      <h1 className="text-xl font-medium">{header}</h1>
                      {subHeader && (
                        <h1 className="text-base font-normal text-subdude">
                          {subHeader}
                        </h1>
                      )}
                    </div>
                    {onClose != null && (
                      <Button variant="ghost" size="icon" onClick={onClose}>
                        <Icon icon="lucide:x" className="size-6" />
                      </Button>
                    )}
                  </div>
                  <div className="xs:max-h-[calc(100vh-81px)] max-h-[calc(100vh-120px)] overflow-y-auto px-6 pt-6 pb-12 md:max-h-[85vh] md:pb-0">
                    {children}
                  </div>
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
