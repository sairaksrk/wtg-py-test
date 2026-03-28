import type { PaginatedResponse } from "@/types/api"
import type { CreateRoleDto, Role, RoleListParams, UpdateRoleDto } from "@/types/role"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { createRole, deleteRole, getRoleById, getRoleList, updateRole } from "../api/role.api"

/**
 * Query keys for role-related queries
 * Following TanStack Query best practices for key management
 */
export const roleKeys = {
	all: ["roles"] as const,
	lists: () => [...roleKeys.all, "list"] as const,
	list: (params?: RoleListParams) => [...roleKeys.lists(), params] as const,
	details: () => [...roleKeys.all, "detail"] as const,
	detail: (id: string) => [...roleKeys.details(), id] as const,
}

/**
 * Hook to fetch paginated list of roles
 */
export function useRoleList(params?: RoleListParams) {
	return useQuery<PaginatedResponse<Role>, AxiosError>({
		queryKey: roleKeys.list(params),
		queryFn: () => getRoleList(params),
	})
}

/**
 * Hook to fetch a single role by ID
 */
export function useRole(id: string) {
	return useQuery<Role, AxiosError>({
		queryKey: roleKeys.detail(id),
		queryFn: () => getRoleById(id),
		enabled: !!id,
	})
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
	const queryClient = useQueryClient()

	return useMutation<Role, AxiosError, CreateRoleDto>({
		mutationFn: createRole,
		onSuccess: () => {
			// Invalidate and refetch role list
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
		},
	})
}

/**
 * Hook to update an existing role
 */
export function useUpdateRole() {
	const queryClient = useQueryClient()

	return useMutation<Role, AxiosError, { id: string, data: UpdateRoleDto }>({
		mutationFn: ({ id, data }) => updateRole(id, data),
		onSuccess: (data) => {
			// Invalidate both the list and the specific detail
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
			queryClient.invalidateQueries({ queryKey: roleKeys.detail(data.id) })
		},
	})
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
	const queryClient = useQueryClient()

	return useMutation<void, AxiosError, string>({
		mutationFn: deleteRole,
		onSuccess: () => {
			// Invalidate role list after deletion
			queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
		},
	})
}
