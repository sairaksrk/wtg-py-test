import type { ApiError, PaginatedResponse } from "@/types/api";
import type {
  ManpoweRequestListParams,
  CreatePositionItemDto,
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
} from "@/types/compensation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompensationItem,
  getCompensationList,
  getCompensationRequestById,
} from "../api/compensation.api";

/**
 * Query keys for Compensation -related queries
 * Following TanStack Query best practices for key management
 */
export const compensationKeys = {
  all: ["compensation"] as const,
  lists: () => [...compensationKeys.all, "list"] as const,
  list: (params?: CompensationListParams) =>
    [...compensationKeys.lists(), params] as const,
  details: () => [...compensationKeys.all, "detail"] as const,
  detail: (id: string) => [...compensationKeys.details(), id] as const,
  requestDetails: () => [...compensationKeys.all, "request-detail"] as const,
  requestDetail: (reqId: string) =>
    [...compensationKeys.requestDetails(), reqId] as const,
};

export function useGetCompensationList(params?: CompensationListParams) {
  return useQuery<PaginatedResponse<CompensationList>, ApiError>({
    queryKey: compensationKeys.list(params),
    queryFn: () => getCompensationList(params),
  });
}

export function useCreateCompensationItem() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, CreateCompensationItem>({
    mutationFn: createCompensationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compensationKeys.lists() });
    },
  });
}

export function useGetCompensationRequestById(reqId: string) {
  return useQuery<any, ApiError>({
    queryKey: compensationKeys.requestDetail(reqId),
    queryFn: () => getCompensationRequestById(reqId),
    enabled: !!reqId,
  });
}
