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
  const cl = useTranslations("compensation");

  const getInitialValues = () => {
    if (typeof window === "undefined") return {};

    const savedState = sessionStorage.getItem("compensation-table-state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return {
          createdAt: parsed.createdAt
            ? new Date(Number(parsed.createdAt))
            : null,
          name: parsed.name || "",
          status: parsed.status || "",
          approvedBy: parsed.approvedBy || "",
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      createdAt: null,
      name: "",
      status: "",
      approvedBy: "",
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
        createdAt: parsed.createdAt || "",
        name: parsed.name || "",
        status: parsed.status || "",
        approvedBy: parsed.approvedBy || "",
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
          name="createdAt"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              // label="วันที่สร้าง"
              label={cl("field.created-date")}
              floatingLabel
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              // label="ชื่อรายการ"
              label={cl("field.item-name")}
              floatingLabel
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Combobox
              // options={statasData}
              options={[
                {
                  label: "ฉบับร่าง",
                  value: "draft",
                },
                {
                  label: "อยู่ระหว่างการพิจารณา",
                  value: "reviewing",
                },
                {
                  label: "นำส่งเอกสาร",
                  value: "submitted",
                },
                {
                  label: "เสร็จสิ้น",
                  value: "success",
                },
              ]}
              value={field.value}
              valueType="string"
              onChange={(value) => {
                field.onChange(value);
              }}
              // label="สถานะ"
              label={cl("field.status")}
              floatingLabel
            />
          )}
        />

        <Controller
          name="approvedBy"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              // label="ผู้อนุมัติ / ตรวจสอบ"
              label={cl("field.approver-reviewer")}
              floatingLabel
            />
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
