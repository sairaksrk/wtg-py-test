"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPrivateFile, getPrivateFileAccess } from "@/libs/api/storage.api"

interface UsePrivateFileOptions {
	filePath: string
	enabled?: boolean
}

/**
 * Hook to get private file access (signed URL and token)
 * Useful when you need the URL and token separately
 */
export function usePrivateFileAccess(filePath: string, enabled = true) {
	return useQuery({
		queryKey: ["private-file-access", filePath],
		queryFn: () => getPrivateFileAccess(filePath),
		enabled: enabled && !!filePath,
		staleTime: 45 * 60 * 1000, // 45 minutes (token expires in 1 hour)
	})
}

/**
 * Hook to fetch a private file blob
 * Returns the actual file content that can be displayed or downloaded
 */
export function usePrivateFile({ filePath, enabled = true }: UsePrivateFileOptions) {
	return useQuery({
		queryKey: ["private-file", filePath],
		queryFn: () => fetchPrivateFile(filePath),
		enabled: enabled && !!filePath,
		staleTime: 45 * 60 * 1000, // 45 minutes
	})
}
