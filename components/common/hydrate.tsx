"use client"

import { DehydratedState, HydrationBoundary, QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/libs/query/client"

export default function Hydrate({ state, children }: { state: DehydratedState | null | undefined, children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient()}>
			<HydrationBoundary state={state}>
				{children}
			</HydrationBoundary>
		</QueryClientProvider>
	)
}
