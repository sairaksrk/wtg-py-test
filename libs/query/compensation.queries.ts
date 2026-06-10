import type { ApiError, PaginatedResponse } from "@/types/api";
import type {
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
  CompensationRequestData,
  GroupItem,
  CreateCreditLimit,
  GetCompensationPersonnelParams,
  SaveCompensationPayload,
  CompensationItem,
  UpdateCompensationItem,
} from "@/types/compensation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompensationItem,
  createCreditLimitList,
  deleteCreditLimitList,
  getCompensationList,
  getCompensationRequestById,
  getGroupsListCheckBox,
  getCompensationGroupDetail,
  getCompensationPersonnelList,
  saveCompensationGroupItems,
  updateStatusConsider,
  deleteCompensationItem,
  getCompensationItemById,
  updateCompensationItem,
  updateSubmitSuccess,
  updateSubmitDeliver,
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
  detail: (reqId: string) => [...compensationKeys.details(), reqId] as const,
  requestDetails: () => [...compensationKeys.all, "request-detail"] as const,
  requestDetail: (reqId: string, params?: CompensationListParams) =>
    [...compensationKeys.requestDetails(), reqId, params] as const,
  groupsListCheckBoxes: () =>
    [...compensationKeys.all, "groups-list-checkbox"] as const,
  groupsListCheckBox: (reqId: string, params?: CompensationListParams) =>
    [...compensationKeys.groupsListCheckBoxes(), reqId, params] as const,
  personnelLists: () => [...compensationKeys.all, "personnel-list"] as const,
  personnelList: (
    reqId: string,
    groupsId: string,
    body: GetCompensationPersonnelParams,
  ) => [...compensationKeys.personnelLists(), reqId, groupsId, body] as const,
};

// หน้า 1 จัดการค่าตอบแทน - ดึงข้อมูล จัดการค่าตอบแทน Get All

export function useGetCompensationList(params?: CompensationListParams) {
  return useQuery<PaginatedResponse<CompensationList>, ApiError>({
    queryKey: compensationKeys.list(params),
    queryFn: () => getCompensationList(params),
  });
}

// หน้า 1 จัดการค่าตอบแทน - เพิ่ม รายการค่าตอบแทน

export function useCreateCompensationItem() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, CreateCompensationItem>({
    mutationFn: createCompensationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compensationKeys.lists() });
    },
  });
}

// หน้า 1 จัดการค่าตอบแทน - ลบ รายการค่าตอบแทน && หน้า 2 ปุ่มลบรายการ

export function useDeleteCompensationItem() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, string>({
    mutationFn: deleteCompensationItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compensationKeys.lists() });
    },
  });
}

// หน้า 2 - Modal แก้ไข รายการค่าตอบแทน (รอทำ)

// export function useUpdateCompensationItem() {
//   const queryClient = useQueryClient();
//   return useMutation<
//     void,
//     ApiError,
//     { reqId: string; data: UpdateCompensationItem }
//   >({
//     mutationFn: ({ reqId, data }) => updateCompensationItem(reqId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: compensationKeys.detail(variables.reqId),
//       });
//     },
//   });
// }

// หน้า 2 - Modal ดึงข้อมูล รายการค่าตอบแทน Get ById (รอทำ)

// export function useGetCompensationItemById(reqId: string) {
//   return useQuery<CompensationItem, ApiError>({
//     queryKey: compensationKeys.detail(reqId),
//     queryFn: () => getCompensationItemById(reqId),
//     enabled: !!reqId,
//   });
// }

// หน้า 2 - ดึงข้อมูล หน้าจัดการรายการบริหารวงเงิน Get ById

export function useGetCompensationRequestById(
  reqId: string,
  params?: CompensationListParams,
) {
  return useQuery<CompensationRequestData, ApiError>({
    queryKey: compensationKeys.requestDetail(reqId, params),
    queryFn: () => getCompensationRequestById(reqId, params),
    enabled: !!reqId,
  });
}

