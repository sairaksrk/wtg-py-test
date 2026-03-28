export interface DemoItem {
	id: string
	nameTh: string
	nameEn: string
	fileName?: string
	fileUrl?: string
	createdAt: number
	updatedAt?: number
}

export interface CreateDemoDto {
	nameTh: string
	nameEn: string
	fileName?: string
	fileUrl?: string
}

export interface UpdateDemoDto {
	nameTh?: string
	nameEn?: string
	fileName?: string
	fileUrl?: string
}

export interface DemoFilterParams {
	page?: number
	take?: number
	nameTh?: string
}
