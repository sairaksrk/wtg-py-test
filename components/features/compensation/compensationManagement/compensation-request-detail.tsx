"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toastSuccess, toastError } from "@/utils/toast";
import Loading from "@/components/common/loading";
import ErrorComponent from "@/components/common/error";
import { formatApiError } from "@/types/api";
import {
  useDeleteCreditLimitList,
  useGetCompensationGroupDetail,
  useGetCompensationPersonnelList,
  useSaveCompensationGroupItems,
  useUpdateStatusConsider,
} from "@/libs/query/compensation.queries";
import {
  ConsultantTable,
  ConsultantData,
} from "./consultantTable/consultant-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverClose,
} from "@/components/ui/popover";
import { useTableState } from "@/hooks/use-session";
import {
  CompensationListParams,
  COMPENSATION_REQUEST_SESSION_KEY,
} from "@/types/compensation";
import { getPageSize } from "@/utils/helpers";
import { PersonnelSearchModal } from "./personnel-search-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
import { Pagination } from "@/components/common/pagination";
import { useLoadingStore } from "@/stores/loading-store";
import { useSetBreadcrumb } from "@/hooks/breadcrumb/use-set-breadcrumb";

interface AllocationCardProps {
  title: string;
  salary: string;
  percent: string;
  allocated: string;
  spent: string;
  balance: string;
}

