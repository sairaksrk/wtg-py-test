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

import { formatApiError } from "@/types/api";
import {
  useAddPositionItem,
  useCreatePositionItem,
  useGetPositionItemById,
  useUpdatePositionItem,
} from "@/libs/query/manpower.queries";
import { useRouter } from "@/i18n/navigation";

const positionFormSchema = z.object({
  itemName: z.string().min(1),
  test1: z.string().min(1),
  test2: z.string(),
  test3: z.string(),
  test4: z.string(),
});

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface PositionManageModalProps {
  open: boolean;
  reqId?: string | null;
  editingId?: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function CreditManagementModal({
  open,
  reqId,
  editingId,
  onClose,
  onSave,
}: PositionManageModalProps) {
  const router = useRouter();
  const c = useTranslations("common");
  // const updateLoading = useLoadingStore((state) => state.updateLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      itemName: "",
      test1: "",
      test2: "",
      test3: "",
      test4: "",
    },
  });

  // const { data: positionItemData, isLoading: isLoadingPositionItem } =
  //   useGetPositionItemById(editingId!);
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
    // if (editingId && positionItemData) {
    //   reset({
    // itemName :  positionItemData.itemName
    //     reason: positionItemData.reason,
    //   });
    //   return;
    // }

    // กรณี Create (ไม่มี editingId)
    if (!editingId) {
      reset({
        itemName: "",
        test1: "",
        test2: "",
        test3: "",
        test4: "",
      });
    }
  }, [
    open,
    editingId,
    // positionItemData,
    reset,
  ]);

  const onSubmit = async (formData: PositionFormValues) => {
    const reqId = "5ea31ed3-bff6-4f61-aa34-25144cda2270";
    toastSuccess(c("successfully"), c("successfully-description"));
    router.push(`/manage-compensation/item-request/${reqId}`);
  };

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
            {/* <p className="text-base font-medium">ข้อมูลรายละเอียดคำขอ</p> */}

            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ชื่อกลุ่ม"
                  floatingLabel
                  required
                  error={errors.itemName?.message}
                />
              )}
            />

            <Controller
              name="test1"
              control={control}
              render={({ field }) => (
                <Combobox
                  // options={test1Options}
                  options={[
                    {
                      label: "วิชาการ ชำนาญการพิเศษ",
                      value: "วิชาการ ชำนาญการพิเศษ",
                    },
                    {
                      label: "วิชาการ ปฏิบัติการ",
                      value: "วิชาการ ปฏิบัติการ",
                    },
                  ]}
                  value={field.value}
                  valueType="string"
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="ประเภทและระดับตำแหน่ง"
                  floatingLabel
                  required
                  error={errors.test1?.message}
                />
              )}
            />

            <p className="text-base font-medium">จัดสรรค่าตอบแทน</p>

            <Controller
              name="test2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ผู้อำนวยการสำนักบริหารหนี้สิน"
                  floatingLabel
                  // required
                  error={errors.test2?.message}
                  thousandSeparator
                  // icon={}
                />
              )}
            />

            <Controller
              name="test3"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="รองผู้อำนวยการ"
                  floatingLabel
                  // required
                  error={errors.test3?.message}
                  thousandSeparator
                  // icon={}
                />
              )}
            />
            <Controller
              name="test4"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ผู้อำนวยการสำนัก"
                  floatingLabel
                  // required
                  error={errors.test4?.message}
                  thousandSeparator
                  // icon={}
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
