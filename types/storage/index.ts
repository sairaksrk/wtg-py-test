export interface StorageFile {
	id: string
	name: string
	size: number
	mimetype: string
	url: string
	uploadedBy: string
	uploadedAt: string
	lastModified: string
	isPublic: boolean
}

export interface StorageFolder {
	id: string
	name: string
	path: string
	createdAt: string
	updatedAt: string
	fileCount: number
}

export interface StorageUsage {
	totalSize: number
	usedSize: number
	fileCount: number
	folderCount: number
	percentageUsed: number
}

export interface StorageStats {
	usage: StorageUsage
	recentFiles: StorageFile[]
	topFolders: StorageFolder[]
}

export interface CreateFolderRequest {
	name: string
	parentFolderId?: string
}

export interface UpdateStorageFileRequest {
	name?: string
	isPublic?: boolean
}
