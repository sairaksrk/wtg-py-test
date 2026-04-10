"use client";

import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ConsultantTableHeader() {
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

        {/* ส่วนบริหารวงเงิน */}
        <TableHead className="w-39 font-normal text-subdude py-6 text-center text-sm">
          บริหารวงเงิน <br></br> สำนักร้อยละ (%)
        </TableHead>
        <TableHead className="w-39 font-normal text-subdude py-6 text-center text-sm">
          บริหารวงเงิน <br></br> รองร้อยละ (%)
        </TableHead>
        <TableHead className="w-44 font-normal text-subdude py-6 text-center text-sm">
          บริหารวงเงิน <br></br> ผู้อำนวยการร้อยละ (%)
        </TableHead>

        <TableHead className="w-44 font-normal text-subdude py-6 text-center text-sm">
          คะแนนการประเมิน
        </TableHead>
        <TableHead className="w-34 font-normal text-subdude py-6 text-center text-sm">
          ผลการประเมิน
        </TableHead>

        {/* ส่วนการประเมินของแต่ละระดับ */}
        <TableHead
          className="w-68 font-normal text-subdude py-6 text-center text-sm"
          colSpan={2}
        >
          สำนักประเมิน
        </TableHead>
        <TableHead
          className="w-72 font-normal text-subdude py-6 text-center text-sm"
          colSpan={2}
        >
          รองผู้อำนวยการ
        </TableHead>
        <TableHead
          className="w-72 font-normal text-subdude py-6 text-center text-sm"
          colSpan={2}
        >
          ผู้อำนวยการสำนักบริหารหนี้สิน
        </TableHead>

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
