"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  data: ConsultantData[];
  onUpdate: (updatedData: ConsultantData[]) => void;
}

export function ConsultantTable({ data, onUpdate }: ConsultantTableProps) {
  const c = useTranslations("common");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<ConsultantData | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleAutoSave = useCallback(() => {
    if (editingRowId && tempData) {
      const newData = data.map((item) =>
        item.id === editingRowId ? tempData : item,
      );

      // อัปเดตข้อมูลกลับไปยัง Parent
      onUpdate(newData);

      // Reset สถานะแก้ไข
      setEditingRowId(null);
      setTempData(null);

      toastSuccess(c("successfully"), "บันทึกข้อมูลแถวเรียบร้อยแล้ว");
    }
  }, [editingRowId, tempData, data, onUpdate, c]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!editingRowId) return;

      const isOutsideTable =
        tableRef.current && !tableRef.current.contains(target);
      const isInsidePortal =
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest('[role="listbox"]');

      if (isOutsideTable && !isInsidePortal) {
        handleAutoSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingRowId, handleAutoSave]);

  const handleEditClick = (row: ConsultantData) => {
    if (editingRowId && editingRowId !== row.id) {
      handleAutoSave();
    }
    setEditingRowId(row.id);
    setTempData({ ...row });
  };

  const handleInputChange = (field: keyof ConsultantData, value: any) => {
    setTempData((prev) => (prev ? { ...prev, [field]: value } : null));
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
