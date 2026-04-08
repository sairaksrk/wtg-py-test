import type { ApiError, PaginatedResponse } from "@/types/api";
import type {
  ManpowerRequestList,
  ManpoweRequestListParams,
  CreatePositionItemDto,
  UpdatePositionItemDto,
  AddPositionItemDto,
  UpdateManpowerRequestsDto,
  PositionItems,
  ManpowerRequestDetail,
  CompensationListParams,
} from "@/types/compensation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPositionItem,
  createPositionItem,
  deleteManpowerRequests,
  deletePositionItem,
  getManpowerRequestsById,
  getManpowerRequestsDetailById,
  getManpowerRequestsList,
  getPositionItemById,
  updateManpowerRequests,
  updatePositionItem,
} from "../api/manpower.api";

/**
 * Query keys for Manpower Request -related queries
 * Following TanStack Query best practices for key management
 */
export const manpowerKeys = {
  all: ["manpower"] as const,
  lists: () => [...manpowerKeys.all, "list"] as const,
  list: (params?: ManpoweRequestListParams) =>
    [...manpowerKeys.lists(), params] as const,
  details: () => [...manpowerKeys.all, "detail"] as const,
  detail: (id: string) => [...manpowerKeys.details(), id] as const,
};

/**
 * RP-01 Hook to create position item
 */
export function useCreatePositionItem() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, CreatePositionItemDto>({
    mutationFn: createPositionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
    },
  });
}

/**
 * RP-01 Hook to add position item
 */

export function useAddPositionItem() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { id: string; data: AddPositionItemDto }>({
    mutationFn: ({ id, data }) => addPositionItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: manpowerKeys.detail(variables.id),
      });
    },
  });
}

/**
 * RP-01 Hook to fetch position item by ID (for update)
 */
// export function useGetPositionItemById(reqId: string, itemId: string) {
//   return useQuery<PositionItems, ApiError>({
//     queryKey: ["manpower", "item", reqId, itemId],
//     queryFn: () => getPositionItemById(reqId, itemId),
//     enabled: !!reqId && !!itemId,
//   });
// }

export function useGetPositionItemById(reqId: string, itemId: string) {
  return useQuery<PositionItems, ApiError>({
    queryKey: ["position-item-detail", reqId, itemId],
    queryFn: () => getPositionItemById(reqId, itemId),
    enabled: !!reqId && !!itemId,
    refetchOnMount: "always",
  });
}

/**
 * RP-01 Hook to update position item
 */

export function useUpdatePositionItem() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    { itemId: string; data: UpdatePositionItemDto; reqId: string }
  >({
    mutationFn: ({ itemId, data }) => updatePositionItem(itemId, data),
    // onSuccess: (_, variables) => {
    //   queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
    //   queryClient.invalidateQueries({
    //     queryKey: manpowerKeys.detail(variables.reqId),
    //   });
    // },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: manpowerKeys.detail(variables.reqId),
      });
      queryClient.invalidateQueries({
        queryKey: ["position-item-detail", variables.reqId, variables.itemId],
      });
    },
  });
}

/**
 * RP-01 Hook to delete position item
 */

export function useDeletePositionItem() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { id: string; reqId: string }>({
    mutationFn: ({ id }) => deletePositionItem(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: manpowerKeys.detail(variables.reqId),
      });
    },
  });
}

/**
 * RP-01 Hook to add-update manpower request
 */

export function useUpdateManpowerRequest() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    { id: string; data: UpdateManpowerRequestsDto }
  >({
    mutationFn: ({ id, data }) => updateManpowerRequests(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: manpowerKeys.detail(variables.id),
      });
    },
  });
}

/**
 * RP-01 Hook to delete  manpower request
 */

export function useDeleteManpowerRequest() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteManpowerRequests,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: manpowerKeys.lists() });
    },
  });
}

/**
 * RP-01 Hook to fetch paginated list
 */
export function useManpowerRequestsList(params?: CompensationListParams) {
  return useQuery<PaginatedResponse<ManpowerRequestList>, ApiError>({
    queryKey: manpowerKeys.list(params),
    queryFn: () => getManpowerRequestsList(params),
  });
}

/**
 * RP-01 Hook to fetch by ID (get All position item for update)
 */
export function useManpowerRequestsByID(reqId: string) {
  return useQuery<PositionItems[], ApiError>({
    queryKey: manpowerKeys.detail(reqId),
    queryFn: () => getManpowerRequestsById(reqId),
    enabled: !!reqId,
  });
}

/**
 * RP-01 Hook to fetch by ID (get manpower requests for view detail)
 */
export function useManpowerRequestsDetailById(reqId: string) {
  return useQuery<ManpowerRequestDetail, ApiError>({
    queryKey: manpowerKeys.detail(reqId),
    queryFn: () => getManpowerRequestsDetailById(reqId),
    enabled: !!reqId,
  });
}
