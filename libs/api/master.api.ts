import { MasterSelectProps } from "@/types/api";
import { api } from "./api";
import { MasterPermissionProps } from "@/types/compensation";

// const BASE = "/py";

// ประเภทและระดับตำแหน่ง PY

export async function getPositionTypeLevelList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>(
    "GET",
    `/payroll/master/position-levels`,
    undefined,
    {
      plugin: "plugin",
      params,
    },
  );
}

// หน่วยงาน PY

export async function getStructureUnitList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>("GET", `/payroll/master/units`, undefined, {
    plugin: "plugin",
    params,
  });
}

// ผู้พิจารณา PY

export async function getReviewerList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>(
    "GET",
    `/master-data/reviewers/options`,
    undefined,
    {
      plugin: "plugin",
      params,
    },
  );
}

// Permissions

export async function getPermission(params?: {
  lang?: string;
}): Promise<MasterPermissionProps> {
  return api<MasterPermissionProps>(
    "GET",
    `/master-data/permissions`,
    undefined,
    {
      plugin: "plugin",
      params,
    },
  );
}
