// "use server"

import type { PaginatedResponse } from "@/types/api";
import type {
  ManpowerRequestList,
  UpdateManpowerRequestsDto,
  ManpoweRequestListParams,
  CreatePositionItemDto,
  UpdatePositionItemDto,
  AddPositionItemDto,
  PositionItems,
  ManpowerRequestDetail,
  CompensationListParams,
} from "@/types/compensation";
import { api } from "./api";

/**
 Add position item  & Create manpower request
 */

// Step 1 Create position item รายการแรก (ได้ id ของ request) / กดบันทึก -> status ฉบับร่าง
export async function createPositionItem(
  payload: CreatePositionItemDto,
): Promise<{ id: string }> {
  return api("POST", `/manpower-requests`, payload, {
    plugin: "rp",
  });
}

// Step 2 Add position item รายการต่อไป (ส่ง id ของ request ไปในการเพิ่ม item)
export async function addPositionItem(
  reqId: string,
  payload: AddPositionItemDto,
): Promise<void> {
  return api("POST", `/manpower-requests/${reqId}/items`, payload, {
    plugin: "rp",
  });
}

/**
 * Get position item by id ดึงกลับมา edit
 */
export async function getPositionItemById(
  reqId: string,
  itemId: string,
): Promise<PositionItems> {
  return api<PositionItems>(
    "GET",
    `/manpower-requests/${reqId}/items/${itemId}`,
    undefined,
    {
      plugin: "rp",
    },
  );
}

// Edit position item รายการที่มีอยู่
export async function updatePositionItem(
  itemId: string,
  payload: UpdatePositionItemDto,
): Promise<void> {
  return api<void>("PUT", `/manpower-requests/items/${itemId}`, payload, {
    plugin: "rp",
  });
}

// Delete position item
export async function deletePositionItem(id: string): Promise<void> {
  return api<void>("DELETE", `/manpower-requests/items/${id}`, undefined, {
    plugin: "rp",
  });
}

/**
 * Get a single manpower requests by ID (for update)
 */
export async function getManpowerRequestsById(
  id: string,
): Promise<PositionItems[]> {
  return api<PositionItems[]>(
    "GET",
    `/manpower-requests/${id}/items`,
    undefined,
    {
      plugin: "rp",
    },
  );
}

// Step 3 add-update manpower request (ส่ง id ของ request ไปในการเพิ่มข้อมูล) / กดยืนยันส่งคำขอ ฉบับร่าง -> status รอตรวจสอบ
export async function updateManpowerRequests(
  id: string,
  payload: UpdateManpowerRequestsDto,
): Promise<void> {
  return api<void>("PUT", `/manpower-requests/${id}/submit`, payload, {
    plugin: "rp",
  });
}

// delete manpower request
export async function deleteManpowerRequests(id: string): Promise<void> {
  return api<void>("DELETE", `/manpower-requests/${id}`, undefined, {
    plugin: "rp",
  });
}

/**
 * RP-01 Get paginated list
 */
export async function getManpowerRequestsList(
  params?: CompensationListParams,
): Promise<PaginatedResponse<ManpowerRequestList>> {
  return api<PaginatedResponse<ManpowerRequestList>>(
    "GET",
    "/manpower-requests",
    undefined,
    {
      params: {
        page: params?.page,
        take: params?.take,
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.startDate ? { startDate: params.startDate } : {}),
      },
      plugin: "rp",
    },
  );
}

/**
 * Get a single by ID (for view detail)
 */
export async function getManpowerRequestsDetailById(
  reqId: string,
): Promise<ManpowerRequestDetail> {
  return api<ManpowerRequestDetail>(
    "GET",
    `/manpower-requests/${reqId}`,
    undefined,
    { plugin: "rp" },
  );
}
