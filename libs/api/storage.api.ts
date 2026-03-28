import { api } from "./api"

/**
 * Get upload permit from wtg-core-api
 * This issues a JWT token that allows file upload to wtg-storage-api
 */
export async function getUploadPermit(
	filename: string,
	contentType: string,
	context: "private" | "public" = "private",
): Promise<{ uploadUrl: string, token: string }> {
	const res = await api<{ uploadUrl: string, token: string }>("POST", "/files/presign-upload", {
		filename,
		contentType,
		context,
	}, { plugin: "core" })

	return res
}

/**
 * Upload a file to storage using permit token
 */
export async function uploadFile(
	file: File,
	uploadUrl: string,
	token: string,
): Promise<{ success: boolean, path: string, message: string }> {
	try {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("token", token)

		const response = await api<{ success: boolean, path: string, message: string }>(
			"POST",
			uploadUrl,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" }, plugin: "storage" },
		)

		return response
	}
	catch (error) {
		console.error("Error uploading file:", error)
		throw new Error("Failed to upload file")
	}
}

/**
 * Get private file access URL from wtg-core-api
 * This generates a signed URL that allows access to private files
 */
export async function getPrivateFileAccess(
	filePath: string,
): Promise<{ accessUrl: string, token: string }> {
	const res = await api<{ accessUrl: string, token: string }>(
		"GET",
		`/files/private-access?filePath=${encodeURIComponent(filePath)}`,
		undefined,
		{ plugin: "core" },
	)

	return res
}

/**
 * Fetch a private file from storage using the signed URL and token
 * Returns the file blob that can be used to display or download
 */
export async function fetchPrivateFile(
	filePath: string,
): Promise<Blob> {
	try {
		// Step 1: Get access URL and token from core-api
		const { accessUrl, token } = await getPrivateFileAccess(filePath)

		// Step 2: Fetch the file from storage API using the signed URL and token
		const response = await api<Blob>(
			"GET",
			`${accessUrl}?token=${encodeURIComponent(token)}`,
			undefined,
			{ plugin: "storage", responseType: "blob" },
		)

		return response
	}
	catch (error) {
		console.error("Error fetching private file:", error)
		throw new Error("Failed to fetch private file")
	}
}

/**
 * Get public file URL (no authentication needed)
 * Public files can be accessed directly from storage
 */
export function getPublicFileUrl(filePath: string): string {
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
	return `${BASE_URL}/api/storage/public/${filePath}`
}

/**
 * Get delete permit from wtg-core-api
 * This issues a JWT token that allows file deletion from wtg-storage-api
 */
export async function getDeletePermit(
	filePath: string,
): Promise<{ deleteUrl: string, token: string }> {
	const res = await api<{ deleteUrl: string, token: string }>("POST", "/files/delete-permit", {
		filePath,
	}, { plugin: "core" })

	return res
}

/**
 * Delete a file from storage using permit token
 */
export async function deleteFile(
	filePath: string,
	deleteUrl: string,
	token: string,
): Promise<{ success: boolean, message: string }> {
	try {
		const response = await api<{ success: boolean, message: string }>(
			"DELETE",
			deleteUrl,
			{ path: filePath, token },
			{ plugin: "storage" },
		)

		return response
	}
	catch (error) {
		console.error("Error deleting file:", error)
		throw new Error("Failed to delete file")
	}
}
