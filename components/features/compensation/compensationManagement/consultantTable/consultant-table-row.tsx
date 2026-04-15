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

// คอมโพเนนต์สัญลักษณ์ในวงกลมเทาของ Input
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

  const safeValue = (val: any) => {
    if (val === null || val === undefined || Number.isNaN(val)) return "";
    return val;
  };

  const handleNumberChange = (field: keyof ConsultantData, value: string) => {
    if (value === "") {
      onInputChange(field, 0);
    } else {
      const parsed = parseFloat(value);
      onInputChange(field, isNaN(parsed) ? 0 : parsed);
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

      {/* ส่วนบริหารวงเงิน */}
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            type="number"
            value={safeValue(displayRow.officePercentLimit)}
            onChange={(e) =>
              handleNumberChange("officePercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.officePercentLimit}
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            type="number"
            value={safeValue(displayRow.deputyPercentLimit)}
            onChange={(e) =>
              handleNumberChange("deputyPercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.deputyPercentLimit}
          </div>
        )}
      </TableCell>
      <TableCell className="py-5 px-3">
        {isEditing ? (
          <Input
            type="number"
            value={safeValue(displayRow.directorPercentLimit)}
            onChange={(e) =>
              handleNumberChange("directorPercentLimit", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
          />
        ) : (
          <div className="h-11 flex items-center justify-center">
            {row.directorPercentLimit}
          </div>
        )}
      </TableCell>

      <TableCell className="py-5 text-center text-foreground">
        {row.evalScore}
      </TableCell>
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
            type="number"
            value={safeValue(displayRow.officeEvalPercent)}
            onChange={(e) =>
              handleNumberChange("officeEvalPercent", e.target.value)
            }
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
            type="number"
            value={safeValue(displayRow.officeEvalBaht)}
            onChange={(e) =>
              handleNumberChange("officeEvalBaht", e.target.value)
            }
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
            type="number"
            value={safeValue(displayRow.deputyEvalPercent)}
            onChange={(e) =>
              handleNumberChange("deputyEvalPercent", e.target.value)
            }
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
            type="number"
            value={safeValue(displayRow.deputyEvalBaht)}
            onChange={(e) =>
              handleNumberChange("deputyEvalBaht", e.target.value)
            }
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
            type="number"
            value={safeValue(displayRow.directorEvalPercent)}
            onChange={(e) =>
              handleNumberChange("directorEvalPercent", e.target.value)
            }
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
            type="number"
            value={safeValue(displayRow.directorEvalBaht)}
            onChange={(e) =>
              handleNumberChange("directorEvalBaht", e.target.value)
            }
            className="h-11 rounded-xl"
            iconPosition="right"
            icon={<SymbolBadge symbol="฿" />}
          />
        ) : (
          <div className="text-center">{formatNum(row.directorEvalBaht)}</div>
          // <div className="text-center">{row.directorEvalBaht.toFixed(2)}</div>
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
