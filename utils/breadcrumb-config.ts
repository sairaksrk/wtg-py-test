/**
 * Configuration for custom breadcrumb display names for dynamic routes
 *
 * Usage:
 * - Key: The base route path (e.g., "/permission")
 * - Value: Function that takes the dynamic segment and returns display name
 */
export const breadcrumbDisplayNames: Record<string, (segment: string) => string> = {}

/**
 * Get display name for a dynamic segment
 * @param basePath The base path (e.g., "/permission")
 * @param segment The dynamic segment (e.g., "123")
 * @returns The display name for the breadcrumb
 */
export function getBreadcrumbDisplayName(basePath: string, segment: string): string {
	const customFn = breadcrumbDisplayNames[basePath]
	if (customFn) {
		return customFn(segment)
	}

	// Default: If it looks like an ID/UUID, show "รายละเอียด"
	// Otherwise, capitalize the segment
	return /^[0-9a-f-]+$/i.test(segment)
		? `breadcrumb.detail`
		: segment.charAt(0).toUpperCase() + segment.slice(1)
}
