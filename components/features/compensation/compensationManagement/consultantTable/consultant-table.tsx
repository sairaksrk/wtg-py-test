"use client";

import React, { useState, useRef, useEffect } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { toastSuccess } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { ConsultantTableHeader } from "./consultant-table-header";
import { ConsultantTableRow } from "./consultant-table-row";

export interface ConsultantData {
  id: string;
  positionNo: string;
  name: string;
  subPosition: string;
  type: string;
  department: string;
  salary: number;
  baseCalculation: number;
  officePercentLimit: number;
  deputyPercentLimit: number;
  directorPercentLimit: number;
  evalScore: number;
  evalResult: string;
  officeEvalPercent: number;
  officeEvalBaht: number;
  deputyEvalPercent: number;
  deputyEvalBaht: number;
  directorEvalPercent: number;
  directorEvalBaht: number;
  totalPercentIncrease: number;
  totalAmountIncrease: number;
  specialCompensation: number;
  receivedSalary: number;
  positionAllowance: number;
  totalIncome: number;
}

interface ConsultantTableProps {
  initialData?: ConsultantData[];
  onUpdate?: (updatedData: ConsultantData[]) => void;
}

const mockConsultants: ConsultantData[] = [
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

export function ConsultantTable({
  initialData,
  onUpdate,
}: ConsultantTableProps) {
  const c = useTranslations("common");
  const [data, setData] = useState<ConsultantData[]>(
    initialData || mockConsultants,
  );
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<ConsultantData | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // เช็คคลิกข้างนอกตาราง ไม่ได้คลิกใน Portal (ปรับให้ใช้กับ Combobox dropdown)
      const isOutsideTable =
        tableRef.current && !tableRef.current.contains(target);
      const isInsidePortal =
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest('[role="listbox"]');

      if (editingRowId && isOutsideTable && !isInsidePortal) {
        handleAutoSave();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingRowId, tempData]);

  const handleEditClick = (row: ConsultantData) => {
    if (editingRowId && editingRowId !== row.id) handleAutoSave();
    setEditingRowId(row.id);
    setTempData({ ...row });
  };

  const handleInputChange = (field: keyof ConsultantData, value: any) => {
    setTempData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAutoSave = () => {
    if (editingRowId && tempData) {
      setData((prev) => {
        const newData = prev.map((item) =>
          item.id === editingRowId ? tempData : item,
        );
        onUpdate?.(newData);
        return newData;
      });
      setEditingRowId(null);
      setTempData(null);
      console.log(tempData);
      toastSuccess(c("successfully"), "บันทึกข้อมูลแถวเรียบร้อยแล้ว");
    }
  };

  return (
    <div ref={tableRef} className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <ConsultantTableHeader />
        <TableBody>
          {data.map((row) => (
            <ConsultantTableRow
              key={row.id}
              row={row}
              isEditing={editingRowId === row.id}
              tempData={tempData}
              onEditClick={handleEditClick}
              onInputChange={handleInputChange}
              onAutoSave={handleAutoSave}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
