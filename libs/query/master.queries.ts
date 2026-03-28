import type { ApiError, MasterSelectProps } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { getMasterMasTitleList, getPositionLevelList, getPositionList, getPositionTypeList } from "../api/master.api";

/**
 * Query keys for master-related queries
 * Following TanStack Query best practices for key management
 */
export const masterKeys = {
  all: ["master"] as const,
  titles: (params?: { lang?: string }) =>
    [...masterKeys.all, "titles", params] as const,
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

export function usePositionTypeList(params?: { lang?: string }) {
  //   return useQuery<MasterSelectProps[], ApiError>({
  return useQuery<any[], ApiError>({
    queryKey:["position-type-list"],
    queryFn: async () => {
      const response = await getPositionTypeList(params);
      return Array.isArray(response) ? response : [];
    },
  });
}

export function usePositionLevelList(params?: { lang?: string }) {
  //   return useQuery<MasterSelectProps[], ApiError>({
  return useQuery<any[], ApiError>({
    queryKey: ["position-level-list"],
    queryFn: async () => {
      const response = await getPositionLevelList(params);
      return Array.isArray(response) ? response : [];
    },
  });
}


export function usePositionList(params?: { lang?: string }) {
  //   return useQuery<MasterSelectProps[], ApiError>({
  return useQuery<any[], ApiError>({
    queryKey: ["positions-list"],
    queryFn: async () => {
      const response = await getPositionList(params);
      return Array.isArray(response) ? response : [];
    },
  });
}
