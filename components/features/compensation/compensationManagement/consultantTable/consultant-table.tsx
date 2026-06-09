"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { ConsultantTableHeader } from "./consultant-table-header";
import { ConsultantTableRow } from "./consultant-table-row";

// MOCKUP ROUNDTABLE 1, 2, หรือ 3
const roundtable = 1;

export interface ConsultantData {
  id: string;
  employeeId?: string;
  positionNo: string; // mapped from positionNumber
  name: string; // mapped from fullNameTh
  subPosition: string; // mapped from positionName
  type: string; // mapped from employeeTypeName
  department: string; // mapped from unitName
  salary: number; // mapped from currentSalary
  baseCalculation: number; // mapped from calculationBase
  evalScore: number; // mapped from evaluationScore
  evalResult: string; // mapped from evaluationResult
  allocQuotaPercentRound1: string | number;
  allocQuotaPercentRound2: string | number;
  allocQuotaPercentRound3: string | number;
  allocPercentRound1: string | number;
  allocAmountRound1: number | string;
  allocPercentRound2: string | number;
  allocAmountRound2: number | string;
  allocPercentRound3: string | number;
  allocAmountRound3: number | string;
  totalIncrementPercent: number;
  totalIncrementAmount: number;
  extraCompensation: number;
  newSalary: number;
  positionAllowance: number;
  totalIncome: number;
}

interface ConsultantTableProps {
  data: ConsultantData[];
  onUpdate: (updatedData: ConsultantData[]) => void;
  onSaveRow?: (
    row: ConsultantData,
    originalRow: ConsultantData,
  ) => Promise<void>;
  readOnly?: boolean;
}

export function ConsultantTable({
  data,
  onUpdate,
  onSaveRow,
  readOnly = false,
}: ConsultantTableProps) {
  const c = useTranslations("common");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<ConsultantData | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // ซิงค์ข้อมูลจาก API (data) เข้าสู่ tempData เมื่อหลังบ้านคำนวณเสร็จและส่งค่ากลับมา
  useEffect(() => {
    if (editingRowId && data) {
      const latestRow = data.find((item) => item.id === editingRowId);
      if (latestRow) {
        setTempData((prev) => {
          if (!prev) return null;
          const merged = { ...latestRow };
          if (activeField && activeField in prev) {
            (merged as any)[activeField] = (prev as any)[activeField];
          }
          return merged;
        });
      }
    }
  }, [data, editingRowId, activeField]);

  const handleAutoSave = useCallback(
    async (nextRow?: ConsultantData) => {
      if (readOnly) return;
      if (editingRowId && tempData) {
        const originalRow = data.find((item) => item.id === editingRowId);
        const newData = data.map((item) =>
          item.id === editingRowId ? tempData : item,
        );

        onUpdate(newData);

        const currentTempData = tempData;
        const currentEditingRowId = editingRowId;

        // สลับไปแถวใหม่ทันที (ถ้ามี) ป้องกันการเคลียร์ State ซ้อนทับกัน
        if (nextRow) {
          setEditingRowId(nextRow.id);
          setTempData({ ...nextRow });
          setActiveField(null);
        } else {
          setEditingRowId(null);
          setTempData(null);
          setActiveField(null);
        }

        if (onSaveRow && originalRow) {
          try {
            await onSaveRow(currentTempData, originalRow);
          } catch (err) {
            console.error("Failed to save row:", err);
          }
        }
      }
    },
    [editingRowId, tempData, data, onUpdate, onSaveRow, readOnly],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!editingRowId || readOnly) return;

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
  }, [editingRowId, handleAutoSave, readOnly]);

  const handleEditClick = (row: ConsultantData) => {
    if (readOnly) return;
    if (editingRowId && editingRowId !== row.id) {
      handleAutoSave(row);
    } else {
      setEditingRowId(row.id);
      setTempData({ ...row });
      setActiveField(null);
    }
  };

  const handleInputChange = (field: keyof ConsultantData, value: any) => {
    if (readOnly) return;
    setActiveField(field as string);
    let updatedRow = tempData ? { ...tempData, [field]: value } : null;

    if (updatedRow) {
      // เคลียร์ค่า เพื่อไม่ให้ค่าเก่าค้างส่งไปยัง API
      if (
        field === "allocPercentRound1" ||
        field === "allocQuotaPercentRound1"
      ) {
        updatedRow.allocAmountRound1 = "";
      } else if (field === "allocAmountRound1") {
        updatedRow.allocPercentRound1 = "";
        updatedRow.allocQuotaPercentRound1 = "";
      }

      if (
        field === "allocPercentRound2" ||
        field === "allocQuotaPercentRound2"
      ) {
        updatedRow.allocAmountRound2 = "";
      } else if (field === "allocAmountRound2") {
        updatedRow.allocPercentRound2 = "";
        updatedRow.allocQuotaPercentRound2 = "";
      }

      if (
        field === "allocPercentRound3" ||
        field === "allocQuotaPercentRound3"
      ) {
        updatedRow.allocAmountRound3 = "";
      } else if (field === "allocAmountRound3") {
        updatedRow.allocPercentRound3 = "";
        updatedRow.allocQuotaPercentRound3 = "";
      }

      setTempData(updatedRow);

      const newData = data.map((item) =>
        item.id === editingRowId ? updatedRow! : item,
      );
      onUpdate(newData);
    }
  };

  return (
    <div ref={tableRef} className="w-full overflow-x-auto">
      <Table className="w-full table-fixed">
        <ConsultantTableHeader roundtable={roundtable} />
        <TableBody>
          {data.map((row) => (
            <ConsultantTableRow
              key={row.id}
              row={row}
              isEditing={editingRowId === row.id}
              tempData={tempData}
              onEditClick={handleEditClick}
              onInputChange={handleInputChange}
              onAutoSave={() => handleAutoSave()}
              readOnly={readOnly}
              roundtable={roundtable}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}