import { useLocale, useTranslations } from "next-intl"
import { useMemo } from "react"
import { usePathname } from "@/i18n/navigation"
import { useSession } from "@/libs/auth/auth-client"
import { useBreadcrumbStore } from "@/stores/breadcrumb-store"
import { getBreadcrumbDisplayName } from "@/utils/breadcrumb-config"
import { MOCKUP_SESSION } from "@/libs/constants/menu"

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
	const t = useTranslations("common")
	const { data: sessionData } = useSession()
	
	// Use mockup session if real session is not available
	const session =
    sessionData?.menu && sessionData.menu.length > 0
      ? sessionData
      : MOCKUP_SESSION;
	  
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
				const menuModules = system.modules?.filter((m: any) => m.type.toUpperCase() === "MENU") || []

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
						// Check if segment is an ID (UUID or numeric ID)
						const isId = /^[0-9a-f-]+$/i.test(segment);
						if (isId) return;

						// Check if next segment is an ID (if so, this is the active page)
						const nextSegment = segments[index + 1];
						const isNextId = !!nextSegment && /^[0-9a-f-]+$/i.test(nextSegment);
						const isCurrentActive = !!(index === segments.length - 1 || isNextId);

						const displayName = getBreadcrumbDisplayName(baseUrl, segment)
						
						// Check for translation in common.json
						const i18nKey = `breadcrumb.${segment}`;
						const hasTranslation = t.has(i18nKey);

						breadcrumbs.push({
							name: hasTranslation ? i18nKey : displayName,
							url: isCurrentActive ? pathname : undefined,
							isActive: isCurrentActive,
							isI18nKey: hasTranslation || displayName.startsWith("breadcrumb."),
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
	}, [pathname, locale, session?.menu, customSegments, t])
}