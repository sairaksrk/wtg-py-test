"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toastSuccess } from "@/utils/toast";
import Loading from "@/components/common/loading";
import ErrorComponent from "@/components/common/error";
import { formatApiError } from "@/types/api";
import {
  useGetCompensationGroupDetail,
  useGetCompensationPersonnelList,
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
      <div className="px-3 text-sm">
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

const MOCKUP_ALLOCATION_CARDS: AllocationCardProps[] = [
  {
    title: "กลุ่มชำนาญการพิเศษลงมา (ผอ.สบน.)",
    salary: "4,308,240.00",
    percent: "3.00/0.25/0.15",
    allocated: "8,693.24",
    spent: "0.00",
    balance: "-8,693.24",
  },
  {
    title: "กลุ่มเชี่ยวชาญ (ผอ.สบน.)",
    salary: "372,250.00",
    percent: "0.25/0.15",
    allocated: "720.36",
    spent: "0.00",
    balance: "720.36",
  },
  {
    title: "กลุ่มรองผู้อำนวยการ (ผอ.สบน.)",
    salary: "134,690.00",
    percent: "3.00",
    allocated: "4,040.70",
    spent: "0.00",
    balance: "4,040.70",
  },
  {
    title: "กลุ่มที่ปรึกษา (ผอ.สบน.)",
    salary: "76,800.00",
    percent: "3.00",
    allocated: "2,304.00",
    spent: "0.00",
    balance: "2,304.00",
  },
];

const INITIAL_CONSULTANTS: ConsultantData[] = [];

const statusConfig: Record<
  string,
  { label: string; color: string; dotColor: string }
> = {
  รอพิจารณา: {
    label: "รอพิจารณา",
    color: "bg-[#FFF7ED] text-[#F97316] hover:bg-[#FFF7ED]",
    dotColor: "bg-[#F97316]",
  },
  สำเร็จ: {
    label: "สำเร็จ",
    color: "bg-[#F0FDF4] text-[#16A34A] hover:bg-[#F0FDF4]",
    dotColor: "bg-[#16A34A]",
  },
};

export default function CompensationRequestDetail({
  reqId,
  groupsId,
}: {
  reqId?: string;
  groupsId?: string;
}) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");

  const [personnelData, setPersonnelData] =
    useState<ConsultantData[]>(INITIAL_CONSULTANTS);
  const [searchCompensationOpen, setSearchCompensationOpen] = useState(false);
  const [previewMap, setPreviewMap] = useState<
    Record<string, { allocPercent?: number; allocAmount?: number }>
  >({});

  const [filters, setFilters] = useTableState<CompensationListParams>(
    COMPENSATION_REQUEST_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      requestNo: "",
      name: "",
      startDate: null,
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    },
  );

  // Construct previewData array from previewMap
  const previewData = useMemo(() => {
    return Object.entries(previewMap).map(([employeeId, val]) => ({
      employeeId,
      ...val,
    }));
  }, [previewMap]);

  // API for Group Detail
  const {
    data: groupDetail,
    isLoading: isLoadingGroupDetail,
    isError: isErrorGroupDetail,
    error: errorGroupDetail,
  } = useGetCompensationGroupDetail(groupsId || "");

  // API for Personnel List
  const {
    data: personnelListResponse,
    isLoading: isLoadingPersonnel,
    isError: isErrorPersonnel,
    error: errorPersonnel,
  } = useGetCompensationPersonnelList(reqId || "", groupsId || "", {
    page: filters.page || 1,
    take: filters.take || 10,
    previewData,
    requestNo: filters.requestNo || undefined,
    name: filters.name || undefined,
    positionId: filters.positionId || undefined,
    positionLevelId: filters.positionLevelId || undefined,
    departmentId: filters.departmentId || undefined,
  });

  useEffect(() => {
    if (personnelListResponse?.data) {
      const mapped = personnelListResponse.data.map((item: any) => ({
        id: item.id,
        employeeId: item.employeeId,
        positionNo: String(item.positionNumber || "-"),
        name: item.fullNameTh || "-",
        subPosition: item.positionName || "-",
        type: item.type || "-",
        department: item.unitName || "-",
        salary: Number(item.currentSalary || 0),
        baseCalculation: Number(item.calculationBase || 0),
        officePercentLimit: Number(item.evaluationResultRound1 || 0),
        deputyPercentLimit: Number(item.evaluationResultRound2 || 0),
        directorPercentLimit: Number(item.evaluationResultRound3 || 0),
        evalScore:
          item.evaluationScore !== null ? Number(item.evaluationScore) : 0,
        evalResult: item.evaluationResult || "เลือก",
        officeEvalPercent: Number(item.incrementPercent || 0),
        officeEvalBaht: Number(item.incrementAmount || 0),
        deputyEvalPercent: Number(item.deputyEvalPercent || 0),
        deputyEvalBaht: Number(item.deputyEvalBaht || 0),
        directorEvalPercent: Number(item.directorEvalPercent || 0),
        directorEvalBaht: Number(item.directorEvalBaht || 0),
        totalPercentIncrease: Number(item.totalIncrementPercent || 0),
        totalAmountIncrease: Number(item.totalIncrementAmount || 0),
        specialCompensation: Number(item.specialCompensation || 0),
        receivedSalary: Number(item.newSalary || 0),
        positionAllowance: Number(item.positionAllowance || 0),
        totalIncome: Number(item.totalIncome || item.newSalary || 0),
      }));
      setPersonnelData(mapped);
    }
  }, [personnelListResponse]);

  const handleTableUpdate = useCallback((updatedData: ConsultantData[]) => {
    setPersonnelData(updatedData);

    // Update previewMap with changes
    const newPreviewMap: Record<
      string,
      { allocPercent?: number; allocAmount?: number }
    > = {};
    updatedData.forEach((item) => {
      if (item.employeeId) {
        newPreviewMap[item.employeeId] = {
          allocPercent: item.officeEvalPercent,
          allocAmount: item.officeEvalBaht,
        };
      }
    });
    setPreviewMap(newPreviewMap);
  }, []);

  // status (ถ้ามี API เปลี่ยน const status = data?.status)
  const [status, setStatus] = useState<string>("รอพิจารณา");
  const onSubmit = async () => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        onClick: () => toastSuccess(c("successfully")),
      },
      cancelButton: { label: c("button.secondary-cancel"), show: true },
    });
  };

  const onSearch = (formData: any) => {
    setFilters({
      ...filters,
      page: 1, // Reset to page 1 on search
      requestNo: formData?.requestNo,
      name: formData?.name,
      startDate: formData.startDate
        ? new Date(formData.startDate).getTime()
        : null,
      positionId: formData?.positionId,
      positionLevelId: formData?.positionLevelId,
      departmentId: formData?.departmentId,
    });
  };

  const onClearFilters = () => {
    setFilters({
      ...filters,
      page: 1,
      requestNo: "",
      name: "",
      startDate: null,
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    });
    setSearchCompensationOpen(false);
  };

  const isLoading = isLoadingGroupDetail || isLoadingPersonnel;
  const isError = isErrorGroupDetail || isErrorPersonnel;
  const error = errorGroupDetail || errorPersonnel;

  // if (isLoading) {
  //   return (
  //     <div className="py-80">
  //       <Loading fullscreen={false} />
  //     </div>
  //   );
  // }

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

  // ดึงข้อมูลสรุปวงเงินจัดสรรจาก API จริง
  const mainBalance =
    groupDetail?.remainingAmount?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    }) || "-";
  const isMainBalanceNegative = mainBalance.trim().startsWith("-");
  const currentStatus = statusConfig[status] || statusConfig["รอพิจารณา"];
  const isCompleted = status === "สำเร็จ";

  const totalPersonnel =
    personnelListResponse?.meta?.itemCount ?? personnelData.length;

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
              กลุ่มผอ.สำนัก (ผอ.สบน.)
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge
                className={cn(
                  "border-none px-3 py-1 text-xs font-normal rounded-full flex items-center gap-1",
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
                <span>ทรัพย์ธนิตา วิเชียรชาญ</span>
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
                    {groupDetail?.budgetPercent?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) || "-"}
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

        {/* Horizontal Scrollable Cards */}
        <div className="flex overflow-x-auto gap-4 mb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {MOCKUP_ALLOCATION_CARDS.map((card, index) => (
            <AllocationCard key={index} {...card} />
          ))}
        </div>

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
        <footer className="rounded-full bg-white px-6 py-4 sticky bottom-0">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              type="button"
              className="bg-[#F4F4F5] border-[#F4F4F5] text-red-500 hover:text-red-500"
              // onClick={() => onDeleteRequest?.(reqId)}
              disabled={!reqId}
            >
              ลบรายการ
            </Button>
            <Button type="submit" onClick={onSubmit}>
              พิจารณาเสร็จสิ้น
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
