"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/helpers";
import { ConsultantData } from "./consultant-table";
import { Combobox } from "@/components/common/combobox";

interface ConsultantTableRowProps {
  row: ConsultantData;
  isEditing: boolean;
  tempData: ConsultantData | null;
  onEditClick: (row: ConsultantData) => void;
  onInputChange: (field: keyof ConsultantData, value: any) => void;
  onAutoSave: () => void;
}

const SymbolBadge = ({ symbol }: { symbol: string }) => (
  <div className="flex items-center justify-center size-7 rounded-full bg-[#F4F4F5] text-[#71717A] text-xs font-medium">
    {symbol}
  </div>
);

export function ConsultantTableRow({
  row,
  isEditing,
  tempData,
  onEditClick,
  onInputChange,
  onAutoSave,
}: ConsultantTableRowProps) {
  const displayRow = isEditing ? tempData! : row;

  // จัดรูปแบบจำนวนเงิน (ทศนิยม 2 ตำแหน่ง)
  const formatNum = (val: any) => {
    if (val === undefined || val === null || val === "" || isNaN(Number(val))) return "0.00";
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // จัดรูปแบบเปอร์เซ็นต์
  const formatPercent = (val: any) => {
    if (val === undefined || val === null || val === "" || isNaN(Number(val))) return "0";
    const num = Number(val);
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  // ฟังก์ชันจัดการการเปลี่ยนค่าตัวเลขที่รับมาจาก Input (ซึ่งล้างคอมม่ามาให้แล้ว)
  const handleNumberChange = (field: keyof ConsultantData, value: string) => {
    onInputChange(field, value);
  };

  // ฟังก์ชันจัดการการเปลี่ยนค่าเปอร์เซ็นต์ (เก็บเป็น string เพื่อให้พิมพ์จุดทศนิยมได้สะดวก)
  const handlePercentStringChange = (field: keyof ConsultantData, value: string) => {
    // อนุญาตให้พิมพ์ตัวเลขและจุดทศนิยมเพียงจุดเดียว
    const cleanValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    onInputChange(field, cleanValue);
  };

  // ฟังก์ชันควบคุมโควตาจัดสรรร้อยละ (รวมกัน 3 รอบต้องไม่เกิน 3%)
  const handleLimitChange = (
    field: "allocPercentRound1" | "allocPercentRound2" | "allocPercentRound3",
    value: string,
  ) => {
    const cleanValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    if (cleanValue === "" || cleanValue === ".") {
      onInputChange(field, cleanValue);
      return;
    }

    const parsed = parseFloat(cleanValue);
    if (isNaN(parsed)) return;

    const otherFields = (
      [
        "allocPercentRound1",
        "allocPercentRound2",
        "allocPercentRound3",
      ] as const
    ).filter((f) => f !== field);

    const otherSum = otherFields.reduce(
      (sum, f) => sum + (parseFloat(String(displayRow[f])) || 0),
      0,
    );

    const maxAllowed = Math.max(0, 3 - otherSum);

    if (parsed > maxAllowed) {
      onInputChange(field, maxAllowed.toString());
    } else {
      onInputChange(field, cleanValue);
    }
  };

  return (
    <TableRow
      onDoubleClick={() => onEditClick(row)}
      className={cn(
        "border-b text-base transition-colors",
        isEditing ? "bg-blue-50/30" : "hover:bg-gray-50/30",
      )}
    >
      <TableCell className="py-5 text-foreground">{row.positionNo}</TableCell>
      <TableCell className="py-5">
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-base">
            {row.name}
          </span>
          <span className="text-sm text-subdude">{row.subPosition}</span>
        </div>
      </TableCell>
      <TableCell className="py-5 text-foreground">{row.type}</TableCell>
      <TableCell className="py-5 text-foreground">{row.department}</TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.salary)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.baseCalculation)}
      </TableCell>

      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.evalScore ?? ""}
            onChange={(e) => handleNumberChange("evalScore", e.target.value)}
            thousandSeparator
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.evalScore ?? "-"}
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Combobox
            value={displayRow.evalResult ?? ""}
            valueType="string"
            options={[
              { label: "เลือก", value: "เลือก" },
              { label: "ดีเด่น", value: "ดีเด่น" },
              { label: "ดีมาก", value: "ดีมาก" },
              { label: "ดี", value: "ดี" },
            ]}
            onChange={(val) => onInputChange("evalResult", val)}
            className="h-11"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.evalResult ?? "-"}
          </div>
        )}
      </TableCell>

      {/* จัดสรรร้อยละรอบที่ 1 (%) - คอลัมน์ 9 */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.allocPercentRound1 ?? ""}
            onChange={(e) =>
              handleLimitChange("allocPercentRound1", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {formatPercent(row.allocPercentRound1)}
          </div>
        )}
      </TableCell>
      {/* จัดสรรร้อยละรอบที่ 2 (%) */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.allocPercentRound2 ?? ""}
            onChange={(e) =>
              handleLimitChange("allocPercentRound2", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {formatPercent(row.allocPercentRound2)}
          </div>
        )}
      </TableCell>
      {/* จัดสรรร้อยละรอบที่ 3 (%) */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.allocPercentRound3 ?? ""}
            onChange={(e) =>
              handleLimitChange("allocPercentRound3", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {formatPercent(row.allocPercentRound3)}
          </div>
        )}
      </TableCell>

      {/* ผลพิจารณารอบที่ 1 - คอลัมน์ 10 */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocQuotaPercentRound1 ?? ""}
            onChange={(e) =>
              handlePercentStringChange("allocQuotaPercentRound1", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">
            {formatPercent(row.allocQuotaPercentRound1)} %
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocAmountRound1 ?? ""}
            onChange={(e) =>
              handleNumberChange("allocAmountRound1", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.allocAmountRound1)}</div>
        )}
      </TableCell>

      {/* ผลพิจารณารอบที่ 2 */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocQuotaPercentRound2 ?? ""}
            onChange={(e) =>
              handlePercentStringChange("allocQuotaPercentRound2", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">
            {formatPercent(row.allocQuotaPercentRound2)} %
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocAmountRound2 ?? ""}
            onChange={(e) =>
              handleNumberChange("allocAmountRound2", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.allocAmountRound2)}</div>
        )}
      </TableCell>

      {/* ผลพิจารณารอบที่ 3 */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocQuotaPercentRound3 ?? ""}
            onChange={(e) =>
              handlePercentStringChange("allocQuotaPercentRound3", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">
            {formatPercent(row.allocQuotaPercentRound3)} %
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.allocAmountRound3 ?? ""}
            onChange={(e) =>
              handleNumberChange("allocAmountRound3", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.allocAmountRound3)}</div>
        )}
      </TableCell>

      <TableCell className="py-5 text-center text-foreground">
        {formatPercent(row.totalIncrementPercent)}%
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.totalIncrementAmount)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.extraCompensation)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.newSalary)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.positionAllowance)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.totalIncome)}
      </TableCell>

      <TableCell className="py-5 text-center">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAutoSave}
            className="text-[#84CC16] hover:bg-transparent"
          >
            <Icon icon="lucide:check" className="size-6" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(row)}
            className="text-foreground hover:bg-gray-100 rounded-full"
          >
            <Icon icon="solar:pen-outline" className="size-5" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}