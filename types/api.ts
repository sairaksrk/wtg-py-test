/**
 * Global API response types
 */

export interface PaginatedResponse<T> {
	data: T[]
	meta: PaginatedMeta
}

export interface PaginatedMeta {
	page: number
	take: number
	itemCount: number
	pageCount: number
}

export interface MasterSelectProps {
	value: string | number
	label: string
}

export function emptyPaginatedResponse<T>(): PaginatedResponse<T> {
	return {
		data: [],
		meta: {
			page: 1,
			take: 10,
			itemCount: 0,
			pageCount: 0,
		},
	}
}

export interface ModalStateProps {
	state: boolean
	id: string | null
}

export interface UploadResponse {
	name: string
	src: string
}

export interface ApiErrorPayload {
	error: string
	hint: string[]
	statusCode?: number
}

export class ApiError extends Error {
	readonly error: string
	readonly hint: string[]
	readonly statusCode?: number

	constructor(payload: ApiErrorPayload) {
		// Store the full payload in the message as JSON so it survives server-client serialization
		super(JSON.stringify(payload))
		this.name = "ApiError"
		this.error = payload.error
		this.hint = payload.hint
		this.statusCode = payload.statusCode

		// Ensure properties are enumerable for JSON serialization
		Object.defineProperty(this, "error", {
			enumerable: true,
			value: payload.error,
		})
		Object.defineProperty(this, "hint", {
			enumerable: true,
			value: payload.hint,
		})
		Object.defineProperty(this, "statusCode", {
			enumerable: true,
			value: payload.statusCode,
		})
	}

	// Add toJSON method for proper serialization
	toJSON(): ApiErrorPayload {
		return {
			error: this.error,
			hint: this.hint,
			statusCode: this.statusCode,
		}
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError
}

/**
 * Helper to extract error details from ApiError for display
 * Useful in React Query mutation error handlers
 */
export function getApiErrorDetails(error: unknown): ApiErrorPayload {
	// Check if it's an ApiError instance with properties
	if (isApiError(error) && error.error) {
		const payload = {
			error: error.error,
			hint: Array.isArray(error.hint) ? error.hint : [],
			statusCode: error.statusCode,
		}
		return payload
	}

	// Check if error has the expected structure (even if not ApiError instance)
	if (error && typeof error === "object") {
		const err = error as any

		if (typeof err.error === "string") {
			const payload = {
				error: err.error,
				hint: Array.isArray(err.hint) ? err.hint : [],
				statusCode: err.statusCode,
			}
			return payload
		}

		// Handle Error instances - try to parse JSON from message
		if (err instanceof Error && err.message) {
			try {
				const parsed = JSON.parse(err.message)
				if (parsed && typeof parsed.error === "string") {
					const payload = {
						error: parsed.error,
						hint: Array.isArray(parsed.hint) ? parsed.hint : [],
						statusCode: parsed.statusCode,
					}
					return payload
				}
			}
			catch (e) {
			}
			return {
				error: err.message || "An error occurred",
				hint: [],
				statusCode: 500,
			}
		}
	}

	// Fallback
	return {
		error: "An unexpected error occurred",
		hint: [],
		statusCode: 500,
	}
}

/**
 * Format API error for display in UI (toast, alert, etc.)
 * Returns formatted message with proper line breaks
 */
export function formatApiError(error: unknown, fallbackMessage?: string): { title: string, description: string, statusCode: number } {
	const apiError = getApiErrorDetails(error)
	return {
		title: apiError.error || fallbackMessage || "An error occurred",
		description: apiError.hint.length > 0 ? apiError.hint.join("<br/>") : "",
		statusCode: apiError.statusCode ?? 500,
	}
}
