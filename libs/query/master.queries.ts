import type { ApiError, MasterSelectProps } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  getPositionTypeLevelList,
  getReviewerList,
  getStructureUnitList,
} from "../api/master.api";

/**
 * Query keys for master-related queries
 * Following TanStack Query best practices for key management
 */

export const masterKeys = {
  all: ["master"] as const,
  agencies: () => [...masterKeys.all, "agencies"] as const,
  positionTypeLevels: () =>
    [...masterKeys.all, "position-type-levels"] as const,
  reviewer: () => [...masterKeys.all, "reviewer"] as const,
};

// ประเภทและระดับตำแหน่ง PY

export function usePositionTypeLevelList() {
  return useQuery<any[], ApiError>({
    queryKey: masterKeys.positionTypeLevels(),
    queryFn: async () => {
      const response = await getPositionTypeLevelList();
      return Array.isArray(response) ? response : [];
    },
  });
}

// หน่วยงาน PY

export function useGetStructureUnitList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.agencies(),
    queryFn: async () => {
      const response = await getStructureUnitList();
      return Array.isArray(response) ? response : [];
    },
  });
}

// ผู้พิจารณา PY

export function useGetReviewerList() {
  return useQuery<MasterSelectProps[], ApiError>({
    queryKey: masterKeys.reviewer(),
    queryFn: async () => {
      const response = await getReviewerList();
      return Array.isArray(response) ? response : [];
    },
  });
}
