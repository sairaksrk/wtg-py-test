"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/combobox";
import { DatePicker } from "@/components/common/date-picker";

interface RequestSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (formData: any) => void;
}

export function RequestSearchModal({
  open,
  onClose,
  onSearch,
}: RequestSearchModalProps) {
  const c = useTranslations("common");
  const { control, handleSubmit, reset } = useForm<any>({});

  useEffect(() => {
    if (open) {
      reset({
        createDate: "",
        itemName: "",
        status: "",
        approver: "",
      });
    }
  }, [open, reset]);

  const onClear = () => {
    reset({
      createDate: "",
      itemName: "",
      status: "",
      approver: "",
    });
  };

  const onSubmit = async (formData: any) => {
    console.log("Form Data to submit:", formData);

    onSearch(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      header={c("filter")}
      size="sm"
      onClose={onClose}
      hideBorder={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Controller
            name="createDate"
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
    </Modal>
  );
}
