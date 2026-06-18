import { MasterSelectProps } from "@/types/api";
import { api } from "./api";

const BASE = "/py";

// ประเภทและระดับตำแหน่ง PY

export async function getPositionTypeLevelList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>(
    "GET",
    `${BASE}/payroll/master/position-levels`,
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
  return api<MasterSelectProps[]>("GET", `${BASE}/payroll/master/units`, undefined, {
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
    `${BASE}/master-data/reviewers/options`,
    undefined,
    {
      plugin: "plugin",
      params,
    },
  );
}