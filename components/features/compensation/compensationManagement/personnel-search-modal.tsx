"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/combobox";
import { DatePicker } from "@/components/common/date-picker";

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

  // const { data: positionData, isLoading } = usePositionList();

  // const positionOptions = useMemo(
  //   () =>
  //     positionData?.map((item) => ({ value: item.id, label: item.nameTh })) ||
  //     [],
  //   [positionData],
  // );

  // const positionLevelOptions = useMemo(
  //   () =>
  //     positionLevelData?.map((item) => ({
  //       value: item.id,
  //       label: item.nameTh,
  //     })) || [],
  //   [positionLevelData],
  // );

  const positionLevelOptions: any[] = [
    {
      value: "e35fb9f4-adb5-48c7-94e0-569899676747",
      label: "สูง",
    },
    {
      value: "0ccf7114-deaa-4396-93bc-a5e24a761e50",
      label: "ต้น",
    },
    {
      value: "24466844-7f70-4b68-88ea-99edbe6c6f8c",
      label: "ทรงคุณวุฒิ",
    },
    {
      value: "b0fd8a6e-bc4e-4741-b259-83358220ed86",
      label: "เชี่ยวชาญ",
    },
    {
      value: "297abe58-09bd-49bb-b761-3504816bef39",
      label: "ชำนาญการพิเศษ",
    },
    {
      value: "38e495a6-8539-4ccd-a53d-7eacb7a92a65",
      label: "ชำนาญการ",
    },
    {
      value: "7dc148b6-5d5a-4b7f-afb5-b126516fb869",
      label: "ปฏิบัติการ",
    },
  ];

  const positionOptions: any[] = [
    {
      value: "24466844-7f70-4b68-88ea-99edbe6c6f8c",
      label: "ผู้อำนวยการ",
    },
    {
      value: "b0fd8a6e-bc4e-4741-b259-83358220ed86",
      label: "ที่ปรึกษาด้านหนี้สาธารณะ",
    },
    {
      value: "297abe58-09bd-49bb-b761-3504816bef39",
      label: "รองผู้อำนวยการ",
    },
    {
      value: "a4534d86-fd35-45e6-81a4-2fe0e5b41b64",
      label: "ผู้เชี่ยวชาญเฉพาะด้านหนี้สาธารณะและเงินคงคลัง",
    },
    {
      value: "a6b85067-0e8b-4a62-b8cb-2296d4b9dc8f",
      label: "เลขานุการกรม",
    },
    {
      value: "e1230d8d-bedb-442c-845a-2c87d05de771",
      label: "ผู้อำนวยการสำนัก",
    },
  ];

  const departmentOptions = [
    {
      value: "166fd094-67eb-432e-b7eb-ad05eb2b80bf",
      label: "ส่วนกลาง",
      level: 1,
      parentStructureUnits: [],
    },
    {
      value: "ed3df761-4e55-453b-a990-f6902caa4365",
      label: "สำนักงานเลขานุการกรม",
      level: 1,
      parentStructureUnits: [],
    },
    {
      value: "4d930d57-a2c8-4b43-9ff4-d80ae9518152",
      label: "ฝ่ายคลังและพัสดุ",
      level: 2,
      parentStructureUnits: [
        {
          value: "ed3df761-4e55-453b-a990-f6902caa4365",
          label: "สำนักงานเลขานุการกรม",
          level: 1,
        },
      ],
    },
    {
      value: "debf9750-acce-48bc-afd6-d08bde87c724",
      label: "หน่วยสนับสนุน",
      level: 4,
      parentStructureUnits: [
        {
          value: "ed3df761-4e55-453b-a990-f6902caa4365",
          label: "สำนักงานเลขานุการกรม",
          level: 1,
        },
        {
          value: "4d930d57-a2c8-4b43-9ff4-d80ae9518152",
          label: "ฝ่ายคลังและพัสดุ",
          level: 2,
        },
        {
          value: "38e495a6-8539-4ccd-a53d-7eacb7a92a65",
          label: "กลุ่มจัดการ 2",
          level: 3,
        },
      ],
    },
  ];

  const getInitialValues = () => {
    if (typeof window === "undefined") return {};

    const savedState = sessionStorage.getItem(
      "compensation-request-table-state",
    );
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          requestNo: parsed.requestNo || "",
          name: parsed.name || "",
          startDate: parsed.startDate
            ? new Date(Number(parsed.startDate))
            : null,
          positionId: parsed.positionId || "",
          positionLevelId: parsed.positionLevelId || "",
          departmentId: parsed.departmentId || "",
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      requestNo: "",
      name: "",
      startDate: null,
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    };
  };

  const { control, handleSubmit, reset } = useForm<any>({
    defaultValues: getInitialValues(),
  });

  useEffect(() => {
    const savedState = sessionStorage.getItem("manpower-request-table-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      reset({
        requestNo: parsed.requestNo || "",
        name: parsed.name || "",
        startDate: parsed.startDate || "",
        positionId: parsed.positionId || "",
        positionLevelId: parsed.positionLevelId || "",
        departmentId: parsed.departmentId || "",
      });
    }
  }, [reset]);

  const onClear = () => {
    // reset({
    // requestNo: "",
    // name: "",
    // startDate: null
    // positionId: "",
    // positionLevelId: "",
    // departmentId: "",
    // });
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
          name="requestNo"
          control={control}
          render={({ field }) => (
            <Input {...field} label="เลขที่ตำแหน่ง" floatingLabel />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} label="ชื่อ-นามสกุล" floatingLabel />
            // <Combobox
            //   options={[]}
            //   value={field.value}
            //   valueType="string"
            //   onChange={(value) => {
            //     field.onChange(value);
            //   }}
            //   label="ผู้รับผิดชอบ"
            //   floatingLabel
            // />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="วันที่สร้าง" floatingLabel />
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
              required
            />
          )}
        />

        <Controller
          name="departmentId"
          control={control}
          render={({ field }) => (
            <Combobox
              options={departmentOptions}
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
