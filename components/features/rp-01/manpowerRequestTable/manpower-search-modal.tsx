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

interface ManpowerSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSearch: (formData: any) => void;
}

export function SearchManpowerModal({
  open,
  onClose,
  onSearch,
}: ManpowerSearchModalProps) {
  const c = useTranslations("common");
  const m = useTranslations("manpower");

  const { control, handleSubmit, reset } = useForm<any>({});

  useEffect(() => {
    if (open) {
      reset({
        requestNumber: "",
        dateOfRequest: "",
        agency: "",
        positionOfRequest: "",
        status: "",
        responsiblePerson: "",
      });
    }
  }, [open, reset]);

  const onClear = () => {
    reset({
      requestNumber: "",
      dateOfRequest: "",
      agency: "",
      positionOfRequest: "",
      status: "",
      responsiblePerson: "",
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
            name="requestNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={m("field.request-number")}
                // label="เลขที่คำขอ"
                floatingLabel
              />
            )}
          />

          <Controller
            name="dateOfRequest"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label={m("field.date-of-request")}
                // label="วันที่ขอ"
                floatingLabel
              />
            )}
          />

          <Controller
            name="agency"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={m("field.agency")}
                // label="หน่วยงาน"
                floatingLabel
              />
            )}
          />

          <Controller
            name="positionOfRequest"
            control={control}
            render={({ field }) => (
              <Combobox
                // options={positionOfRequestOptions}
                options={[
                  {
                    label: "นักวิชาการคลัง",
                    value: "นักวิชาการคลัง",
                  },
                  {
                    label: "เศรษฐกร",
                    value: "เศรษฐกร",
                  },
                ]}
                value={field.value}
                valueType="string"
                onChange={(value) => {
                  field.onChange(value);
                }}
                label={m("field.position-of-request")}
                // label="ตำแหน่งที่ร้องขอ"
                floatingLabel
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Combobox
                // options={statusOptions}
                options={[
                  {
                    label: "รอตรวจสอบ",
                    value: "รอตรวจสอบ",
                  },
                  {
                    label: "อนุมัติ",
                    value: "อนุมัติ",
                  },
                ]}
                value={field.value}
                valueType="string"
                onChange={(value) => {
                  field.onChange(value);
                }}
                label={m("field.status")}
                // label="สถานะ"
                floatingLabel
              />
            )}
          />

          <Controller
            name="responsiblePerson"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={m("field.responsible-person")}
                // label="ผู้รับผิดชอบ"
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
    </Modal>
  );
}
