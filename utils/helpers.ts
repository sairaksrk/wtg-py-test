import type { ClassValue } from "clsx"
import clsx from "clsx"
import { addYears, format } from "date-fns"
import { th } from "date-fns/locale"
import { twMerge } from "tailwind-merge"
import { getPrivateFileAccess } from "@/libs/api/storage.api"

export const getPageSize = (): number => Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE ?? "10")

export const getPageSizeMini = (): number => Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE_MINI ?? "5")

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function toInputFormat(epoch: number): string {
	if (!epoch)
		return ""
	return format(new Date(Number(epoch)), "yyyy-MM-dd")
}

export function fromInputToEpoch(dateString: string): number | null {
	if (!dateString)
		return null
	return new Date(dateString).getTime()
}

/**
 * Open a private file in a new tab
 * Gets a signed URL from core-api and opens it in the browser
 */
export async function openPrivateFile(filePath: string): Promise<void> {
	if (!filePath)
		return

	try {
		const { accessUrl, token } = await getPrivateFileAccess(filePath)
		const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
		const fullUrl = `${BASE_URL}/api/storage${accessUrl}?token=${encodeURIComponent(token)}`
		window.open(fullUrl, "_blank")
	}
	catch (error) {
		console.error("Failed to access file:", error)
		throw error
	}
}
