import { useLocale } from "next-intl"
import { useMemo } from "react"
import { usePathname } from "@/i18n/navigation"
import { useSession } from "@/libs/auth/auth-client"

interface CurrentMenu {
	nameTh: string
	nameEn: string
	name: string
	url: string
	type?: "MENU" | "ACTION"
	parentName?: string
	parentUrl?: string
	systemName?: string
	systemCode?: string
}

/**
 * Custom hook to get the current active menu item based on the pathname
 * Uses session data from the database
 *
 * @returns CurrentMenu object or null if no match found
 */
export function useCurrentMenu(): CurrentMenu | null {
	const pathname = usePathname()
	const locale = useLocale()
	const { data: session } = useSession()

	return useMemo(() => {
		if (!session?.menu) {
			return null
		}

		const matchesPath = (url?: string) => {
			if (!url)
				return false
			return pathname === url || pathname.startsWith(`${url}/`)
		}

		const getLocalizedName = (nameTh: string, nameEn: string) => {
			return locale === "th" ? nameTh : nameEn
		}

		// Search through all systems and their modules
		for (const system of session.menu) {
			const menuModules = system.modules?.filter(m => m.type === "MENU") || []

			for (const menuItem of menuModules) {
				// Check if this is the current menu item
				if (matchesPath(menuItem.url)) {
					return {
						nameTh: menuItem.nameTh,
						nameEn: menuItem.nameEn,
						name: getLocalizedName(menuItem.nameTh, menuItem.nameEn),
						url: menuItem.url,
						type: menuItem.type,
						systemName: getLocalizedName(system.nameTh, system.nameEn),
						systemCode: system.code,
					}
				}

				// Check nested modules (children)
				if (menuItem.modules?.length) {
					for (const child of menuItem.modules) {
						if (matchesPath(child.url)) {
							return {
								nameTh: child.nameTh,
								nameEn: child.nameEn,
								name: getLocalizedName(child.nameTh, child.nameEn),
								url: child.url,
								type: child.type,
								parentName: getLocalizedName(menuItem.nameTh, menuItem.nameEn),
								parentUrl: menuItem.url,
								systemName: getLocalizedName(system.nameTh, system.nameEn),
								systemCode: system.code,
							}
						}
					}
				}
			}
		}

		return null
	}, [pathname, locale, session?.menu])
}

/**
 * Hook to get just the current menu name (localized)
 * Convenience wrapper around useCurrentMenu
 */
export function useCurrentMenuName(): string | null {
	const currentMenu = useCurrentMenu()
	return currentMenu?.name ?? null
}

/**
 * Hook to get the current system information
 * Convenience wrapper around useCurrentMenu
 */
export function useCurrentSystem(): { name: string, code: string } | null {
	const currentMenu = useCurrentMenu()
	if (!currentMenu?.systemName || !currentMenu?.systemCode) {
		return null
	}
	return {
		name: currentMenu.systemName,
		code: currentMenu.systemCode,
	}
}
