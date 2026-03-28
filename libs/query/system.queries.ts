import type { SystemListResponseDto } from "../api/system.api"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { getSystemList } from "../api/system.api"

/**
 * Query keys for system-related queries
 */
export const systemKeys = {
	all: ["systems"] as const,
	lists: () => [...systemKeys.all, "list"] as const,
}

/**
 * Hook to fetch list of systems with modules
 */
export function useSystemList() {
	return useQuery<SystemListResponseDto[], AxiosError>({
		queryKey: systemKeys.lists(),
		queryFn: () => getSystemList(),
	})
}
