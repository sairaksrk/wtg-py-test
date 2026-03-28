"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import {
	getUploadPermit,
	uploadFile as uploadFileToStorage,
} from "@/libs/api/storage.api"

interface UseFileUploadOptions {
	context?: "private" | "public"
	onSuccess?: (result: { path: string }) => void
	onError?: (error: any) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
	const { context = "private", onSuccess, onError } = options

	const mutation = useMutation({
		mutationFn: async (file: File) => {
			try {
				// Step 1: Get upload permit from wtg-core-api
				const permit = await getUploadPermit(file.name, file.type, context)

				// Step 2: Upload file to wtg-storage-api using permit
				const result = await uploadFileToStorage(
					file,
					permit.uploadUrl,
					permit.token,
				)

				return result
			}
			catch (error) {
				onError?.(error)
				throw error
			}
		},
		onSuccess: (result) => {
			toast.success("File uploaded successfully!")
			onSuccess?.(result)
		},
	})

	return {
		upload: mutation.mutate,
		uploadAsync: mutation.mutateAsync,
		isUploading: mutation.isPending,
		error: mutation.error,
	}
}
