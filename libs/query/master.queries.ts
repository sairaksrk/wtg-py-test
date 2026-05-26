import type { ApiError, MasterSelectProps } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  getAgencyList,
  getMasterMasTitleList,
  getPositionLevelList,
  getPositionList,
  getPositionTypeLevelList,
  getPositionTypeList,
} from "../api/master.api";

/**
 * Query keys for master-related queries
 * Following TanStack Query best practices for key management
 */

export const masterKeys = {
  all: ["master"] as const,
  titles: (params?: { lang?: string }) =>
    [...masterKeys.all, "titles", params] as const,
  positionTypes: () => [...masterKeys.all, "position-types"] as const,
  positionLevels: () => [...masterKeys.all, "position-levels"] as const,
  positions: () => [...masterKeys.all, "positions"] as const,
  agencies: () => [...masterKeys.all, "agencies"] as const,
  positionTypeLevels: () =>
    [...masterKeys.all, "position-type-levels"] as const,
};

/**
 * Hook to fetch master title list
 */
export function useMasterTitleList(params?: { lang?: string }) {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.titles(params),
    queryFn: async () => {
      const response = await getMasterMasTitleList(params);
      return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePositionTypeList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.positionTypes(),
    queryFn: async () => {
      const response = await getPositionTypeList();
      return Array.isArray(response) ? response : [];
    },
  });
}

export function usePositionLevelList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.positionLevels(),
    queryFn: async () => {
      const response = await getPositionLevelList();
      return Array.isArray(response) ? response : [];
    },
  });
}

export function usePositionList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.positions(),
    queryFn: async () => {
      const response = await getPositionList();
      return Array.isArray(response) ? response : [];
    },
  });
}

export function useAgencyList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.agencies(),
    queryFn: async () => {
      const response = await getAgencyList();
      return Array.isArray(response) ? response : [];
    },
  });
}

// ประเภทและระดับตำแหน่ง
export function usePositionTypeLevelList() {
  return useQuery<any[], ApiError>({
    queryKey: masterKeys.positionTypeLevels(),
    queryFn: async () => {
      const response = await getPositionTypeLevelList();
      return Array.isArray(response) ? response : [];
    },
  });
}
