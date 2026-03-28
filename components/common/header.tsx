import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useBreadcrumb } from "@/hooks/breadcrumb/use-breadcrumb";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/helpers";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuToggle?: () => void;
}

function Header({ onMenuToggle }: HeaderProps) {
  const breadcrumbs = useBreadcrumb();
  const t = useTranslations("common");

  return (
    <>
      <header className="mx-4 mb-4 flex items-center justify-between rounded-full bg-white px-6 py-4">
        <div className="flex items-center justify-start gap-3">
          {/* Mobile Menu Toggle Button */}
          <Button variant="secondary" size="icon" onClick={onMenuToggle}>
            <Icon icon="solar:hamburger-menu-outline" className="text-base" />
          </Button>

          <div className="flex items-center">
            {/* <div className="text-subdude flex items-center"> */}
             <div className="text-subdude flex items-center border-l pl-2 border-gray-400">
              {breadcrumbs.map((item, idx) => (
                <div
                  className="flex items-center"
                  key={`${item.name}-${item.url ?? "no-url"}-${item.isActive ? "active" : "inactive"}`}
                >
                  {item.url && !item.isActive && item.url !== "/" ? (
                    <Link
                      href={item.url}
                      className={cn(
                        item.isActive ? "text-black" : "text-subdude",
                      )}
                    >
                      <span className="text-sm">
                        {item.isI18nKey ? t(item.name) : item.name}
                      </span>
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "text-sm",
                        item.isActive ? "text-black" : "text-subdude",
                      )}
                    >
                      {item.isI18nKey ? t(item.name) : item.name}
                    </span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <span className="mx-2">/</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
