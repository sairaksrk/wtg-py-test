import type { ApiError, PaginatedResponse } from "@/types/api";
import type {
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
} from "@/types/compensation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompensationItem,
  createCreditLimitList,
  deleteCreditLimitList,
  getCompensationList,
  getCompensationRequestById,
  getGroupsListCheckBox,
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
  requestDetail: (reqId: string, params?: CompensationListParams) =>
    [...compensationKeys.requestDetails(), reqId, params] as const,
  groupsListCheckBoxes: () =>
    [...compensationKeys.all, "groups-list-checkbox"] as const,
  groupsListCheckBox: (reqId: string, params?: CompensationListParams) =>
    [...compensationKeys.groupsListCheckBoxes(), reqId, params] as const,
};
// ดึงรายการ จัดการค่าตอบแทน Get All

export function useGetCompensationList(params?: CompensationListParams) {
  return useQuery<PaginatedResponse<CompensationList>, ApiError>({
    queryKey: compensationKeys.list(params),
    queryFn: () => getCompensationList(params),
  });
}

// เพิ่ม รายการค่าตอบแทน

export function useCreateCompensationItem() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, CreateCompensationItem>({
    mutationFn: createCompensationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compensationKeys.lists() });
    },
  });
}

// ดึงข้อมูล หน้าจัดการรายการบริหารวงเงิน ById

export function useGetCompensationRequestById(
  reqId: string,
  params?: CompensationListParams,
) {
  return useQuery<any, ApiError>({
    queryKey: compensationKeys.requestDetail(reqId, params),
    queryFn: () => getCompensationRequestById(reqId, params),
    enabled: !!reqId,
  });
}

// ดึง รายการกลุ่มที่สร้างไว้แล้ว (checkbox)
export function useGetGroupsListCheckBox(
  reqId: string,
  //   params?: CompensationListParams,
) {
  return useQuery<any, ApiError>({
    queryKey: compensationKeys.groupsListCheckBox(reqId),
    queryFn: () => getGroupsListCheckBox(reqId),
    enabled: !!reqId,
  });
}

// เพิ่มรายการบริหารวงเงิน

export function useCreateCreditLimitList() {
  const queryClient = useQueryClient();

  return useMutation<{ payrollPeriodId: string }, ApiError, any>({
    mutationFn: createCreditLimitList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: compensationKeys.requestDetails(),
      });
    },
  });
}
// ลบรายการบริหารวงเงิน

export function useDeleteCreditLimitList() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteCreditLimitList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: compensationKeys.requestDetails(),
      });
    },
  });
}
