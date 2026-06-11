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
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@iconify/react";
import { ComboboxMulti } from "@/components/ui/combobox-multi";
import {
  useGetReviewerList,
  useGetStructureUnitList,
  usePositionTypeLevelList,
} from "@/libs/query/master.queries";
import { Combobox } from "@/components/common/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { formatApiError } from "@/types/api";
import { useLoadingStore } from "@/stores/loading-store";
import {
  useCreateCreditLimitList,
  useGetGroupsListCheckBox,
} from "@/libs/query/compensation.queries";
import { CreateCreditLimit, GroupItem } from "@/types/compensation";
import ErrorComponent from "@/components/common/error";

// const positionFormSchema = z.object({
//   name: z.string().min(1),
//   reviewerId: z.string().min(1),
//   allocPercent: z.string().min(1),
//   positionLevelIds: z.array(z.string()).min(1),
//   structureUnitIds: z.array(z.string()).min(1),
// });

const positionFormSchema = z
  .object({
    name: z.string().min(1),
    reviewerId: z.string().min(1),
    allocPercent: z.string().min(1),
    positionLevelIds: z.array(z.string()).optional(),
    structureUnitIds: z.array(z.string()).optional(),

    isGroupSelected: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // ถ้าไม่ได้เลือกจากกลุ่ม บังคับกรอก positionLevelIds และ structureUnitIds
    if (!data.isGroupSelected) {
      if (!data.positionLevelIds || data.positionLevelIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["positionLevelIds"],
          message: "กรุณาณาระบุ",
        });
      }

      if (!data.structureUnitIds || data.structureUnitIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["structureUnitIds"],
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
  const updateLoading = useLoadingStore((state) => state.updateLoading);

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
      name: "",
      reviewerId: "",
      allocPercent: "",
      positionLevelIds: [],
      structureUnitIds: [],
      isGroupSelected: false,
    },
  });

  const {
    data: structureUnitData,
    isLoading: isLoadingAgency,
    isError: isErrorAgency,
    error: errorAgency,
  } = useGetStructureUnitList();

  const {
    data: positionTypeLevelData,
    isLoading: isLoadingPositionTypeLevel,
    isError: isErrorPositionTypeLevel,
    error: errorPositionTypeLevel,
  } = usePositionTypeLevelList();

  const {
    data: reviewerListData,
    isLoading: isLoadingReviewer,
    isError: isErrorReviewer,
    error: errorReviewer,
  } = useGetReviewerList();

  const positionTypeData = useMemo(
    () =>
      positionTypeLevelData?.map((item) => ({
        value: item.value,
        label: item.positionTypeName + " " + item.label,
      })) || [],
    [positionTypeLevelData],
  );

  const {
    data: groupsData,
    isLoading: isLoadingGroups,
    isError: isErrorGroupDetail,
    error: errorGroupDetail,
  } = useGetGroupsListCheckBox(reqId || "");

  const listGroupsData: GroupItem[] = useMemo(() => {
    return groupsData || [];
  }, [groupsData]);

  const createMutation = useCreateCreditLimitList();

  useEffect(() => {
    if (!editingId) {
      reset({
        name: "",
        reviewerId: "",
        allocPercent: "",
        positionLevelIds: [],
        structureUnitIds: [],
        isGroupSelected: false,
      });
      setIsGroupSelected(false);
      setSelectedIds(new Set());
    }
  }, [open, editingId, reset]);

  const onSubmit = async (formData: PositionFormValues) => {
    try {
      updateLoading(true);

      const payloadCreate: CreateCreditLimit = {
        payrollPeriodId: reqId || "",
        name: formData.name,
        reviewerId: formData.reviewerId,
        allocPercent: Number(formData.allocPercent),
        // กรณีเลือกจากกลุ่ม
        ...(isGroupSelected && {
          sourceGroupIds: Array.from(selectedIds),
        }),
        // กรณีเลือกเอง
        ...(!isGroupSelected && {
          positionLevelIds: formData.positionLevelIds,
          structureUnitIds: formData.structureUnitIds,
        }),
      };

      const res = await createMutation.mutateAsync(payloadCreate);
      toastSuccess(c("successfully"), c("successfully-description"));
      onSave();

      router.push(`/manage-compensation/item-request/${res?.payrollPeriodId}`);
    } catch (error) {
      const { title, description } = formatApiError(error, c("error-occur"));

      toastError(title, description || c("error-detail"));
    } finally {
      updateLoading(false);
    }
  };

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

  const renderGroupItem = (group: GroupItem) => {
    const isSelected = selectedIds.has(group?.value);
    return (
      <label
        key={group.value}
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
              handleGroupCheckboxChange(group?.value, checked);
            }}
          />

          <span className="text-base font-medium text-[#18181B]">
            {group?.label}
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
          {group?.reviewerName ?? "-"}
        </Badge>
      </label>
    );
  };

  const isSaving = createMutation.isPending;
  const isLoading =
    isLoadingAgency ||
    isLoadingPositionTypeLevel ||
    isLoadingReviewer ||
    isLoadingGroups;

  const isError =
    isErrorGroupDetail ||
    isErrorAgency ||
    isErrorPositionTypeLevel ||
    isErrorReviewer;
  const error =
    errorGroupDetail || errorAgency || errorPositionTypeLevel || errorReviewer;

  if (isError) {
    const { title, description, statusCode } = formatApiError(
      error,
      c("error-occur"),
    );
    return (
      <div className="py-20">
        <ErrorComponent
          statusCode={statusCode}
          title={title}
          message={description}
        />
      </div>
    );
  }

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
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ชื่อกลุ่ม"
                  floatingLabel
                  required
                  error={errors.name?.message}
                  disabled={isSaving}
                />
              )}
            />

            <p className="text-base font-medium">จัดสรรค่าตอบแทน</p>
          </div>
          <div className="grid grid-cols-2 gap-6 border-b border-dashed pb-6 border-[#D4D4D8]">
            <Controller
              name="reviewerId"
              control={control}
              render={({ field }) => (
                <Combobox
                  label="ผู้พิจารณา"
                  floatingLabel
                  required
                  error={errors.reviewerId?.message}
                  options={reviewerListData || []}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  valueType="string"
                  disabled={isSaving}
                />
              )}
            />

            <Controller
              name="allocPercent"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="จัดสรรร้อยละ"
                  floatingLabel
                  required
                  error={errors.allocPercent?.message}
                  thousandSeparator
                  iconPosition="right"
                  icon={
                    <Icon
                      icon="solar:sale-square-linear"
                      className="w-4 h-4 text-gray-500"
                    />
                  }
                  disabled={isSaving}
                  maxValue={3}
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
                name="positionLevelIds"
                control={control}
                render={({ field }) => (
                  <ComboboxMulti
                    label="ประเภทและระดับตำแหน่ง"
                    floatingLabel
                    error={errors.positionLevelIds?.message}
                    options={positionTypeData || []}
                    value={field.value || []}
                    onChange={(v) => field.onChange(v)}
                    valueType="string"
                    disabled={isSaving}
                    required={!isGroupSelected}
                  />
                )}
              />

              <Controller
                name="structureUnitIds"
                control={control}
                render={({ field }) => (
                  <ComboboxMulti
                    options={structureUnitData || []}
                    value={field.value || []}
                    valueType="string"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    label="หน่วยงาน"
                    floatingLabel
                    error={errors.structureUnitIds?.message}
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
                disabled={isSaving}
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
                disabled={isSaving}
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
