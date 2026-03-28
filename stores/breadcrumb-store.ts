import { create } from "zustand"

interface CustomBreadcrumb {
	name: string
	url?: string
	isI18nKey?: boolean
}

interface BreadcrumbStore {
	customSegments: CustomBreadcrumb[]
	setCustomSegments: (segments: CustomBreadcrumb[]) => void
	clearCustomSegments: () => void
}

export const useBreadcrumbStore = create<BreadcrumbStore>(set => ({
	customSegments: [],
	setCustomSegments: (segments: CustomBreadcrumb[]) => {
		set({ customSegments: segments })
	},
	clearCustomSegments: () => {
		set({ customSegments: [] })
	},
}))
