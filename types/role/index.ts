/**
 * Role domain types
 */

export interface Role {
	id: string
	name: string
	systems: RoleSystem[]
	createdAt?: string
	updatedAt?: string
}

export interface RoleSystem {
	name: string
	modules: RoleModule[]
}

export interface RoleModule {
	name: string
	id?: string
}

/**
 * DTOs (Data Transfer Objects)
 */

export interface CreateRoleDto {
	name: string
	systems: CreateRoleSystemDto[]
}

export interface CreateRoleSystemDto {
	name: string
	modules: CreateRoleModuleDto[]
}

export interface CreateRoleModuleDto {
	name: string
}

export interface UpdateRoleDto {
	name?: string
	systems?: UpdateRoleSystemDto[]
}

export interface UpdateRoleSystemDto {
	name: string
	modules: UpdateRoleModuleDto[]
}

export interface UpdateRoleModuleDto {
	name: string
}

/**
 * Query parameters
 */

export interface RoleListParams {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	sortOrder?: "asc" | "desc"
}

/**
 * Legacy types for backward compatibility
 * @deprecated Use Role instead
 */
export type RoleDataList = Role

/**
 * @deprecated Use RoleSystem instead
 */
export type RoleDataSystem = RoleSystem

/**
 * @deprecated Use RoleModule instead
 */
export type RoleDataModule = RoleModule
