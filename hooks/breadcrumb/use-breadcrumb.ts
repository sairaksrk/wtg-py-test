import { useLocale } from "next-intl"
import { useMemo } from "react"
import { usePathname } from "@/i18n/navigation"
import { useSession } from "@/libs/auth/auth-client"
import { useBreadcrumbStore } from "@/stores/breadcrumb-store"
import { getBreadcrumbDisplayName } from "@/utils/breadcrumb-config"

interface BreadcrumbItem {
	name: string
	url?: string
	isActive: boolean
	isI18nKey?: boolean
}

/**
 * Custom hook to automatically generate breadcrumbs based on the current pathname
 * and the session menu data from the database
 *
 * Supports dynamic routes like /permission/[id]
 */
export function useBreadcrumb(): BreadcrumbItem[] {
	const pathname = usePathname()
	const locale = useLocale()
	const { data: session } = useSession()
	const customSegments = useBreadcrumbStore(state => state.customSegments)

	return useMemo(() => {
		const breadcrumbs: BreadcrumbItem[] = [
			{ name: "home", url: "/", isActive: pathname === "/", isI18nKey: true },
		]

		// If we're on the home page, return just the home breadcrumb
		if (pathname === "/") {
			return breadcrumbs
		}

		// If no session data, return basic breadcrumbs
		if (!session?.menu) {
			const segments = pathname.split("/").filter(Boolean)
			segments.forEach((segment, index) => {
				const url = `/${segments.slice(0, index + 1).join("/")}`
				const isLast = index === segments.length - 1
				breadcrumbs.push({
					name: segment.charAt(0).toUpperCase() + segment.slice(1),
					url,
					isActive: isLast,
					isI18nKey: false,
				})
			})
			return breadcrumbs
		}

		const matchesPath = (url?: string) => {
			if (!url)
				return false
			return pathname === url || pathname.startsWith(`${url}/`)
		}

		const getLocalizedName = (nameTh: string, nameEn: string) => {
			return locale === "th" ? nameTh : nameEn
		}

		// Find a breadcrumb "path" through the session menu tree
		// Searches through all systems and their modules
		const findMenuPath = (): Array<{ name: string, url?: string }> | null => {
			// Search through all systems
			for (const system of session.menu) {
				// Filter only MENU type modules
				const menuModules = system.modules?.filter(m => m.type === "MENU") || []

				for (const menuItem of menuModules) {
					// Check if this module matches
					if (matchesPath(menuItem.url)) {
						return [{ name: getLocalizedName(menuItem.nameTh, menuItem.nameEn), url: menuItem.url }]
					}

					// Check nested modules (children)
					if (menuItem.modules?.length) {
						for (const child of menuItem.modules) {
							if (matchesPath(child.url)) {
								return [
									{ name: getLocalizedName(menuItem.nameTh, menuItem.nameEn), url: menuItem.url || undefined },
									{ name: getLocalizedName(child.nameTh, child.nameEn), url: child.url },
								]
							}
						}
					}
				}
			}
			return null
		}

		const menuPath = findMenuPath()

		if (menuPath?.length) {
			const base = menuPath[menuPath.length - 1]
			const baseUrl = base.url
			const isExactMatch = !!baseUrl && baseUrl === pathname

			// 1) Add parent/group + leaf (submenu) items
			menuPath.forEach((node, idx) => {
				const isLeaf = idx === menuPath.length - 1
				breadcrumbs.push({
					name: node.name,
					url: node.url || undefined,
					isActive: isLeaf ? isExactMatch : false,
					isI18nKey: false,
				})
			})

			// 2) Add dynamic sub-routes after the matched leaf
			if (!isExactMatch && baseUrl && pathname.startsWith(`${baseUrl}/`)) {
				// Use custom segments if available, otherwise auto-generate
				if (customSegments.length > 0) {
					customSegments.forEach((segment, index) => {
						const isLast = index === customSegments.length - 1
						breadcrumbs.push({
							name: segment.name,
							url: segment.url,
							isActive: isLast,
							isI18nKey: segment.isI18nKey ?? false,
						})
					})
				}
				else {
					const dynamicSegment = pathname.slice(baseUrl.length + 1)
					const segments = dynamicSegment.split("/").filter(Boolean)

					segments.forEach((segment, index) => {
						const url = `${baseUrl}/${segments.slice(0, index + 1).join("/")}`
						const isLast = index === segments.length - 1

						const displayName = getBreadcrumbDisplayName(baseUrl, segment)
						const isI18nKey = displayName === "home"
							|| displayName.startsWith("sidebar.")
							|| displayName.startsWith("breadcrumb.")

						breadcrumbs.push({
							name: displayName,
							url,
							isActive: isLast,
							isI18nKey,
						})
					})
				}
			}
		}
		else {
			// Fallback: generate breadcrumbs from pathname segments (non-i18n labels)
			const segments = pathname.split("/").filter(Boolean)
			segments.forEach((segment, index) => {
				const url = `/${segments.slice(0, index + 1).join("/")}`
				const isLast = index === segments.length - 1
				breadcrumbs.push({
					name: segment.charAt(0).toUpperCase() + segment.slice(1),
					url,
					isActive: isLast,
					isI18nKey: false,
				})
			})
		}

		return breadcrumbs
	}, [pathname, locale, session?.menu, customSegments])
}