const AllocationCard = ({
  title,
  salary,
  percent,
  allocated,
  spent,
  balance,
}: AllocationCardProps) => {
  const isNegative = balance.trim().startsWith("-");

  return (
    <Card className="shadow-none rounded-[20px] min-w-[320px] max-w-[320px] flex-1 bg-white overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5 pb-0">
        <h4
          className="text-sm font-medium text-[#18181B] mb-4 truncate"
          title={title}
        >
          {title}
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-subdude">เงินเดือนปัจจุบันรวม</span>
            <span className="font-normal text-[#18181B]">{salary}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subdude">จัดสรรร้อยละ (%)</span>
            <span className="font-normal text-[#18181B]">{percent}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subdude">วงเงินจัดสรร</span>
            <span className="font-normal text-[#18181B]">{allocated}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-subdude">ใช้ไป</span>
            <span className="font-normal text-[#18181B]">{spent}</span>
          </div>
        </div>
      </CardContent>
      <div className="px-3 text-sm mb-6">
        <div className="px-4 mt-4 bg-[#F0F7FF] w-full flex justify-between items-center rounded-[6px] py-1">
          <span className="text-subdude">คงเหลือ</span>
          <span
            className={cn(
              "font-normal",
              isNegative ? "text-[#EF4444] font-medium" : "text-[#18181B]",
            )}
          >
            {balance}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default function CompensationRequestDetail({
  reqId,
  groupsId,
}: {
  reqId?: string;
  groupsId: string;
}) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");

  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const [personnelData, setPersonnelData] = useState<ConsultantData[]>([]);
  const [searchCompensationOpen, setSearchCompensationOpen] = useState(false);
  const [previewMap, setPreviewMap] = useState<
    Record<
      string,
      {
        round1?: {
          allocPercent?: number | null;
          allocQuotaPercent?: number | null;
          allocAmount?: number | null;
        };
        round2?: {
          allocPercent?: number | null;
          allocQuotaPercent?: number | null;
          allocAmount?: number | null;
        };
        round3?: {
          allocPercent?: number | null;
          allocQuotaPercent?: number | null;
          allocAmount?: number | null;
        };
      }
    >
  >({});

  const createMutation = useUpdateStatusConsider();

  const onSubmit = async () => {
    alert.fire({
      type: "warning",
      title: c("confirm-review"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          updateLoading(true);
          try {
            await createMutation.mutateAsync({
              groupsId: groupsId || "",
            });

            toastSuccess(c("successfully"), c("successfully-description"));
            router.push(
              `/manage-compensation/item-request/${reqId}/${groupsId}`,
            );
          } catch (error) {
            const { title, description } = formatApiError(
              error,
              c("error-occur"),
            );
            toastError(title, description || c("error-detail"));
          } finally {
            updateLoading(false);
          }
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        variant: "secondary",
        show: true,
      },
    });
  };

  const deleteCreditLimitListMutation = useDeleteCreditLimitList();
  const onDeleteRequest = (id: string) => {
    alert.fire({
      type: "delete",
      title: c("delete-confirmation"),
      description: c("delete-confirmation-description"),
      confirmButton: {
        label: c("button.delete"),
        variant: "destructive",
        onClick: async () => {
          updateLoading(true);
          try {
            await deleteCreditLimitListMutation.mutateAsync(id);
            toastSuccess(c("successfully"), c("successfully-description"));
            router.push(`/manage-compensation/item-request/${reqId}`);
          } catch (error) {
            const { title, description } = formatApiError(
              error,
              c("error-occur"),
            );
            toastError(title, description || c("error-detail"));
          } finally {
            updateLoading(false);
          }
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        show: true,
      },
    });
  };

  const [filters, setFilters] = useTableState<CompensationListParams>(
    COMPENSATION_REQUEST_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      positionNumber: "",
      employeeName: "",
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    },
  );

  const previewData = useMemo(() => {
    return Object.entries(previewMap).map(([employeeId, val]) => ({
      employeeId,
      ...val,
    }));
  }, [previewMap]);

  const {
    data: groupDetail,
    isLoading: isLoadingGroupDetail,
    isError: isErrorGroupDetail,
    error: errorGroupDetail,
  } = useGetCompensationGroupDetail(groupsId || "");

  // Breadcrumb ชื่อรายการหลัก และชื่อกลุ่ม
  useSetBreadcrumb([
    {
      name: groupDetail?.period?.name || "กำลังโหลด...",
      url: `/manage-compensation/item-request/${reqId}`,
    },
    {
      name: groupDetail?.name || "",
      url: `/manage-compensation/item-request/${reqId}/${groupsId}`,
    },
  ]);

  const queryBody = useMemo(
    () => ({
      page: filters.page || 1,
      take: filters.take || 10,
      previewData,
      positionNumber: filters.positionNumber || undefined,
      employeeName: filters.employeeName || undefined,
      positionId: filters.positionId || undefined,
      positionLevelId: filters.positionLevelId || undefined,
      departmentId: filters.departmentId || undefined,
    }),
    [filters, previewData],
  );

  const {
    data: personnelListResponse,
    isError: isErrorPersonnel,
    error: errorPersonnel,
  } = useGetCompensationPersonnelList(reqId || "", groupsId || "", queryBody);

  const saveMutation = useSaveCompensationGroupItems();

  useEffect(() => {
    if (personnelListResponse?.data) {
      const mapEvalResultToTh = (result: string) => {
        switch (result) {
          case "EXCELLENT":
            return "ดีเด่น";
          case "VERY_GOOD":
            return "ดีมาก";
          case "GOOD":
            return "ดี";
          default:
            return "เลือก";
        }
      };

      const mapped = personnelListResponse.data.map((item: any) => ({
        id: item.id,
        employeeId: item.employeeId,
        positionNo: String(item.positionNumber || "-"),
        name: item.fullNameTh || "-",
        subPosition: item.positionName || "-",
        type: item.employeeTypeName || "-",
        department: item.unitName || "-",
        salary: Number(item.currentSalary || 0),
        baseCalculation: Number(item.calculationBase || 0),
        evalScore:
          item.evaluationScore !== null ? Number(item.evaluationScore) : 0,
        evalResult: mapEvalResultToTh(item.evaluationResult),
        allocPercentRound1:
          item.allocPercentRound1 !== null
            ? String(item.allocPercentRound1)
            : "",
        allocQuotaPercentRound1:
          item.allocQuotaPercentRound1 !== null
            ? String(item.allocQuotaPercentRound1)
            : "",
        allocAmountRound1: Number(item.allocAmountRound1 || 0),
        allocPercentRound2:
          item.allocPercentRound2 !== null
            ? String(item.allocPercentRound2)
            : "",
        allocQuotaPercentRound2:
          item.allocQuotaPercentRound2 !== null
            ? String(item.allocQuotaPercentRound2)
            : "",
        allocAmountRound2: Number(item.allocAmountRound2 || 0),
        allocPercentRound3:
          item.allocPercentRound3 !== null
            ? String(item.allocPercentRound3)
            : "",
        allocQuotaPercentRound3:
          item.allocQuotaPercentRound3 !== null
            ? String(item.allocQuotaPercentRound3)
            : "",
        allocAmountRound3: Number(item.allocAmountRound3 || 0),
        totalIncrementPercent: Number(item.totalIncrementPercent || 0),
        totalIncrementAmount: Number(item.totalIncrementAmount || 0),
        extraCompensation: Number(item.extraCompensation || 0),
        newSalary: Number(item.newSalary || 0),
        positionAllowance: Number(item.positionAllowance || 0),
        totalIncome: Number(item.totalIncome || 0),
      }));
      setPersonnelData(mapped);
    }
  }, [personnelListResponse]);

  const handleTableUpdate = useCallback(
    (updatedData: ConsultantData[]) => {
      // หาแถวที่มีการเปลี่ยนแปลงค่าเทียบกับสถานะล่าสุดใน personnelData
      const changedItem = updatedData.find((item) => {
        const prevItem = personnelData.find((p) => p.id === item.id);
        if (!prevItem) return false;
        return (
          item.allocPercentRound1 !== prevItem.allocPercentRound1 ||
          item.allocQuotaPercentRound1 !== prevItem.allocQuotaPercentRound1 ||
          item.allocAmountRound1 !== prevItem.allocAmountRound1 ||
          item.allocPercentRound2 !== prevItem.allocPercentRound2 ||
          item.allocQuotaPercentRound2 !== prevItem.allocQuotaPercentRound2 ||
          item.allocAmountRound2 !== prevItem.allocAmountRound2 ||
          item.allocPercentRound3 !== prevItem.allocPercentRound3 ||
          item.allocQuotaPercentRound3 !== prevItem.allocQuotaPercentRound3 ||
          item.allocAmountRound3 !== prevItem.allocAmountRound3 ||
          item.evalScore !== prevItem.evalScore ||
          item.evalResult !== prevItem.evalResult
        );
      });

      setPersonnelData(updatedData);

      // ถ้ามีแถวที่ถูกแก้ไข ให้บันทึกค่าลงใน previewMap ทันทีโดยไม่มีการกรองค่าซ้ำ
      if (changedItem && changedItem.employeeId) {
        setPreviewMap((prev) => {
          const buildRound = (percent: any, quotaPercent: any, amount: any) => {
            const pStr =
              percent !== undefined && percent !== null
                ? String(percent).trim()
                : "";
            const qStr =
              quotaPercent !== undefined && quotaPercent !== null
                ? String(quotaPercent).trim()
                : "";
            const aStr =
              amount !== undefined && amount !== null
                ? String(amount).trim()
                : "";

            const allocPercent = pStr !== "" ? parseFloat(pStr) : null;
            const allocQuotaPercent = qStr !== "" ? parseFloat(qStr) : null;
            const allocAmount = aStr !== "" ? Number(aStr) : null;

            // ตรวจสอบว่ารอบนี้มีค่าที่ถูกแก้ไขจริงหรือไม่ (ยอมรับค่า 0 ด้วย)
            const hasActiveValue = pStr !== "" || qStr !== "" || aStr !== "";

            if (!hasActiveValue) return undefined;

            return {
              allocPercent,
              allocQuotaPercent,
              allocAmount,
            };
          };

          const currentRound = groupDetail?.round ?? 1;

          const round1 =
            currentRound === 1
              ? buildRound(
                  changedItem.allocPercentRound1,
                  changedItem.allocQuotaPercentRound1,
                  changedItem.allocAmountRound1,
                )
              : undefined;

          const round2 =
            currentRound === 2
              ? buildRound(
                  changedItem.allocPercentRound2,
                  changedItem.allocQuotaPercentRound2,
                  changedItem.allocAmountRound2,
                )
              : undefined;

          const round3 =
            currentRound === 3
              ? buildRound(
                  changedItem.allocPercentRound3,
                  changedItem.allocQuotaPercentRound3,
                  changedItem.allocAmountRound3,
                )
              : undefined;

          const employeeUpdate: any = {};
          if (round1) employeeUpdate.round1 = round1;
          if (round2) employeeUpdate.round2 = round2;
          if (round3) employeeUpdate.round3 = round3;

          // หากไม่มีรอบใดถูกแก้ไขเลย ให้ลบพนักงานคนนี้ออกจาก previewMap
          if (Object.keys(employeeUpdate).length === 0) {
            const next = { ...prev };
            delete next[changedItem.employeeId!];
            return next;
          }

          return {
            ...prev,
            [changedItem.employeeId!]: employeeUpdate,
          };
        });
      }
    },
    [personnelData, groupDetail?.round],
  );

  const handleSaveRow = useCallback(
    async (row: ConsultantData, originalRow: ConsultantData) => {
      // ใช้รอบปัจจุบันจาก groupDetail?.round โดยตรง
      const editedRound = groupDetail?.round ?? 1;

      let allocPercent: number | null = null;
      let allocAmount: number | null = null;
      let allocQuotaPercent: number | null = null;

      if (editedRound === 1) {
        allocPercent =
          row.allocPercentRound1 !== ""
            ? parseFloat(String(row.allocPercentRound1))
            : null;
        allocQuotaPercent =
          row.allocQuotaPercentRound1 !== ""
            ? parseFloat(String(row.allocQuotaPercentRound1))
            : null;
        allocAmount =
          row.allocAmountRound1 !== ""
            ? parseFloat(String(row.allocAmountRound1))
            : null;
      } else if (editedRound === 2) {
        allocPercent =
          row.allocPercentRound2 !== ""
            ? parseFloat(String(row.allocPercentRound2))
            : null;
        allocQuotaPercent =
          row.allocQuotaPercentRound2 !== ""
            ? parseFloat(String(row.allocQuotaPercentRound2))
            : null;
        allocAmount =
          row.allocAmountRound2 !== ""
            ? parseFloat(String(row.allocAmountRound2))
            : null;
      } else if (editedRound === 3) {
        allocPercent =
          row.allocPercentRound3 !== ""
            ? parseFloat(String(row.allocPercentRound3))
            : null;
        allocQuotaPercent =
          row.allocQuotaPercentRound3 !== ""
            ? parseFloat(String(row.allocQuotaPercentRound3))
            : null;
        allocAmount =
          row.allocAmountRound3 !== ""
            ? parseFloat(String(row.allocAmountRound3))
            : null;
      }

      const mapEvalResultToEn = (result: string) => {
        switch (result) {
          case "ดีเด่น":
            return "EXCELLENT";
          case "ดีมาก":
            return "VERY_GOOD";
          case "ดี":
            return "GOOD";
          default:
            return null;
        }
      };

      const payload = {
        items: [
          {
            id: row.id,
            allocPercent: isNaN(allocPercent!) ? null : allocPercent,
            allocAmount: isNaN(allocAmount!) ? null : allocAmount,
            allocQuotaPercent: isNaN(allocQuotaPercent!)
              ? null
              : allocQuotaPercent,
            evaluationScore:
              row.evalScore !== null ? Number(row.evalScore) : null,
            evaluationResult: mapEvalResultToEn(row.evalResult),
          },
        ],
      };

      try {
        await saveMutation.mutateAsync({ groupsId: groupsId || "", payload });
        toastSuccess(c("successfully"), c("successfully-description"));
      } catch (error) {
        const { title, description } = formatApiError(error, c("error-occur"));
        toastError(title, description || c("error-detail"));
      }
    },
    [saveMutation, groupsId, c, groupDetail?.round],
  );

  const onSearch = (formData: any) => {
    setFilters({
      ...filters,
      page: 1,
      positionNumber: formData?.positionNumber,
      employeeName: formData?.employeeName,
      positionId: formData?.positionId,
      positionLevelId: formData?.positionLevelId,
      departmentId: formData?.departmentId,
    });
  };

  const onClearFilters = () => {
    setFilters({
      ...filters,
      page: 1,
      positionNumber: "",
      employeeName: "",
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    });
    setSearchCompensationOpen(false);
  };

  const isLoading = isLoadingGroupDetail;
  const isError = isErrorGroupDetail || isErrorPersonnel;
  const error = errorGroupDetail || errorPersonnel;

  if (isLoading) {
    return (
      <div className="py-80">
        <Loading fullscreen={false} />
      </div>
    );
  }

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

  const mainBalance =
    groupDetail?.remainingAmount?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    }) || "-";
  const isMainBalanceNegative = mainBalance.trim().startsWith("-");

  const statusConfig: Record<
    string,
    { label: string; color: string; dotColor: string }
  > = {
    pending: {
      label: "รอพิจารณา",
      color: "bg-[#FFF7ED] text-[#F97316] hover:bg-[#FFF7ED]",
      dotColor: "bg-[#F97316]",
    },
    success: {
      label: "สำเร็จ",
      color: "bg-[#F0FDF4] text-[#16A34A] hover:bg-[#F0FDF4]",
      dotColor: "bg-[#16A34A]",
    },
  };

  const status = groupDetail?.status;

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
    label: "",
    color: "bg-gray-100 text-gray-400",
  };

  const isCompleted = status === "success";
  const totalPersonnel =
    personnelListResponse?.meta?.itemCount ?? personnelData.length;
  const subGroups = groupDetail?.subGroups || [];

  // จัดรูปแบบเปอร์เซ็นต์ทั้งตัวเลขเดี่ยวและข้อความที่มีสแลชคั่น
  const formatPercentValue = (val: any) => {
    if (val === undefined || val === null || val === "") return "-";
    const str = String(val);
    if (str.includes("/")) return str; // แสดงผลตรงๆ ตัวหากมีสแลชคั่น
    const num = parseFloat(str);
    return isNaN(num) ? str : num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-full mx-auto px-4">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <Button
            variant="secondary"
            size="icon"
            className="p-3.5"
            onClick={() => {
              router.push(`/manage-compensation/item-request/${reqId}`);
            }}
          >
            <Icon icon="solar:alt-arrow-left-outline" className="text-base" />
          </Button>
          <h1 className="text-xl font-medium text-[#18181B]">ย้อนกลับ</h1>
        </div>

        {/* Top Card: Group Name & Status */}
        <Card className="shadow-none rounded-[20px] bg-white p-6 mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-subdude">ชื่อกลุ่ม</span>
            <h2 className="text-xl font-medium text-[#18181B]">
              {groupDetail?.name ?? "-"}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge
                className={cn(
                  "border-none px-3 py-1 text-sm font-normal rounded-full flex items-center gap-1",
                  currentStatus.color,
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    currentStatus.dotColor,
                  )}
                />
                {currentStatus.label}
              </Badge>
              <div className="border-r border-gray-200 h-4" />
              <div className="flex items-center gap-1.5 text-sm text-subdude">
                <Icon icon="solar:user-linear" className="size-4" />
                <span>
                  {groupDetail?.reviewerName ?? "นางสาวอนันตญา สิริประภาชัย"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Card */}
        <Card className="shadow-none rounded-[20px] bg-white overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-[#18181B]">
                การจัดสรรวงเงิน
              </h3>
              <p className="text-sm text-subdude mt-1">
                {groupDetail?.name || "-"}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">
                    เงินเดือนปัจจุบันรวม
                  </span>
                  <span className="text-base font-normal text-[#18181B]">
                    {groupDetail?.totalSalary?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">จัดสรรร้อยละ (%)</span>
                  <span className="text-base font-normal text-[#18181B]">
                    {formatPercentValue(groupDetail?.allocPercent)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">วงเงินจัดสรร</span>
                  <span className="text-base font-normal text-[#18181B]">
                    {groupDetail?.budgetAmount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) || "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">ใช้ไป</span>
                  <span className="text-base font-normal text-[#18181B]">
                    {groupDetail?.spentAmount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) || "-"}
                  </span>
                </div>
              </div>

              <div className="bg-[#F0F7FF] px-6 py-4 rounded-[20px] flex flex-col items-end min-w-70">
                <span className="text-xs text-subdude mb-1">คงเหลือ</span>
                <span
                  className={cn(
                    "text-2xl font-semibold",
                    isMainBalanceNegative ? "text-[#EF4444]" : "text-[#18181B]",
                  )}
                >
                  {mainBalance}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horizontal Scrollable Cards (Subgroups) */}
        {subGroups.length > 0 && (
          <div className="flex overflow-x-auto gap-4 mb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {subGroups.map((sub: any) => (
              <AllocationCard
                key={sub.id}
                title={sub.name}
                salary={
                  sub.totalSalary?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"
                }
                percent={formatPercentValue(sub.allocPercent)}
                allocated={
                  sub.budgetAmount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"
                }
                spent={
                  sub.spentAmount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"
                }
                balance={
                  sub.remainingAmount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"
                }
              />
            ))}
          </div>
        )}

        {/* Personnel List Table */}
        <Card className="border border-gray-100 shadow-none rounded-3xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-xl font-medium text-[#18181B]">
                รายชื่อบุคลากร
              </CardTitle>
              <p className="text-sm text-subdude">
                ทั้งหมด {totalPersonnel} คน
              </p>
            </div>
            <Popover
              open={searchCompensationOpen}
              onOpenChange={setSearchCompensationOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                >
                  <Icon icon="solar:sort-linear" />
                  {c("filter")}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl mt-2"
              >
                <PopoverHeader className="flex flex-row items-center justify-between px-6 py-4">
                  <PopoverTitle className="text-xl font-medium text-[#18181B] mt-2">
                    ตัวกรอง
                  </PopoverTitle>
                  <PopoverClose className="text-gray-400 hover:text-gray-600 transition-colors outline-none">
                    <Icon icon="mdi:close" className="size-6" />
                  </PopoverClose>
                </PopoverHeader>

                <div className="px-6 pb-6 pt-4 text-black">
                  <PersonnelSearchModal
                    onSearch={onSearch}
                    onClearFilters={onClearFilters}
                    onClose={() => setSearchCompensationOpen(false)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent className="p-0">
            <ConsultantTable
              data={personnelData}
              onUpdate={handleTableUpdate}
              onSaveRow={handleSaveRow}
              readOnly={isCompleted}
              roundtable={groupDetail?.round ?? 1}
            />
          </CardContent>
        </Card>

        <div className="py-4 w-full">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={personnelListResponse?.meta?.pageCount || 1}
            totalRows={totalPersonnel}
            rowsPerPage={filters.take || 10}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>

      {/* Sticky Footer */}
      {!isCompleted && (
        <footer className="rounded-full bg-white px-6 py-4 sticky bottom-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              type="button"
              className="bg-[#F4F4F5] border-[#F4F4F5] text-red-500 hover:text-red-500"
              onClick={() => onDeleteRequest?.(groupsId)}
              disabled={!groupsId}
            >
              ลบรายการ
            </Button>
            <Button
              type="submit"
              className="px-10 rounded-full"
              onClick={onSubmit}
            >
              พิจารณาเสร็จสิ้น
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
