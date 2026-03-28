"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { authClient, useSession } from "@/libs/auth/auth-client";
import { cn } from "@/utils/helpers";

interface SidebarProps {
  activeSection?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  // const { data: session } = useSession();
  const mockupSession: any = {
    menu: [
      {
        id: "59f8f654-d024-4c74-b3ba-5f2b43d35201",
        code: "rp",
        nameTh: "ระบบบริหารค่าตอบแทน (PY)",
        nameEn: "(PY)",
        furl: "http://localhost:3003",
        burl: "http://localhost:4003",
        icon: "solar:home-smile-outline",
        modules: [
          // {
          //   id: "BHRM03-01",
          //   parentId: null,
          //   nameTh: "สร้างคำขอฯ",
          //   nameEn: "สร้างคำขอฯ",
          //   url: "/create-request",
          //   type: "MENU",
          //   modules: [],
          // },
          {
            id: "BHRM05",
            parentId: null,
            nameTh: "จัดการค่าตอบแทน",
            nameEn: "จัดการค่าตอบแทน",
            url: "/manage-compensation",
            type: "MENU",
            modules: [],
          },
          //   {
          //     id: "5efef3cd-9d51-4b9e-a464-d18219bc13eb",
          //     parentId: null,
          //     nameTh: "ตัวอย่าง CRUD",
          //     nameEn: "CRUD Demo",
          //     url: "/demo",
          //     type: "MENU",
          //     modules: [],
          //   },
          //   {
          //     id: "31fa9704-3307-466a-894c-dec446069970",
          //     parentId: null,
          //     nameTh: "จัดการพื้นที่จัดเก็บ",
          //     nameEn: "Storage Management",
          //     url: "/storage",
          //     type: "MENU",
          //     modules: [],
          //   },
          //   {
          //     id: "e19e981d-1587-447e-bdc1-d878daee82db",
          //     parentId: null,
          //     nameTh: "จัดการบริการภายนอก",
          //     nameEn: "External Management",
          //     url: null,
          //     type: "MENU",
          //     modules: [
          //       {
          //         id: "c48f776d-c46b-4ffe-95f1-982e3e842101",
          //         parentId: "e19e981d-1587-447e-bdc1-d878daee82db",
          //         nameTh: "จัดการอีเมล",
          //         nameEn: "Email Management",
          //         url: "/email",
          //         type: "MENU",
          //         modules: [],
          //       },
          //       {
          //         id: "32ea1e1b-dedf-4529-bb18-46534331baa7",
          //         parentId: "e19e981d-1587-447e-bdc1-d878daee82db",
          //         nameTh: "จัดการ SMS",
          //         nameEn: "SMS Management",
          //         url: "/sms",
          //         type: "MENU",
          //         modules: [],
          //       },
          //     ],
          //   },
        ],
      },
      {
        id: "f23a8739-9a24-4078-98b7-83cf5e1b71b7",
        code: "um",
        nameTh: "ระบบจัดการผู้ใช้งาน",
        nameEn: "User Management",
        furl: "http://localhost:3002",
        burl: "http://localhost:4002",
        icon: "solar:shield-user-outline",
        modules: [],
      },
    ],

    user: {
      id: "0a4487ac-b4f7-4194-bf00-eaa16fdcdebd",
      name: "Dev User",
      email: "dev@wewasanad.com",
      emailVerified: true,
      image: null,
      createdAt: "2026-02-25 17:18:38.169",
      updatedAt: "2026-02-25 17:18:38.169",
      username: "dev_user",
      organizationId: "f5ac985d-39d3-4642-bd83-32fe936f4ff1",
    },

    session: {
      id: "gMYrxOZUsjqsi9m40BRzw9YDlG6g4LGK",
      expiresAt: "2026-03-05T16:12:18.802Z",
      token: "zezgP3wpzNEVcE4GVMkUHmlW3LuGqB5Z",
      createdAt: "2026-02-26T16:12:18.802Z",
      updatedAt: "2026-02-26T16:12:18.802Z",
      ipAddress: "",
      userAgent:
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
      userId: "0a4487ac-b4f7-4194-bf00-eaa16fdcdebd",
    },
  };

  const [active, setActive] = useState<string>("rp");
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("common");
  // console.log(session);

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
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-row gap-2 rounded-2xl bg-white p-2 lg:static lg:h-[calc(100dvh-2rem)] lg:translate-x-0 lg:transition-all lg:duration-100 ${!isOpen ? "lg:w-0 lg:gap-0 lg:overflow-hidden lg:p-0" : ""}`}
      >
        {/* Sidebar แรก - Icon Menu (App Modules) */}
        <div className="my-6 flex w-auto flex-col rounded-2xl">
          <nav className="flex-1">
            {/* Logo */}
            <div className="mb-2 flex items-center justify-center">
              <div className="bg-secondary size-12 rounded-full"></div>
            </div>
            <hr className="mx-2 my-4" />
            <div className="flex flex-col items-center gap-4">
              {/* App Module Icons from session */}
              {/* {session?.menu.map((menu, index) => { */}
              {mockupSession?.menu.map((menu: any, index: number) => {
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
                      push(menu.furl);
                    }}
                    title={menu.nameTh}
                    className={cn(
                      "flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors",
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

          {/* Bottom Section */}
          <div className="space-y-4">
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
              className="flex max-w-64 min-w-52.5 flex-1 flex-col overflow-hidden rounded-2xl bg-linear-to-r from-[#F8FBFE] to-[#DBEAFE] p-4"
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
                  mockupSession?.menu.find((item: any) => item.code === active)
                    ?.nameTh || "",
                  mockupSession?.menu.find((item: any) => item.code === active)
                    ?.nameEn || "",
                )}
              </motion.h1>

              <ul className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pr-2">
                {/* {session?.menu */}
                {mockupSession?.menu
                  .find((item) => item.code === active)
                  ?.modules.filter((item) => item.type === "MENU")
                  .map((item, index) => {
                    const hasChildren = item.modules && item.modules.length > 0;

                    // Check if any child is active
                    const isAnyChildActive = hasChildren
                      ? item.modules?.some(
                          (child) =>
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
                              {item.modules?.map((subItem, subIndex) => {
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
                                      href={subItem.url}
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
                              })}
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
                          href={item.url}
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
