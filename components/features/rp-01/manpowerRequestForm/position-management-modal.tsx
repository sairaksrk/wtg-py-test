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
import {
  usePositionLevelList,
  usePositionList,
  usePositionTypeList,
} from "@/libs/query/master.queries";
import { useLoadingStore } from "@/stores/loading-store";
import {
  CreatePositionItemDto,
  UpdatePositionItemDto,
  // MANPOWER_SESSION_KEY,
} from "@/types/manpower";
import { formatApiError } from "@/types/api";
import {
  useAddPositionItem,
  useCreatePositionItem,
  useGetPositionItemById,
  useUpdatePositionItem,
} from "@/libs/query/manpower.queries";
import { useRouter } from "@/i18n/navigation";

const positionFormSchema = z.object({
  positionTypeId: z.string().min(1),
  positionLevelId: z.string().min(1),
  positionId: z.string().min(1),
  amount: z.string().min(1),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface PositionManageModalProps {
  open: boolean;
  editingId: string | null;
  reqId: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function PositionManagementModal({
  open,
  editingId,
  reqId,
  onClose,
  onSave,
}: PositionManageModalProps) {
  const router = useRouter();
  const c = useTranslations("common");
  const m = useTranslations("manpower");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      positionTypeId: "",
      positionLevelId: "",
      positionId: "",
      amount: "",
    },
  });

  const { data: positionItemData, isLoading: isLoadingPositionItem } =
    useGetPositionItemById(reqId!, editingId!);
  const { data: positionTypeData, isLoading: isLoadingPositionType } =
    usePositionTypeList();
  const { data: positionLevelData, isLoading: isLoadingPositionLevel } =
    usePositionLevelList();
  const { data: positionData, isLoading: isLoadingPosition } =
    usePositionList();

  const createMutation = useCreatePositionItem();
  const addMutation = useAddPositionItem();
  const updateMutation = useUpdatePositionItem();

  const positionTypeOptions = useMemo(
    () =>
      positionTypeData?.map((item) => ({
        value: item.id,
        label: item.nameTh,
      })) || [],
    [positionTypeData],
  );
  const positionLevelOptions = useMemo(
    () =>
      positionLevelData?.map((item) => ({
        value: item.id,
        label: item.nameTh,
      })) || [],
    [positionLevelData],
  );
  const positionOptions = useMemo(
    () =>
      positionData?.map((item) => ({ value: item.id, label: item.nameTh })) ||
      [],
    [positionData],
  );

  useEffect(() => {
    // กรณี Edit
    if (editingId && positionItemData) {
      reset({
        positionTypeId: positionItemData.positionTypeId,
        positionLevelId: positionItemData.positionLevelId,
        positionId: positionItemData.positionId,
        amount: String(positionItemData.amount),
      });
      return;
    }

    // กรณี Create (ไม่มี editingId)
    if (!editingId) {
      reset({
        positionTypeId: "",
        positionLevelId: "",
        positionId: "",
        amount: "",
      });
    }
  }, [open, editingId, positionItemData, reset]);

  const onSubmit = async (formData: PositionFormValues) => {
    updateLoading(true);
    try {
      if (editingId && reqId) {
        // กรณีมี editingId และ reqId แล้ว (เป็นการแก้ไข item เดิม)
        const payloadUpdate: UpdatePositionItemDto = {
          positionTypeId: formData.positionTypeId,
          positionLevelId: formData.positionLevelId,
          positionId: formData.positionId,
          amount: Number(formData.amount),
        };

        await updateMutation.mutateAsync({
          itemId: editingId,
          data: payloadUpdate,
          reqId: reqId,
        });
        toastSuccess(c("successfully"), c("successfully-description"));
        onSave();
      } else if (!editingId && reqId) {
        // กรณีมี reqId แล้ว (เป็นการเพิ่ม Item เข้าไปใน Request เดิม)
        const payloadAdd: UpdatePositionItemDto = {
          positionTypeId: formData.positionTypeId,
          positionLevelId: formData.positionLevelId,
          positionId: formData.positionId,
          amount: Number(formData.amount),
        };
        await addMutation.mutateAsync({ id: reqId, data: payloadAdd });
      } else {
        // กรณีเป็นรายการแรก (สร้าง Request ใหม่)
        const payloadCreate: CreatePositionItemDto = {
          items: [
            {
              positionTypeId: formData.positionTypeId,
              positionLevelId: formData.positionLevelId,
              positionId: formData.positionId,
              amount: Number(formData.amount),
            },
          ],
        };

        const res = await createMutation.mutateAsync(payloadCreate);
        const newId = res.id;
        // sessionStorage.removeItem(MANPOWER_SESSION_KEY);
        router.push(`/create-request/add-request-information/${newId}`);
      }
      toastSuccess(c("successfully"), c("successfully-description"));
      onSave();
    } catch (error) {
      const { title, description } = formatApiError(error, c("error-occur"));
      toastError(title, description || c("error-detail"));
    } finally {
      updateLoading(false);
    }
  };

  const isLoading =
    isLoadingPositionType ||
    isLoadingPositionLevel ||
    isLoadingPosition ||
    (editingId ? isLoadingPositionItem : false);

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
              name="positionTypeId"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={positionTypeOptions}
                  value={field.value}
                  valueType="string"
                  onChange={field.onChange}
                  label={m("field.position-type")}
                  floatingLabel
                  error={errors.positionTypeId?.message}
                  required
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
                  label={m("field.position-level")}
                  floatingLabel
                  error={errors.positionLevelId?.message}
                  required
                />
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
                  onChange={field.onChange}
                  label={m("field.position")}
                  floatingLabel
                  error={errors.positionId?.message}
                  required
                />
              )}
            />

            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={m("field.amount")}
                  floatingLabel
                  required
                  error={errors.amount?.message}
                  thousandSeparator={true}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || addMutation.isPending}
            >
              บันทึก
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
