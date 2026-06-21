"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { authClient, useSession } from "@/libs/auth/auth-client";
import { cn } from "@/utils/helpers";
import { MOCKUP_MENU } from "@/libs/constants/menu";

interface SidebarProps {
  activeSection?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { data: session } = useSession();

  // Use real menu if available, otherwise fallback to mockup
  const mockupSession = useMemo(() => {
    if (session?.menu && session.menu.length > 0) {
      return session.menu;
    }
    return MOCKUP_MENU;
  }, [session?.menu]);

  const [active, setActive] = useState<string>("rp");
  const pathname = usePathname();
  const locale = useLocale();

  const { push, refresh } = useRouter();
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCollapse = (title: string, currentOpenState: boolean) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [title]: !currentOpenState,
    }));
  };

  const checkIfMenuActive = useCallback(
    (basePath: string, excludePaths: string[] = []) => {
      // Handle exact match for root path
      if (basePath === "/") {
        return pathname === "/";
      }

      // Check if pathname starts with basePath
      if (!pathname.startsWith(basePath)) {
        return false;
      }

      // Check for excluded paths
      for (const excludePath of excludePaths) {
        if (pathname.startsWith(excludePath)) {
          return false;
        }
      }

      // Additional check: ensure we're matching a complete path segment
      const pathAfterBase = pathname.slice(basePath.length);
      if (
        pathAfterBase.length > 0 &&
        !pathAfterBase.startsWith("/") &&
        !pathAfterBase.startsWith("?")
      ) {
        return false;
      }

      return true;
    },
    [pathname],
  );

  const toggleLanguage = () => {
    const newLocale = locale === "th" ? "en" : "th";
    push(pathname, { locale: newLocale });
  };

  const nameLocalize = (th: string, en: string) => {
    return locale === "th" ? th : en;
  };

  return (
    <>
      {/* Backdrop for mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={false}
        animate={{
          // Mobile: slide in/out
          x: isOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 flex h-full min-h-0 flex-row gap-2 rounded-2xl bg-white p-2 lg:static lg:h-[calc(100dvh-2rem)] lg:translate-x-0 lg:transition-all lg:duration-100 ${!isOpen ? "lg:w-0 lg:gap-0 lg:overflow-hidden lg:p-0" : ""}`}
      >
        {/* Sidebar แรก - Icon Menu (App Modules) */}
        <div className="flex h-full min-h-0 w-auto flex-col rounded-2xl py-2">
          <div className="mb-2 flex w-full shrink-0 justify-center">
            <Image
              src="/logo-pdmo.png"
              alt="Logo Image"
              width={150}
              height={150}
              priority
              sizes="50px"
              className="size-12 object-contain"
            />
          </div>
          <hr className="mx-2 my-4 shrink-0" />
          <nav
            aria-label="App modules"
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1"
          >
            <div className="flex flex-col items-center gap-4 pb-2">
              {mockupSession.map((menu: any, index: number) => {
                const isActive = active === menu.code;

                return (
                  <motion.button
                    key={menu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActive(menu.code);
                      sessionStorage.clear();
                    }}
                    title={menu.nameTh}
                    className={cn(
                      "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                      isActive
                        ? "bg-primary hover:bg-primary text-white"
                        : "bg-secondary hover:bg-secondary text-black",
                    )}
                  >
                    <Icon icon={menu.icon} className="text-base" />
                  </motion.button>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto shrink-0 space-y-4 pt-4">
            {/* Notification Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full text-black transition-colors"
            >
              <Icon icon="solar:bell-outline" />
            </motion.button>

            {/* Language Toggle */}
            {process.env.NEXT_PUBLIC_IS_LOCALE === "true" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="bg-secondary hover:bg-secondary/80 flex size-11 cursor-pointer items-center justify-center rounded-full text-2xl transition-colors"
                title={
                  locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
                }
              >
                <Icon
                  icon={
                    locale === "th"
                      ? "emojione:flag-for-thailand"
                      : "emojione:flag-for-united-states"
                  }
                />
              </motion.button>
            )}

            {/* User/Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await authClient.signOut();
                refresh();
              }}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full text-black transition-colors"
            >
              <div className="relative h-full w-full">
                <Image
                  src="/profile-img.jpg"
                  alt="Profile Image"
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  fill
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Sidebar ที่สอง - Main Navigation Menu */}
        {/* Show on mobile when open, show on desktop when not collapsed */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex min-h-0 max-w-64 min-w-52.5 flex-1 flex-col overflow-hidden rounded-2xl bg-linear-to-r from-[#F8FBFE] to-[#DBEAFE] p-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-foreground mb-8 shrink-0 text-xl font-medium whitespace-pre-wrap"
              >
                {nameLocalize(
                  //   session?.menu.find((item) => item.code === active)?.nameTh ||
                  //     "",
                  //   session?.menu.find((item) => item.code === active)?.nameEn ||
                  //     "",
                  mockupSession?.find((item: any) => item.code === active)
                    ?.nameTh || "",
                  mockupSession?.find((item: any) => item.code === active)
                    ?.nameEn || "",
                )}
              </motion.h1>

              <ul className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pr-2">
                {/* {session?.menu */}
                {mockupSession
                  .find((item: any) => item.code === active)
                  ?.modules.filter((item: any) => item.type === "menu")
                  .map((item: any, index: any) => {
                    const hasChildren = item.modules && item.modules.length > 0;
                    const furl =
                      session?.menu.find((item) => item.code === active)
                        ?.furl ?? "";

                    // Check if any child is active
                    const isAnyChildActive = hasChildren
                      ? item.modules?.some(
                          (child: any) =>
                            pathname === child.url ||
                            pathname.startsWith(`${child.url}/`),
                        )
                      : false;

                    // Parent is active if its URL matches OR any child is active
                    const isActive =
                      checkIfMenuActive(item.url) || isAnyChildActive;
                    // Only expand by default if a child route is actually active
                    const isOpen =
                      collapsedItems[item.nameTh] ?? isAnyChildActive;

                    if (hasChildren) {
                      return (
                        <motion.li
                          key={item.nameTh}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCollapse(item.nameTh, isOpen)}
                            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-left transition-all hover:bg-white/50"
                          >
                            {/* {item.icon && <Icon icon={item.icon} />} */}
                            <span className="flex-1">
                              {nameLocalize(item.nameTh, item.nameEn)}
                            </span>
                            <Icon
                              icon="lucide:chevron-right"
                              className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                            />
                          </motion.button>

                          {/* Submenu */}
                          {isOpen && (
                            <ul className="mt-1 space-y-1">
                              {item.modules?.map(
                                (subItem: any, subIndex: any) => {
                                  const isSubActive = pathname === subItem.url;
                                  return (
                                    <motion.li
                                      key={subItem.nameTh}
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        delay: 0.2 + subIndex * 0.05,
                                      }}
                                    >
                                      <Link
                                        href={`${furl}${subItem.url}`}
                                        onClick={() => sessionStorage.clear()}
                                      >
                                        <motion.button
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          className={cn(
                                            "flex w-full text-left gap-2 rounded-lg pr-4 py-2 transition-all cursor-pointer pl-10",
                                            isSubActive
                                              ? "bg-linear-to-r from-[#BFDBFE00] to-[#BFDBFE] text-primary"
                                              : "text-foreground hover:bg-white/50",
                                          )}
                                        >
                                          {/* {subItem.icon && <Icon icon={subItem.icon} />} */}
                                          <span>
                                            {nameLocalize(
                                              subItem.nameTh,
                                              subItem.nameEn,
                                            )}
                                          </span>
                                        </motion.button>
                                      </Link>
                                    </motion.li>
                                  );
                                },
                              )}
                            </ul>
                          )}
                        </motion.li>
                      );
                    }

                    return (
                      <motion.li
                        key={item.nameTh}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={`${furl}${item.url}`}
                          onClick={() => sessionStorage.clear()}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-base transition-all cursor-pointer",
                              isActive
                                ? "bg-linear-to-r from-[#BFDBFE00] to-[#BFDBFE] text-primary"
                                : "text-text-primary hover:bg-white/50",
                            )}
                          >
                            {/* {item.icon && <Icon icon={item.icon} />} */}
                            <span>
                              {nameLocalize(item.nameTh, item.nameEn)}
                            </span>
                          </motion.button>
                        </Link>
                      </motion.li>
                    );
                  })}
              </ul>

              {/* Version Number */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-subdude mt-4 shrink-0 px-4 pt-4 pb-2 text-left text-sm"
              >
                V.
                {process.env.NEXT_PUBLIC_APP_VERSION}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
