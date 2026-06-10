// "use server"

import type { PaginatedResponse } from "@/types/api";
import type {
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
  CompensationRequestData,
  // GroupItem,
  CreateCreditLimit,
  GetCompensationPersonnelParams,
  SaveCompensationPayload,
  UpdateCompensationItem,
  CompensationItem,
} from "@/types/compensation";
import { api } from "./api";

// หน้า 1 จัดการค่าตอบแทน - ดึงข้อมูล จัดการค่าตอบแทน Get All

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

// หน้า 1 จัดการค่าตอบแทน - เพิ่ม รายการค่าตอบแทน

export async function createCompensationItem(
  payload: CreateCompensationItem,
): Promise<{ id: string }> {
  return api("POST", `/payroll/increment/rounds`, payload, {
    plugin: "py",
  });
}

// หน้า 1 จัดการค่าตอบแทน - ลบ รายการค่าตอบแทน && หน้า 2 ปุ่มลบรายการ

export async function deleteCompensationItem(
  id: string,
): Promise<{ id: string }> {
  return api("DELETE", `/payroll/increment/rounds/${id}`, undefined, {
    plugin: "py",
  });
}

// หน้า 2 - Modal แก้ไข รายการค่าตอบแทน (รอทำ)

export async function updateCompensationItem(
  id: string,
  payload: UpdateCompensationItem,
): Promise<void> {
  return api<void>("PUT", `/payroll/increment/rounds/${id}`, payload, {
    plugin: "py",
  });
}

// หน้า 2 - Modal ดึงข้อมูล รายการค่าตอบแทน Get ById (รอทำ)

export async function getCompensationItemById(
  reqId: string,
): Promise<CompensationItem> {
  return api<CompensationItem>(
    "GET",
    `/payroll/increment/rounds/${reqId}`,
    undefined,
    {
      plugin: "py",
    },
  );
}

// หน้า 2 - ดึงข้อมูล หน้าจัดการรายการบริหารวงเงิน Get ById

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

// หน้า 2 - ดึง รายการกลุ่มที่สร้างไว้แล้ว (checkbox)

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

// หน้า 2 - Modal เพิ่ม รายการบริหารวงเงิน

export async function createCreditLimitList(
  payload: CreateCreditLimit,
): Promise<{ payrollPeriodId: string }> {
  return api("POST", `/payroll/increment/groups`, payload, {
    plugin: "py",
  });
}

// หน้า 2 - ลบ รายการบริหารวงเงิน

export async function deleteCreditLimitList(id: string): Promise<void> {
  return api<void>("DELETE", `/payroll/increment/groups/${id}`, undefined, {
    plugin: "py",
  });
}

// หน้า 3 - ดึงข้อมูลรายละเอียดกลุ่มบริหารวงเงินตาม groupsId

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

// หน้า 2 - ปุ่ม บันทึกการนำส่ง Update Status นำส่งเอกสาร (รอทำ)

export async function updateSubmitDeliver(reqId: string): Promise<void> {
  return api("POST", `/payroll/increment/groups/${reqId}/submit`, undefined, {
    plugin: "py",
  });
}

// หน้า 2 - ปุ่ม เสร็จสิ้น Update Status เสร็จสิ้น (รอทำ)

export async function updateSubmitSuccess(reqId: string): Promise<void> {
  return api("POST", `/payroll/increment/groups/${reqId}/submit`, undefined, {
    plugin: "py",
  });
}

// หน้า 3 - ดึงรายชื่อพนักงานในกลุ่มพร้อมผลคะแนนประเมินและการจัดสรร

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

// หน้า 3 - บันทึกข้อมูลแถวการคำนวณโดยใช้ groupsId ใน URL path

export async function saveCompensationGroupItems(
  groupsId: string,
  payload: SaveCompensationPayload,
): Promise<void> {
  return api("POST", `/payroll/increment/groups/${groupsId}/save`, payload, {
    plugin: "py",
  });
}

// หน้า 3 - กดปุ่ม พิจารณาเสร็จสิ้น

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
