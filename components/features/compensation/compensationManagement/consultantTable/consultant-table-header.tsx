"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/utils/helpers";

interface ConsultantTableHeaderProps {
  roundtable?: number;
}

export function ConsultantTableHeader({ roundtable = 1 }: ConsultantTableHeaderProps) {
  return (
    <TableHeader className="bg-white">
      <TableRow className="border-b border-gray-100">
        <TableHead className="w-32 font-normal text-subdude py-6 text-sm">
          เลขที่ตำแหน่ง
        </TableHead>
        <TableHead className="w-74 font-normal text-subdude py-6 text-sm">
          ชื่อ-นามสกุล
        </TableHead>
        <TableHead className="w-30 font-normal text-subdude py-6 text-sm">
          ประเภท
        </TableHead>
        <TableHead className="w-53 font-normal text-subdude py-6 text-sm">
          สำนัก/กอง
        </TableHead>
        <TableHead className="w-35 font-normal text-subdude py-6 text-left text-sm">
          เงินเดือน
        </TableHead>
        <TableHead className="w-38.5 font-normal text-subdude py-6 text-left text-sm">
          ฐานในการคำนวณ
        </TableHead>

        <TableHead className="w-44 font-normal text-subdude py-6 text-center text-sm">
          คะแนนการประเมิน
        </TableHead>
        <TableHead className="w-34 font-normal text-subdude py-6 text-center text-sm">
          ผลการประเมิน
        </TableHead>

        {/* ส่วนบริหารวงเงิน */}
        <TableHead 
          className={cn(
            "w-48 font-normal py-6 text-center text-sm transition-colors",
            roundtable === 1 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
          )}
        >
          จัดสรรร้อยละรอบที่ 1 (%)
        </TableHead>
        
        {roundtable >= 2 && (
          <TableHead 
            className={cn(
              "w-48 font-normal py-6 text-center text-sm transition-colors",
              roundtable === 2 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
            )}
          >
            จัดสรรร้อยละรอบที่ 2 (%)
          </TableHead>
        )}

        {roundtable >= 3 && (
          <TableHead 
            className={cn(
              "w-48 font-normal py-6 text-center text-sm transition-colors",
              roundtable === 3 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
            )}
          >
            จัดสรรร้อยละรอบที่ 3 (%)
          </TableHead>
        )}

        {/* ส่วนการประเมินของแต่ละระดับ */}
        <TableHead
          className={cn(
            "w-68 font-normal py-6 text-center text-sm transition-colors",
            roundtable === 1 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
          )}
          colSpan={2}
        >
          ผลพิจารณารอบที่ 1
        </TableHead>

        {roundtable >= 2 && (
          <TableHead
            className={cn(
              "w-68 font-normal py-6 text-center text-sm transition-colors",
              roundtable === 2 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
            )}
            colSpan={2}
          >
            ผลพิจารณารอบที่ 2
          </TableHead>
        )}

        {roundtable >= 3 && (
          <TableHead
            className={cn(
              "w-68 font-normal py-6 text-center text-sm transition-colors",
              roundtable === 3 ? "bg-[#FACC15] text-black font-medium" : "text-subdude"
            )}
            colSpan={2}
          >
            ผลพิจารณารอบที่ 3
          </TableHead>
        )}

        <TableHead className="w-51 font-normal text-subdude py-6 text-center text-sm">
          รวมร้อยละที่ได้เลื่อน
        </TableHead>
        <TableHead className="w-34 font-normal text-subdude py-6 text-right text-sm">
          รวมเงินที่ได้เลื่อน
        </TableHead>
        <TableHead className="w-40 font-normal text-subdude py-6 text-right text-sm">
          เงินค่าตอบแทนพิเศษ
        </TableHead>
        <TableHead className="w-33 font-normal text-subdude py-6 text-right text-sm">
          เงินเดือนที่ได้รับ
        </TableHead>
        <TableHead className="w-37 font-normal text-subdude py-6 text-right text-sm">
          เงินประจำตำแหน่ง
        </TableHead>
        <TableHead className="w-30 font-normal text-subdude py-6 text-right text-sm">
          รายได้ที่ได้รับ
        </TableHead>
        <TableHead className="w-25 font-normal text-subdude py-6 text-center text-sm">
          เครื่องมือ
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
