"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/combobox";
import { DatePicker } from "@/components/common/date-picker";

interface CompensationSearchModalProps {
  onClose: () => void;
  onSearch: (formData: any) => void;
  onClearFilters: () => void;
}

export function CompensationSearchModal({
  onClose,
  onSearch,
  onClearFilters,
}: CompensationSearchModalProps) {
  const c = useTranslations("common");

  const getInitialValues = () => {
    if (typeof window === "undefined") return {};

    const savedState = sessionStorage.getItem("compensation-table-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          startDate: parsed.startDate
            ? new Date(Number(parsed.startDate))
            : null,
          itemName: parsed.itemName || "",
          status: parsed.status || "",
          approver: parsed.approver || "",
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      startDate: null,
      itemName: "",
      status: "",
      approver: "",
    };
  };

  const { control, handleSubmit, reset } = useForm<any>({
    defaultValues: getInitialValues(),
  });

  useEffect(() => {
    const savedState = sessionStorage.getItem("compensation-table-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      reset({
        startDate: parsed.startDate || "",
        itemName: parsed.itemName || "",
        status: parsed.status || "",
        approver: parsed.approver || "",
      });
    }
  }, [reset]);

  const onClear = () => {
    onClearFilters();
    // reset({
    //   startDate: "",
    //   itemName: "",
    //   status: "",
    //   approver: "",
    // });
  };

  const onSubmit = async (formData: any) => {
    onSearch(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker {...field} label="วันที่สร้าง" floatingLabel />
          )}
        />

        <Controller
          name="itemName"
          control={control}
          render={({ field }) => (
            <Input {...field} label="ชื่อรายการ" floatingLabel />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Combobox
              // options={positionOfRequestOptions}
              options={[
                {
                  label: "ฉบับร่าง",
                  value: "ฉบับร่าง",
                },
                {
                  label: "รอพิจารณา",
                  value: "รอพิจารณา",
                },
                {
                  label: "อยู่ระหว่างดำเนินการ",
                  value: "อยู่ระหว่างดำเนินการ",
                },
                {
                  label: "เสร็จสิ้น",
                  value: "เสร็จสิ้น",
                },
              ]}
              value={field.value}
              valueType="string"
              onChange={(value) => {
                field.onChange(value);
              }}
              label="สถานะ"
              floatingLabel
            />
          )}
        />

        <Controller
          name="approver"
          control={control}
          render={({ field }) => (
            <Input {...field} label="ผู้อนุมัติ / ตรวจสอบ" floatingLabel />
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onClear}
          className="bg-[#F4F4F5] border-[#F4F4F5] text-black"
        >
          {c("clear")}
        </Button>
        <Button type="submit">
          <Icon icon="boxicons:search-big" />
          {c("search-data")}
        </Button>
      </div>
    </form>
  );
}
