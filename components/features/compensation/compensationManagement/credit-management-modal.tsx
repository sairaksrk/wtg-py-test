"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/components/common/loading";
import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastError, toastSuccess } from "@/utils/toast";
import {
  useCreatePositionItem,
  useUpdatePositionItem,
} from "@/libs/query/manpower.queries";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@iconify/react";
import { ComboboxMulti } from "@/components/ui/combobox-multi";
import { usePositionTypeLevelList } from "@/libs/query/master.queries";
import { Combobox } from "@/components/common/combobox";
import { useAgencyList } from "@/libs/query/master.queries";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/utils/helpers";
// import { set } from "lodash";
import { Badge } from "@/components/ui/badge";

// const positionFormSchema = z.object({
//   itemName: z.string().min(1),
//   test1: z.string().min(1),
//   test2: z.string().min(1),
//   test5: z.array(z.string()).min(1),
//   departmentId: z.array(z.string()).min(1),
// });

const positionFormSchema = z
  .object({
    itemName: z.string().min(1),
    test1: z.string().min(1),
    test2: z.string().min(1),
    test5: z.array(z.string()).optional(),
    departmentId: z.array(z.string()).optional(),

    isGroupSelected: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // ถ้าไม่ได้เลือกจากกลุ่ม บังคับกรอก test5 และ departmentId
    if (!data.isGroupSelected) {
      if (!data.test5 || data.test5.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["test5"],
          message: "กรุณาณาระบุ",
        });
      }

      if (!data.departmentId || data.departmentId.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["departmentId"],
          message: "กรุณาณาระบุ",
        });
      }
    }
  });

type PositionFormValues = z.infer<typeof positionFormSchema>;

interface PositionManageModalProps {
  open: boolean;
  reqId?: string | null;
  editingId?: string | null;
  onClose: () => void;
  onSave: () => void;
  listGroupsData: any[];
}

