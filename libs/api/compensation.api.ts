// "use server"

import type { PaginatedResponse } from "@/types/api";
import type {
  ManpowerRequestList,
  CompensationListParams,
  CompensationList,
  CreateCompensationItem,
} from "@/types/compensation";
import { api } from "./api";

/**
 * RP-01 Get paginated list
 */
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

export async function createCompensationItem(
  payload: CreateCompensationItem,
): Promise<{ id: string }> {
  return api("POST", `/payroll/increment/rounds`, payload, {
    plugin: "py",
  });
}

export async function getCompensationRequestById(reqId: string): Promise<any> {
  return api<any>(
    "GET",
    `/payroll/master/increment-groups/${reqId}`,
    undefined,
    {
      plugin: "py",
    },
  );
}
