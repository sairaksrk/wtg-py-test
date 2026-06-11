"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/combobox";
import {
  useGetStructureUnitList,
  usePositionTypeLevelList,
} from "@/libs/query/master.queries";

interface ManpowerSearchModalProps {
  onClose: () => void;
  onSearch: (formData: any) => void;
  onClearFilters: () => void;
}

export function PersonnelSearchModal({
  onClose,
  onSearch,
  onClearFilters,
}: ManpowerSearchModalProps) {
  const c = useTranslations("common");

  const { data: positionTypeLevelData } = usePositionTypeLevelList();
  const { data: structureUnitData } = useGetStructureUnitList();

  // ตำแหน่งในสายงาน -> label
  const positionOptions = useMemo(() => {
    if (!positionTypeLevelData) return [];
    return positionTypeLevelData.map((item) => ({
      value: item.value,
      label: item.label,
    }));
  }, [positionTypeLevelData]);

  // ระดับตำแหน่ง -> positionTypeName
  const positionLevelOptions = useMemo(() => {
    if (!positionTypeLevelData) return [];
    return positionTypeLevelData.map((item) => ({
      value: item.value,
      label: item.positionTypeName,
    }));
  }, [positionTypeLevelData]);

  const getInitialValues = () => {
    if (typeof window === "undefined") return {};

    const savedState = sessionStorage.getItem(
      "compensation-request-table-state",
    );
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          positionNumber: parsed.positionNumber || "",
          employeeName: parsed.employeeName || "",
          positionId: parsed.positionId || "",
          positionLevelId: parsed.positionLevelId || "",
          departmentId: parsed.departmentId || "",
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      positionNumber: "",
      employeeName: "",
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    };
  };

  const { control, handleSubmit, reset } = useForm<any>({
    defaultValues: getInitialValues(),
  });

  useEffect(() => {
    const savedState = sessionStorage.getItem(
      "compensation-request-table-state",
    );
    if (savedState) {
      const parsed = JSON.parse(savedState);
      reset({
        positionNumber: parsed.positionNumber || "",
        employeeName: parsed.employeeName || "",
        positionId: parsed.positionId || "",
        positionLevelId: parsed.positionLevelId || "",
        departmentId: parsed.departmentId || "",
      });
    }
  }, [reset]);

  const onClear = () => {
    onClearFilters();
  };

  const onSubmit = async (formData: any) => {
    onSearch(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Controller
          name="positionNumber"
          control={control}
          render={({ field }) => (
            <Input {...field} label="เลขที่ตำแหน่ง" floatingLabel />
          )}
        />

        <Controller
          name="employeeName"
          control={control}
          render={({ field }) => (
            <Input {...field} label="ชื่อ-นามสกุล" floatingLabel />
          )}
        />

        <Controller
          name="positionId"
          control={control}
          render={({ field }) => (
            <Combobox
              options={positionOptions}
              value={field.value}
              valueType="string"
              onChange={(value) => {
                field.onChange(value);
              }}
              label="ตำแหน่งในสายงาน"
              floatingLabel
            />
          )}
        />
        <Controller
          name="positionLevelId"
          control={control}
          render={({ field }) => (
            <Combobox
              options={positionLevelOptions}
              value={field.value}
              valueType="string"
              onChange={field.onChange}
              label="ระดับตำแหน่ง"
              floatingLabel
            />
          )}
        />

        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Combobox
              options={structureUnitData || []}
              value={field.value}
              valueType="string"
              onChange={(value) => {
                field.onChange(value);
              }}
              label="สังกัดหน่วยงาน"
              floatingLabel
            />
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="secondary" type="button" onClick={onClear}>
          {c("clear")}
        </Button>
        <Button variant="default" type="submit">
          <Icon icon="solar:magnifer-linear" />
          {c("search-data")}
        </Button>
      </div>
    </form>
  );
}
