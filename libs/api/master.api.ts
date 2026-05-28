import { MasterSelectProps } from "@/types/api";
import { api } from "./api";

/**
 * Get a master list of mas_titles
 */

// ประเภทและระดับตำแหน่ง PY
export async function getPositionTypeLevelList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>(
    "GET",
    `/payroll/master/position-levels`,
    undefined,
    {
      plugin: "py",
      params,
    },
  );
}

// หน่วยงาน PY
export async function getStructureUnitList(params?: {
  lang?: string;
}): Promise<MasterSelectProps[]> {
  return api<MasterSelectProps[]>("GET", `/payroll/master/units`, undefined, {
    plugin: "py",
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
      plugin: "py",
      params,
    },
  );
}
