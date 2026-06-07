// "use server"

import type { PaginatedResponse } from "@/types/api";
import type {
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
  CompensationRequestData,
  // GroupItem,
  CreateCreditLimit,
} from "@/types/compensation";
import { api } from "./api";

// ดึงข้อมูล จัดการค่าตอบแทน Get All

export async function getCompensationList(
  params?: CompensationListParams,
): Promise<PaginatedResponse<CompensationList>> {
  return api<PaginatedResponse<CompensationList>>(
    "GET",
    "/payroll/increment/rounds",
    undefined,
    {
      params: {
        page: params?.page,
        take: params?.take,
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.startDate ? { startDate: params.startDate } : {}),
      },
      plugin: "py",
    },
  );
}

// เพิ่ม รายการค่าตอบแทน

export async function createCompensationItem(
  payload: CreateCompensationItem,
): Promise<{ id: string }> {
  return api("POST", `/payroll/increment/rounds`, payload, {
    plugin: "py",
  });
}

// ดึงข้อมูล หน้าจัดการรายการบริหารวงเงิน Get ById

export async function getCompensationRequestById(
  reqId: string,
  params?: CompensationListParams,
): Promise<CompensationRequestData> {
  return api<CompensationRequestData>(
    "GET",
    `/payroll/master/increment-groups/${reqId}`,
    undefined,
    {
      params: {
        page: params?.page,
        take: params?.take,
      },
      plugin: "py",
    },
  );
}

// ดึง รายการกลุ่มที่สร้างไว้แล้ว (checkbox)

export async function getGroupsListCheckBox(
  reqId: string,
  // ): Promise<GroupItem[]> {
): Promise<any[]> {
  // return api<GroupItem[]>("GET", `/payroll/master/groups/options`, undefined, {
  return api<any[]>("GET", `/payroll/master/groups/options`, undefined, {
    params: {
      excludePeriodId: reqId,
    },
    plugin: "py",
  });
}

// เพิ่ม รายการบริหารวงเงิน

export async function createCreditLimitList(
  payload: CreateCreditLimit,
): Promise<{ payrollPeriodId: string }> {
  return api("POST", `/payroll/increment/groups`, payload, {
    plugin: "py",
  });
}

// ลบ รายการบริหารวงเงิน

export async function deleteCreditLimitList(id: string): Promise<void> {
  return api<void>("DELETE", `/payroll/increment/groups/${id}`, undefined, {
    plugin: "py",
  });
}

// ดึงข้อมูลรายละเอียดกลุ่มบริหารวงเงินตาม groupsId
export async function getCompensationGroupDetail(
  groupsId: string,
): Promise<any> {
  return api<any>(
    "GET",
    `/payroll/master/increment-groups/detail/${groupsId}`,
    undefined,
    {
      plugin: "py",
    },
  );
}

export interface PreviewRoundData {
  allocPercent?: number | null;
  allocQuotaPercent?: number | null;
  allocAmount?: number | null;
}

export interface PreviewDataItem {
  employeeId: string;
  round1?: PreviewRoundData;
  round2?: PreviewRoundData;
  round3?: PreviewRoundData;
}

export interface GetCompensationPersonnelParams {
  page: number;
  take: number;
  previewData?: PreviewDataItem[];
  search?: string;
  requestNo?: string;
  name?: string;
  positionId?: string;
  positionLevelId?: string;
  departmentId?: string;
}

// ดึงรายชื่อพนักงานในกลุ่มพร้อมผลคะแนนประเมินและการจัดสรร
export async function getCompensationPersonnelList(
  reqId: string,
  groupsId: string,
  body: GetCompensationPersonnelParams,
): Promise<any> {
  return api<any>(
    "POST",
    `/payroll/increment/list/${reqId}/${groupsId}`,
    body,
    {
      plugin: "py",
    },
  );
}

export interface SaveCompensationItem {
  id: string;
  allocPercent: number | null;
  allocAmount: number | null;
  allocQuotaPercent: number | null;
  evaluationScore: number | null;
  evaluationResult: string | null;
}

export interface SaveCompensationPayload {
  items: SaveCompensationItem[];
}

// บันทึกข้อมูลแถวการคำนวณโดยใช้ groupsId ใน URL path
export async function saveCompensationGroupItems(
  groupsId: string,
  payload: SaveCompensationPayload,
): Promise<void> {
  return api("POST", `/payroll/increment/groups/${groupsId}/save`, payload, {
    plugin: "py",
  });
}

// กดปุ่ม พิจารณาเสร็จสิ้น
export async function updateStatusConsider(groupsId: string): Promise<void> {
  return api(
    "POST",
    `/payroll/increment/groups/${groupsId}/submit`,
    undefined,
    {
      plugin: "py",
    },
  );
}