export function CreditManagementModal({
  open,
  reqId,
  editingId,
  onClose,
  onSave,
  listGroupsData
}: PositionManageModalProps) {
  const router = useRouter();
  const c = useTranslations("common");
  // const updateLoading = useLoadingStore((state) => state.updateLoading);

  const [isGroupSelected, setIsGroupSelected] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionFormSchema),
    defaultValues: {
      itemName: "",
      test1: "",
      test2: "",
      test5: [],
      departmentId: [],
      isGroupSelected: false,
    },
  });

  const { data: agencyData, isLoading: isLoadingAgency } = useAgencyList();

  const { data: positionTypeLevelData, isLoading: isLoadingPositionTypeLevel } =
    usePositionTypeLevelList();

  const positionTypeData = useMemo(
    () =>
      positionTypeLevelData?.map((item) => ({
        value: item.id,
        label: item.typeNameTh + " " + item.levelNameTh,
      })) || [],
    [positionTypeLevelData],
  );

  const createMutation = useCreatePositionItem();
  const updateMutation = useUpdatePositionItem();

  useEffect(() => {
    if (!editingId) {
      reset({
        itemName: "",
        test1: "",
        test2: "",
        test5: [],
        departmentId: [],
        isGroupSelected: false,
      });
      setIsGroupSelected(false);
      // setSelectedIds([]);
      setSelectedIds(new Set());
    }
  }, [open, editingId, reset]);

  const onSubmit = async (formData: PositionFormValues) => {
    const payloadCreate: any = {
      itemName: formData.itemName,
      test1: formData.test1,
      test2: formData.test2,

      ...(isGroupSelected && {
        // requestIds: selectedIds,
        requestIds: Array.from(selectedIds),
      }),

      ...(!isGroupSelected && {
        test5: formData.test5,
        departmentId: formData.departmentId,
      }),
    };

    console.log(payloadCreate);

    const reqId = "5ea31ed3-bff6-4f61-aa34-25144cda2270";
    toastSuccess(c("successfully"), c("successfully-description"));
    // router.push(`/manage-compensation/item-request/${reqId}`);

    onSave();
  };

  const isSaving = false;
  const isLoading = false;

  // const isSaving = updateMutation.isPending;
  // const isLoading = isLoadingAgency || (reqId ? isLoadingManpower : false);

  // const mockupGroupData: any[] = [
  //   {
  //     id: "1",
  //     name: "กลุ่มตรวจสอบภายใน",
  //     user: "อาทิตย์ เฉลิมประเสริฐ",
  //   },
  //   {
  //     id: "2",
  //     name: "กลุ่มบริหารความเสี่ยงหนี้สาธารณะ 2",
  //     user: "วิสาข์ จิตราพรชัยวัฒน์",
  //   },
  // ];

  const handleGroupCheckboxChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const renderGroupItem = (group: any) => {
    const isSelected = selectedIds.has(group.id);

    return (
      <label
        key={group.id}
        className={cn(
          "relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-gray-50/50",
          isSelected
            ? "border-[#2563EB] bg-[#EFF6FF]"
            : "border-border bg-white",
        )}
      >
        <div className="flex flex-1 items-center gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked: boolean) => {
              handleGroupCheckboxChange(group.id, checked);
            }}
          />

          <span className="text-base font-medium text-[#18181B]">
            {group.name}
          </span>
        </div>

        <Badge
          className="flex items-center gap-2 text-sm font-normal bg-[#FFFFFF]"
          variant="outline"
        >
          <Icon
            icon="solar:check-circle-linear"
            className="h-3 w-3 text-[#16A34A]"
          />
          {group.user ?? "-"}
        </Badge>
      </label>
    );
  };

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
                  disabled={isSaving}
                />
              )}
            />

            <p className="text-base font-medium">จัดสรรค่าตอบแทน</p>
          </div>
          <div className="grid grid-cols-2 gap-6 border-b border-dashed pb-6 border-[#D4D4D8]">
            <Controller
              name="test1"
              control={control}
              render={({ field }) => (
                <Combobox
                  label="ผู้พิจารณา"
                  floatingLabel
                  required
                  error={errors.test1?.message}
                  // options={positionTypeOptions}
                  options={[
                    {
                      label: "อนันตญา สิริประภาชัย",
                      value: "อนันตญา สิริประภาชัย",
                    },
                    {
                      label: "สมชาย ปฏิบัติการ",
                      value: "สมชาย ปฏิบัติการ",
                    },
                  ]}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  valueType="string"
                  disabled={isSaving}
                />
              )}
            />

            <Controller
              name="test2"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="จัดสรรร้อยละ"
                  floatingLabel
                  required
                  error={errors.test2?.message}
                  thousandSeparator
                  iconPosition="right"
                  icon={
                    <Icon
                      icon="solar:sale-square-linear"
                      className="w-4 h-4 text-gray-500"
                    />
                  }
                  disabled={isSaving}
                />
              )}
            />
          </div>

          <span className="flex cursor-pointer items-start gap-2 py-2">
            <Checkbox
              checked={isGroupSelected}
              onCheckedChange={(checked) => {
                const value = !!checked;
                setIsGroupSelected(value);
                setValue("isGroupSelected", value);
              }}
            />
            <span className="text-[#18181B] text-base">
              เลือกจากกลุ่มที่สร้างไว้
            </span>
          </span>

          {!isGroupSelected ? (
            <div className="grid grid-cols-1 gap-6">
              <Controller
                name="test5"
                control={control}
                render={({ field }) => (
                  <ComboboxMulti
                    label="ประเภทและระดับตำแหน่ง"
                    floatingLabel
                    error={errors.test5?.message}
                    options={positionTypeData}
                    value={field.value || []}
                    onChange={(v) => field.onChange(v)}
                    valueType="string"
                    disabled={isSaving}
                    required={!isGroupSelected}
                  />
                )}
              />

              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <ComboboxMulti
                    options={[
                      {
                        label: "กองจัดการหนี้ 1",
                        value: "กองจัดการหนี้ 1",
                      },
                      {
                        label: "กองจัดการหนี้ 2",
                        value: "กองจัดการหนี้ 2",
                      },
                    ]}
                    value={field.value || []}
                    valueType="string"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    label="เลือกหน่วยงาน"
                    floatingLabel
                    error={errors.departmentId?.message}
                    disabled={isSaving}
                    required={!isGroupSelected}
                  />
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <p className="text-base font-medium">
                รายการกลุ่มที่สร้างไว้แล้ว
              </p>

              {listGroupsData?.length > 0 ? (
                <div className="space-y-3">
                  {listGroupsData.map((group) => renderGroupItem(group))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-4">
                  <div className="relative h-24 w-24">
                    <Image
                      src="/no-data.png"
                      alt="Profile Image"
                      className="rounded-full object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                      fill
                    />
                  </div>

                  <h1 className="text-sm font-light text-subdude">
                    ยังไม่มีข้อมูล
                  </h1>
                </div>
              )}
            </div>
          )}

          <div
            className={cn(
              "flex items-center",
              isGroupSelected ? "justify-between" : "justify-end",
            )}
          >
            {isGroupSelected && (
              <span className="text-sm text-primary font-medium">
                {/* เลือกแล้ว {selectedIds.length} รายการ */}
                เลือกแล้ว {selectedIds.size} รายการ
              </span>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="bg-secondary border-none font-normal"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                // disabled={
                //   (isGroupSelected && selectedIds.length === 0) ||
                //   createMutation.isPending
                //     ? true
                //     : false
                // }
                disabled={createMutation.isPending || createMutation.isPending}
              >
                บันทึก
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
