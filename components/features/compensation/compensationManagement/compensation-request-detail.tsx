"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toastSuccess } from "@/utils/toast";
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

const MOCKUP_PAGINATION: any = {
  totalPersonnel: 5,
  displayText: "แสดง 1-10 จาก 41 รายการ",
};

const INITIAL_CONSULTANTS: ConsultantData[] = [
  {
    id: "1",
    positionNo: "001",
    name: "นายสมชาย ใจดี",
    subPosition: "นักวิเคราะห์นโยบายและแผน ชำนาญการพิเศษ",
    type: "อำนวยการ",
    department: "กองยุทธศาสตร์",
    salary: 31610.0,
    baseCalculation: 60990.0,
    officePercentLimit: 0.25,
    deputyPercentLimit: 0.25,
    directorPercentLimit: 0.25,
    evalScore: 90,
    evalResult: "เลือก",
    officeEvalPercent: 100,
    officeEvalBaht: 0,
    deputyEvalPercent: 100,
    deputyEvalBaht: 0,
    directorEvalPercent: 100,
    directorEvalBaht: 0,
    totalPercentIncrease: 4,
    totalAmountIncrease: 1440.0,
    specialCompensation: 0,
    receivedSalary: 36279.0,
    positionAllowance: 36279.0,
    totalIncome: 66279.0,
  },
  {
    id: "2",
    positionNo: "002",
    name: "นางสาวสมหญิง ดีมาก",
    subPosition: "นักทรัพยากรบุคคล ชำนาญการ",
    type: "อำนวยการ",
    department: "กองบริหารทรัพยากรบุคคล",
    salary: 18480.0,
    baseCalculation: 52320.0,
    officePercentLimit: 0.25,
    deputyPercentLimit: 0.25,
    directorPercentLimit: 0.25,
    evalScore: 90,
    evalResult: "ดีมาก",
    officeEvalPercent: 80,
    officeEvalBaht: 80.0,
    deputyEvalPercent: 80,
    deputyEvalBaht: 80.0,
    directorEvalPercent: 80,
    directorEvalBaht: 80.0,
    totalPercentIncrease: 4,
    totalAmountIncrease: 1440.0,
    specialCompensation: 0,
    receivedSalary: 19920.0,
    positionAllowance: 19920.0,
    totalIncome: 0.0,
  },
  {
    id: "3",
    positionNo: "003",
    name: "นายวิชัย รักษ์ดี",
    subPosition: "olivia@untitledui.com",
    type: "อำนวยการ",
    department: "กองยุทธศาสตร์",
    salary: 35070.0,
    baseCalculation: 60990.0,
    officePercentLimit: 0.15,
    deputyPercentLimit: 0.15,
    directorPercentLimit: 0.15,
    evalScore: 80,
    evalResult: "ดี",
    officeEvalPercent: 80,
    officeEvalBaht: 80.0,
    deputyEvalPercent: 80,
    deputyEvalBaht: 80.0,
    directorEvalPercent: 80,
    directorEvalBaht: 80.0,
    totalPercentIncrease: 1,
    totalAmountIncrease: 120.0,
    specialCompensation: 0,
    receivedSalary: 35190.0,
    positionAllowance: 35190.0,
    totalIncome: 0.0,
  },
  {
    id: "4",
    positionNo: "004",
    name: "นางจินดา สวยงาม",
    subPosition: "นักวิชาการเงินและบัญชี ชำนาญการพิเศษ",
    type: "อำนวยการ",
    department: "กองคลัง",
    salary: 63840.0,
    baseCalculation: 60990.0,
    officePercentLimit: 0.15,
    deputyPercentLimit: 0.15,
    directorPercentLimit: 0.15,
    evalScore: 80,
    evalResult: "ดีเด่น",
    officeEvalPercent: 80,
    officeEvalBaht: 80.0,
    deputyEvalPercent: 80,
    deputyEvalBaht: 80.0,
    directorEvalPercent: 80,
    directorEvalBaht: 80.0,
    totalPercentIncrease: 2,
    totalAmountIncrease: 340.0,
    specialCompensation: 2000,
    receivedSalary: 75180.0,
    positionAllowance: 75180.0,
    totalIncome: 9000.0,
  },
  {
    id: "5",
    positionNo: "005",
    name: "นางจินดา สวยงาม",
    subPosition: "นักวิชาการเงินและบัญชี ชำนาญการพิเศษ",
    type: "อำนวยการ",
    department: "กองคลัง",
    salary: 23930.0,
    baseCalculation: 60990.0,
    officePercentLimit: 0.15,
    deputyPercentLimit: 0.15,
    directorPercentLimit: 0.15,
    evalScore: 80,
    evalResult: "ดีมาก",
    officeEvalPercent: 80,
    officeEvalBaht: 80.0,
    deputyEvalPercent: 80,
    deputyEvalBaht: 80.0,
    directorEvalPercent: 80,
    directorEvalBaht: 80.0,
    totalPercentIncrease: 2,
    totalAmountIncrease: 780.0,
    specialCompensation: 0,
    receivedSalary: 24780.0,
    positionAllowance: 24780.0,
    totalIncome: 0.0,
  },
];

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
}: {
  reqId?: string;
}) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");

  const [personnelData, setPersonnelData] =
    useState<ConsultantData[]>(INITIAL_CONSULTANTS);
  const [searchCompensationOpen, setSearchCompensationOpen] = useState(false);

  const handleTableUpdate = useCallback((updatedData: ConsultantData[]) => {
    setPersonnelData(updatedData);
  }, []);

  // status (ถ้ามี API เปลี่ยน const status = data?.status)
  const [status, setStatus] = useState<string>("รอพิจารณา");
  const onSubmit = async () => {
    alert.fire({
      type: "warning",
      title: "ยืนยันการพิจารณา",
      description: "โปรดตรวจสอบความถูกต้องของข้อมูล",
      confirmButton: {
        label: c("button.confirm"),
        onClick: () => toastSuccess(c("successfully")),
      },
      cancelButton: { label: c("button.secondary-cancel"), show: true },
    });
  };

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

  const onSearch = (formData: any) => {
    setFilters({
      ...filters,
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
      requestNo: "",
      name: "",
      startDate: null,
      positionId: "",
      positionLevelId: "",
      departmentId: "",
    });
    setSearchCompensationOpen(false);
  };

  const mainBalance = "-2,581.60";
  const isMainBalanceNegative = mainBalance.trim().startsWith("-");
  // ดึงค่า config ของสถานะปัจจุบัน statusConfig
  const currentStatus = statusConfig[status] || statusConfig["รอพิจารณา"];
  const isCompleted = status === "สำเร็จ";

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
                กลุ่มผอ.สำนัก (ผอ.สบน.)
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">
                    เงินเดือนปัจจุบันรวม
                  </span>
                  <span className="text-base font-normal text-[#18181B]">
                    463,720.00
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">จัดสรรร้อยละ (%)</span>
                  <span className="text-base font-normal text-[#18181B]">
                    0.25/3.00
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">วงเงินจัดสรร</span>
                  <span className="text-base font-normal text-[#18181B]">
                    2,581.60
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-subdude">ใช้ไป</span>
                  <span className="text-base font-normal text-[#18181B]">
                    0.00
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
                ทั้งหมด {MOCKUP_PAGINATION.totalPersonnel} คน
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

        <div className="flex justify-end py-4">
          <p className="text-sm text-subdude">
            {MOCKUP_PAGINATION.displayText}
          </p>
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
