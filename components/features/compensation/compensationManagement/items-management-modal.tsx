"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/common/combobox";
import { toastError, toastSuccess } from "@/utils/toast";
import { useLoadingStore } from "@/stores/loading-store";
import { formatApiError } from "@/types/api";
import {
  useAddPositionItem,
  useCreatePositionItem,
} from "@/libs/query/manpower.queries";
import { useRouter } from "@/i18n/navigation";
import { TextArea } from "@/components/ui/textarea";
import { CreateCompensationItem } from "@/types/compensation";
import { useCreateCompensationItem } from "@/libs/query/compensation.queries";

const positionFormSchema = z.object({
  name: z.string().min(1),
  remarks: z.string().min(0),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface PositionManageModalProps {
  open: boolean;
  editingId?: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function ItemsManagementModal({
  open,
  editingId,
  onClose,
  onSave,
}: PositionManageModalProps) {
  const router = useRouter();
  const c = useTranslations("common");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      name: "",
      remarks: "",
    },
  });

  const createMutation = useCreateCompensationItem();

  useEffect(() => {
    if (!editingId) {
      reset({
        name: "",
        remarks: "",
      });
    }
  }, [open, editingId, reset]);

  const onSubmit = async (formData: PositionFormValues) => {
    try {
      updateLoading(true);

      const payloadCreate: CreateCompensationItem = {
        name: formData.name,
        remarks: formData.remarks || "",
      };

      const res = await createMutation.mutateAsync(payloadCreate);
      toastSuccess(c("successfully"), c("successfully-description"));
      onSave();

      router.push(`/manage-compensation/item-request/${res.id}`);
    } catch (error) {
      const { title, description } = formatApiError(error, c("error-occur"));

      toastError(title, description || c("error-detail"));
    } finally {
      updateLoading(false);
    }
  };

  // const reqId = "5ea31ed3-bff6-4f61-aa34-25144cda2270";
  // toastSuccess(c("successfully"), c("successfully-description"));
  // router.push(`/manage-compensation/item-request/${reqId}`);

  // const isLoading =
  //   isLoadingPositionType ||
  //   isLoadingPositionLevel ||
  //   isLoadingPosition ||
  //   (editingId ? isLoadingPositionItem : false);

  const isLoading = false;

  return (
    <Modal
      open={open}
      header={"จัดการข้อมูล"}
      subHeader={"กรอกและตรวจสอบข้อมูลให้ถูกต้องครบถ้วน"}
      size="rp"
      onClose={onClose}
    >
      {isLoading ? (
        <div className="py-8">
          <Loading fullscreen={false} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <p className="text-base font-medium">ข้อมูลรายละเอียดคำขอ</p>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ชื่อรายการ"
                  floatingLabel
                  required
                  error={errors.name?.message}
                />
              )}
            />

            {/* เหตุผล */}
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="หมายเหตุ"
                  // disabled={isSaving}
                  floatingLabel
                  error={errors.remarks?.message}
                  className="h-36"
                />
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              บันทึก
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
