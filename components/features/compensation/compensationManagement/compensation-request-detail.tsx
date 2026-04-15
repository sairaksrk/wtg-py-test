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

interface SummaryCardProps {
  title: string;
  salary: string;
  percent: string;
  amount: string;
}

const SummaryCard = ({ title, salary, percent, amount }: SummaryCardProps) => (
  <Card className="border shadow-none rounded-[20px]">
    <CardContent className="p-5">
      <h4 className="text-sm font-normal text-[#18181B] mb-4">{title}</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-subdude">เงินเดือน</span>
          <span className="text-sm font-normal text-[#18181B]">{salary}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-subdude">จัดสรร (ร้อยละ)</span>
          <span className="text-sm font-normal text-[#18181B]">{percent}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-subdude">วงเงิน</span>
          <span className="text-sm font-normal text-[#18181B]">{amount}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MOCKUP_SUMMARY_CARDS: any[] = [
  {
    title: "ที่ปรึกษาฯ",
    salary: "76,800",
    percent: "3.00%",
    amount: "2,304.00",
  },
  {
    title: "รองผู้อำนวยการ",
    salary: "134,690",
    percent: "3.00%",
    amount: "4,040.70",
  },
  {
    title: "ผู้อำนวยการสำนัก",
    salary: "465,720",
    percent: "3.00/0.25%",
    amount: "2,581.60",
  },
  {
    title: "ผู้เชี่ยวชาญ",
    salary: "372,250",
    percent: "0.25/0.15%",
    amount: "720.36",
  },
  {
    title: "ชำนาญการพิเศษลงมา",
    salary: "4,308,240",
    percent: "3.00/0.25/0.15%",
    amount: "2,581.61",
  },
];

const MOCKUP_SUMMARY_DATA: any = {
  salary: "76,800.00",
  allocated: "2,304.00",
  spent: "0.00",
  balance: "2,304.00",
};

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
    deputyPercentLimit: 90,
    directorPercentLimit: 90,
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

    // const { data, isLoading, isError, error } = useCompensationRequestsList({
  //   page: filters.page,
  //   take: filters.take,
  //   requestNo: filters.requestNo,
  //   name: filters.name,
  //   startDate: filters.startDate,
  //   positionId: filters.positionId,
  //   positionLevelId: filters.positionLevelId,
  //   departmentId: filters.departmentId,

  // });
  
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

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-full mx-auto px-4">
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
          <h1 className="text-xl font-medium text-[#18181B]">ที่ปรึกษาฯ</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {MOCKUP_SUMMARY_CARDS.map((card, index) => (
            <SummaryCard
              key={index}
              title={card.title}
              salary={card.salary}
              percent={card.percent}
              amount={card.amount}
            />
          ))}
        </div>

        <Card className="border rounded-[20px] mb-6 overflow-hidden">
          <div className="overflow-x-auto ">
            <CardContent className="p-5 min-w-max">
              <h3 className="text-xl font-medium text-[#18181B] mb-8">
                บริหารวงเงิน ที่ปรึกษา
              </h3>

              <div className="flex items-center justify-between gap-20">
                <div className="flex gap-[306.5px]">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-subdude">เงินเดือน</p>
                    <p className="text-base font-normal text-[#18181B]">
                      {MOCKUP_SUMMARY_DATA.salary}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-subdude">เงินจัดสรร</p>
                    <p className="text-base font-normal text-[#18181B]">
                      {MOCKUP_SUMMARY_DATA.allocated}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-subdude">เงินที่ได้เลื่อน</p>
                    <p className="text-base font-normal text-[#18181B]">
                      {MOCKUP_SUMMARY_DATA.spent}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F0F7FF] px-6 py-5 rounded-[20px] flex flex-col items-end min-w-[350px]">
                  <p className="text-sm text-subdude mb-1">คงเหลือ</p>
                  <p className="text-[28px] font-semibold text-[#18181B]">
                    {MOCKUP_SUMMARY_DATA.balance}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

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
    </div>
  );
}
