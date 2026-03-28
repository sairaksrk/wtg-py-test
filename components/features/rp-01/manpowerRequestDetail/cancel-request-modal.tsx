"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { toastSuccess } from "@/utils/toast";
import { useRouter } from "@/i18n/navigation";
import { TextArea } from "@/components/ui/textarea";

const positionFormSchema = z.object({
  reason: z.string().min(1),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface PositionManageModalProps {
  open: boolean;
  editingId: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function CancelRequestModal({
  open,
  editingId,
  onClose,
  onSave,
}: PositionManageModalProps) {
  const c = useTranslations("common");
  const router = useRouter();

  // const { data: demoData, isLoading: isLoadingDemo } = useDemo(editingId || "");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Mutations
  // const createMutation = useCreateDemo();
  // const updateMutation = useUpdateDemo();

  // const isSaving = createMutation.isPending || updateMutation.isPending;
  const isSaving = false;

  // Reset form when modal opens/closes or when demo data is loaded
  useEffect(() => {
    // if (open && editingId && demoData) {
    if (open && editingId) {
      reset({
        // reason: demoData.reason,
      });
    } else if (open && !editingId) {
      reset({
        reason: "",
      });
    } else {
      reset({
        reason: "",
      });
    }
    // }, [open, editingId, demoData, reset]);
  }, [open, editingId, reset]);

  // Save (create or update) - form submission handler
  const onSubmit = async (formData: PositionFormValues) => {
    console.log("Form Data to submit:", formData);

    toastSuccess(c("successfully"), c("successfully-description"));

    onSave();
    onClose();

    router.push(`/create-request`);

    // try {
    //   if (editingId) {
    //     await updateMutation.mutateAsync({
    //       id: editingId,
    //       data: formData,
    //     });
    //     alert.fire({
    //       type: "success",
    //       title: c("demo.success.updated-title"),
    //       description: c("demo.success.updated-desc", {
    //         name: formData.nameTh,
    //       }),
    //     });
    //   } else {
    //     await createMutation.mutateAsync(formData);
    //     alert.fire({
    //       type: "success",
    //       title: c("demo.success.created-title"),
    //       description: c("demo.success.created-desc", {
    //         name: formData.nameTh,
    //       }),
    //     });
    //   }
    //   onSave();
    //   onClose();
    // } catch (error: any) {
    //   alert.fire({
    //     type: "error",
    //     title: error?.error ?? c("demo.error.title"),
    //     description:
    //       error?.hint?.join("<br/>") ??
    //       error?.message ??
    //       c("demo.error.save-failed"),
    //   });
    // }
  };

  // Show loading state while fetching demo data
  // const isLoading = editingId && isLoadingDemo;
  const isLoading = false;

  return (
    <Modal
      open={open}
      // header={c("demo.edit-item")}
      header="ยืนยันการยกเลิกรายการ"
      subHeader="กรอกและตรวจสอบข้อมูลให้ถูกต้องครบถ้วน"
      size="rp"
      onClose={onClose}
    >
      {isLoading ? (
        <div className="py-8">
          <Loading />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  className="h-40"
                  label="เหตุผลการยกเลิกรายการ"
                  disabled={isSaving}
                  floatingLabel
                  required
                  error={errors.reason?.message}
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
              {/* {c("demo.cancel")} */}
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSaving}>
              บันทึก
              {/* {isSaving
                ? c("demo.saving")
                : editingId
                  ? c("demo.update")
                  : c("demo.create")} */}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
