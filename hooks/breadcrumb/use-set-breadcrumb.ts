import { useEffect, useMemo } from "react"
import { useBreadcrumbStore } from "@/stores/breadcrumb-store"

interface CustomBreadcrumb {
	name: string
	url?: string
	isI18nKey?: boolean
}

/**
 * Hook to set custom breadcrumb segments for the current page
 * Automatically clears on unmount
 *
 * @param segments Array of custom breadcrumb items
 *
 * @example
 * ```tsx
 * function RoleDetailPage({ params }: { params: { id: string } }) {
 *   const t = useTranslations()
 *   const [role, setRole] = useState(null)
 *
 *   useSetBreadcrumb([
 *     {
 *       name: role?.name || t('common.loading'),
 *       url: `/role/${params.id}`,
 *     }
 *   ])
 *
 *   return <div>Role Detail: {role?.name}</div>
 * }
 * ```
 */
export function useSetBreadcrumb(segments: CustomBreadcrumb[]) {
	// Create a stable serialized version for deep comparison
	const segmentsKey = useMemo(() => JSON.stringify(segments), [segments])

	useEffect(() => {
		const { setCustomSegments, clearCustomSegments } = useBreadcrumbStore.getState()
		const parsedSegments = JSON.parse(segmentsKey) as CustomBreadcrumb[]

		setCustomSegments(parsedSegments)

		return () => {
			clearCustomSegments()
		}
	}, [segmentsKey])
}