// หน้า 2 - ดึง รายการกลุ่มที่สร้างไว้แล้ว (checkbox)

export function useGetGroupsListCheckBox(reqId: string) {
  return useQuery<GroupItem[], ApiError>({
    queryKey: compensationKeys.groupsListCheckBox(reqId),
    queryFn: () => getGroupsListCheckBox(reqId),
    enabled: !!reqId,
  });
}

// หน้า 2 - Modal เพิ่ม รายการบริหารวงเงิน

export function useCreateCreditLimitList() {
  const queryClient = useQueryClient();

  return useMutation<{ payrollPeriodId: string }, ApiError, CreateCreditLimit>({
    mutationFn: createCreditLimitList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: compensationKeys.requestDetails(),
      });
    },
  });
}

// หน้า 2 - ลบ รายการบริหารวงเงิน

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

// หน้า 2 - ปุ่ม บันทึกการนำส่ง Update Status นำส่งเอกสาร (รอทำ)

// export function useUpdateSubmitDeliver() {
//   const queryClient = useQueryClient();
//   return useMutation<void, ApiError, { reqId: string }>({
//     mutationFn: ({ reqId }) => updateSubmitDeliver(reqId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: compensationKeys.requestDetails(),
//       });
//     },
//   });
// }

// หน้า 2 - ปุ่ม เสร็จสิ้น Update Status เสร็จสิ้น (รอทำ)

// export function useUpdateSubmitSuccess() {
//   const queryClient = useQueryClient();
//   return useMutation<void, ApiError, { reqId: string }>({
//     mutationFn: ({ reqId }) => updateSubmitSuccess(reqId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: compensationKeys.requestDetails(),
//       });
//     },
//   });
// }

// หน้า 3 - ดึงข้อมูลรายละเอียดกลุ่มบริหารวงเงินตาม groupsId

export function useGetCompensationGroupDetail(groupsId: string) {
  return useQuery<any, ApiError>({
    queryKey: ["compensation-group-detail", groupsId],
    queryFn: () => getCompensationGroupDetail(groupsId),
    enabled: !!groupsId,
  });
}

// หน้า 3 - ดึงรายชื่อพนักงานในกลุ่มพร้อมผลคะแนนประเมินและการจัดสรร

export function useGetCompensationPersonnelList(
  reqId: string,
  groupsId: string,
  body: GetCompensationPersonnelParams,
  options?: { enabled?: boolean },
) {
  return useQuery<any, ApiError>({
    queryKey: compensationKeys.personnelList(reqId, groupsId, body),
    queryFn: () => getCompensationPersonnelList(reqId, groupsId, body),
    enabled: !!reqId && !!groupsId && (options?.enabled ?? true),
  });
}

// หน้า 3 - บันทึกข้อมูลแถวการคำนวณโดยใช้ groupsId ใน URL path

export function useSaveCompensationGroupItems() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    { groupsId: string; payload: SaveCompensationPayload }
  >({
    mutationFn: ({ groupsId, payload }) =>
      saveCompensationGroupItems(groupsId, payload),
    onSuccess: (_, variables) => {
      // Invalidate รายชื่อพนักงานเพื่ออัปเดตตาราง
      queryClient.invalidateQueries({
        queryKey: compensationKeys.personnelLists(),
      });
      // Invalidate รายละเอียดกลุ่มเพื่อดึงข้อมูลตัวเลขสรุปวงเงินใหม่
      queryClient.invalidateQueries({
        queryKey: ["compensation-group-detail", variables.groupsId],
      });
    },
  });
}

// หน้า 3 - กดปุ่ม พิจารณาเสร็จสิ้น

export function useUpdateStatusConsider() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, { groupsId: string }>({
    mutationFn: ({ groupsId }) => updateStatusConsider(groupsId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: compensationKeys.personnelLists(),
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation-group-detail", variables.groupsId],
      });
    },
  });
}
