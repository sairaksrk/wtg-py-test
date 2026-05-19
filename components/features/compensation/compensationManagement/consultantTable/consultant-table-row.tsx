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

  const formatNum = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleNumberChange = (field: keyof ConsultantData, value: string) => {
    const parsed = value === "" ? 0 : parseFloat(value);
    onInputChange(field, isNaN(parsed) ? 0 : parsed);
  };
  // ฟังก์ชัน"บริหารวงเงิน"
  const handleLimitChange = (
    field: "officePercentLimit" | "deputyPercentLimit" | "directorPercentLimit",
    value: string,
  ) => {
    // 1. อนุญาตให้พิมพ์ตัวเลขและจุดทศนิยมเพียงจุดเดียว
    const cleanValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    if (cleanValue === "" || cleanValue === ".") {
      onInputChange(field, cleanValue);
      return;
    }

    const parsed = parseFloat(cleanValue);
    if (isNaN(parsed)) return;

    // 2. ตรวจสอบผลรวมของช่องอื่นในกลุ่มเดียวกัน
    const otherFields = (
      [
        "officePercentLimit",
        "deputyPercentLimit",
        "directorPercentLimit",
      ] as const
    ).filter((f) => f !== field);

    const otherSum = otherFields.reduce(
      (sum, f) => sum + (parseFloat(String(displayRow[f])) || 0),
      0,
    );

    // 3. คำนวณค่าสูงสุดที่ยอมให้กรอกได้ (ต้องไม่เกิน 3 และรวมกับช่องอื่นต้องไม่เกิน 3)
    const maxAllowed = Math.max(0, 3 - otherSum);

    if (parsed > maxAllowed) {
      // ถ้าเกิน ให้ปัดลงมาที่ค่าสูงสุดที่ยอมรับได้
      onInputChange(field, maxAllowed.toString());
    } else {
      // ถ้าไม่เกิน ให้เก็บค่าเป็น string ไว้ก่อนเพื่อให้พิมพ์จุดทศนิยมต่อได้
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

      {/* บริหารวงเงิน สำนักร้อยละ (%) */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.officePercentLimit}
            onChange={(e) =>
              handleLimitChange("officePercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.officePercentLimit}
          </div>
        )}
      </TableCell>
      {/* บริหารวงเงิน รองร้อยละ (%) */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.deputyPercentLimit}
            onChange={(e) =>
              handleLimitChange("deputyPercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.deputyPercentLimit}
          </div>
        )}
      </TableCell>
      {/* บริหารวงเงิน ผู้อำนวยการร้อยละ (%) */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.directorPercentLimit}
            onChange={(e) =>
              handleLimitChange("directorPercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.directorPercentLimit}
          </div>
        )}
      </TableCell>

      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            value={displayRow.evalScore}
            onChange={(e) => handleNumberChange("evalScore", e.target.value)}
            thousandSeparator
            className="h-11 rounded-xl"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.evalScore}
          </div>
        )}
      </TableCell>
      {/* <TableCell className="py-5 text-center text-foreground">
        {row.evalScore}
      </TableCell> */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Combobox
            value={displayRow.evalResult}
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
            {row.evalResult}
          </div>
        )}
      </TableCell>

      {/* สำนักประเมิน */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.officeEvalPercent}
            onChange={(e) =>
              handleNumberChange("officeEvalPercent", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">{row.officeEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.officeEvalBaht}
            onChange={(e) =>
              handleNumberChange("officeEvalBaht", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.officeEvalBaht)}</div>
        )}
      </TableCell>

      {/* รองผู้อำนวยการ */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.deputyEvalPercent}
            onChange={(e) =>
              handleNumberChange("deputyEvalPercent", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">{row.deputyEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.deputyEvalBaht}
            onChange={(e) =>
              handleNumberChange("deputyEvalBaht", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.deputyEvalBaht)}</div>
        )}
      </TableCell>

      {/* ผู้อำนวยการสำนักบริหารหนี้สิน */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.directorEvalPercent}
            onChange={(e) =>
              handleNumberChange("directorEvalPercent", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="%" />}
          />
        ) : (
          <div className="text-center">{row.directorEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <Input
            value={displayRow.directorEvalBaht}
            onChange={(e) =>
              handleNumberChange("directorEvalBaht", e.target.value)
            }
            thousandSeparator
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.directorEvalBaht)}</div>
        )}
      </TableCell>

      <TableCell className="py-5 text-center text-foreground">
        {row.totalPercentIncrease}%
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.totalAmountIncrease)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.specialCompensation)}
      </TableCell>
      <TableCell className="py-5 text-left text-foreground">
        {formatNum(row.receivedSalary)}
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
