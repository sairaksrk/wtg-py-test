"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastError, toastSuccess } from "@/utils/toast";
import { useLoadingStore } from "@/stores/loading-store";
import { formatApiError } from "@/types/api";
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

  useEffect(() => {
    if (!editingId) {
      reset({
        name: "",
        remarks: "",
      });
    }
  }, [open, editingId, reset]);

  const createMutation = useCreateCompensationItem();
  // const updateMutation = useUpdateCompensationItem();

  const onSubmit = async (formData: PositionFormValues) => {
    try {
      updateLoading(true);
      let targetId = editingId;

      if (editingId) {
        // const payloadUpdate: any = {
        //   name: formData.name,
        //   remarks: formData.remarks || "",
        // };
        // await updateMutation.mutateAsync(payloadUpdate);
      } else {
        const payloadCreate: CreateCompensationItem = {
          name: formData.name,
          remarks: formData.remarks || "",
        };
        const res = await createMutation.mutateAsync(payloadCreate);
        targetId = res?.id;
      }

      toastSuccess(c("successfully"), c("successfully-description"));
      onSave();

      if (targetId) {
        router.push(`/manage-compensation/item-request/${targetId}`);
      }
    } catch (error) {
      const { title, description } = formatApiError(error, c("error-occur"));

      toastError(title, description || c("error-detail"));
    } finally {
      updateLoading(false);
    }
  };

  // const isSaving = createMutation.isPending || updateMutation.isPending;
  const isSaving = createMutation.isPending;
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
                  disabled={isSaving}
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
                  floatingLabel
                  className="h-36"
                  error={errors.remarks?.message}
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSaving}>
              บันทึก
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
