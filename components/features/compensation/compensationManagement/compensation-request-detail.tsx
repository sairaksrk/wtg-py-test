"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ConsultantTable,
  ConsultantData,
} from "./consultantTable/consultant-table";

// ส่วนประกอบของการ์ดสรุปข้อมูลย่อย 5 ใบด้านบน
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

// ข้อมูลจำลองสำหรับแสดงผล
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

export default function CompensationRequestDetail({
  reqId,
}: {
  reqId?: string;
}) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");

  const [personnelData, setPersonnelData] = useState<ConsultantData[]>([]);

  const handleTableUpdate = (updatedData: ConsultantData[]) => {
    setPersonnelData(updatedData);
  };

  return (
    <div className="min-h-screen pb-24 bg-[#FAFAFA]">
      <div className="max-w-full mx-auto px-4">
        {/* ส่วนหัวของหน้า */}
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

        {/* การ์ดสรุปข้อมูล 5 ใบด้านบน */}
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

        {/* แถบสรุปบริหารวงเงิน - ปรับปรุงให้ Scroll แนวนอนได้ทั้งแถวข้อมูล */}
        <Card className="border rounded-[20px] mb-6 overflow-hidden">
          <div className="overflow-x-auto ">
            <CardContent className="p-8 min-w-max">
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

                {/* การ์ดคงเหลือ */}
                <div className="bg-[#F0F7FF] px-12 py-5 rounded-[20px] flex flex-col items-end min-w-[350px]">
                  <p className="text-sm text-subdude mb-1">คงเหลือ</p>
                  <p className="text-[28px] font-semibold text-[#18181B]">
                    {MOCKUP_SUMMARY_DATA.balance}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ส่วนของตารางรายชื่อบุคลากร */}
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
            <Button
              variant="outline"
              className="bg-white border-gray-200 rounded-xl text-sm h-10"
            >
              <Icon icon="solar:sort-linear" className="mr-2 size-4" />
              ตัวกรอง
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ConsultantTable onUpdate={handleTableUpdate} />
          </CardContent>
        </Card>

        {/* ส่วนแสดงสถานะการแบ่งหน้า */}
        <div className="flex justify-end py-4">
          <p className="text-xs text-subdude">
            {MOCKUP_PAGINATION.displayText}
          </p>
        </div>
      </div>
    </div>
  );
}
