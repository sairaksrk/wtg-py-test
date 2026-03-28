import { api } from "./api";

export interface SystemListResponseDto {
  id: string;
  name: string;
  modules: ModuleResponseDto[];
}

export interface ModuleResponseDto {
  id: string;
  parentId: string;
  name: string;
  modules: ModuleResponseDto[];
}

export async function getSystemList(): Promise<SystemListResponseDto[]> {
  return api<SystemListResponseDto[]>("GET", "/system/modules");
}
