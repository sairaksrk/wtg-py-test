"use client";

import type { JSX } from "react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { z } from "zod";
import { AlertProvider } from "@/components/common/alert-provider";
import Header from "@/components/common/header";
import Loading from "@/components/common/loading";
import Sidebar from "@/components/common/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "@/i18n/navigation";
import { useLoadingStore } from "@/stores/loading-store";

export interface LayoutsProps {
  children: JSX.Element | React.ReactNode;
}

export default function Layouts({ children }: LayoutsProps) {
  const pathname = usePathname();
  const t = useTranslations("validation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isLoading = useLoadingStore((state) => state.isLoading);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsSidebarOpen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsSidebarOpen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const setLoadingPortal = (): JSX.Element =>
    isLoading ? (
      createPortal(<Loading fullscreen />, document.getElementById("portal")!)
    ) : (
      <></>
    );

  z.config({
    customError: (issue: any) => {
      if (issue.params?.i18nKey) {
        return t(issue.params.i18nKey as string);
      }

      switch (issue.code) {
        case "too_small":
          return issue.minimum === 1
            ? t("zod.required")
            : t("zod.minimum", { minimum: String(issue.minimum) });
        case "too_big":
          return t("zod.maximum", { maximum: String(issue.maximum) });
        case "invalid_type":
          if (issue.expected === "string") {
            return t("zod.required");
          }
          return issue.expected === "number"
            ? t("zod.invalid_type_number")
            : t("zod.invalid_type_string");
        case "invalid_format":
          return issue.format === "email"
            ? t("zod.invalid_format_email")
            : t("zod.invalid_format_string");
        case "custom":
          return issue.message
            ? t(issue.message)
            : t("zod.error", { code: issue.code });
        default:
          return t("zod.error", { code: issue.code });
      }
    },
  });

  const renderContent = () => {
    switch (pathname) {
      case "/error":
        return children;
      default:
        return (
          <>
            {/* <QueryClientProvider client={queryClient}> */}
            <div className="bg-sub-background flex h-dvh flex-row overflow-hidden p-4">
              {/* Unified Sidebar - Works for both mobile and desktop */}
              <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header onMenuToggle={handleSidebarToggle} />
                <main className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="mx-auto w-full">
                    <div className="bg-sub-background">
                      {children}
                      {setLoadingPortal()}
                    </div>
                  </div>
                </main>
              </div>
            </div>
            {/* </QueryClientProvider> */}
          </>
        );
    }
  };

  return (
    <AlertProvider>
      <Toaster />
      {renderContent()}
      {setLoadingPortal()}
    </AlertProvider>
  );
}
