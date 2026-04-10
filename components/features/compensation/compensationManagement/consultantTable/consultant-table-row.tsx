"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/utils/helpers";
import { ConsultantData } from "./consultant-table";

interface ConsultantTableRowProps {
  row: ConsultantData;
  isEditing: boolean;
  tempData: ConsultantData | null;
  onEditClick: (row: ConsultantData) => void;
  onInputChange: (field: keyof ConsultantData, value: any) => void;
  onAutoSave: () => void;
}

export function ConsultantTableRow({
  row,
  isEditing,
  tempData,
  onEditClick,
  onInputChange,
  onAutoSave,
}: ConsultantTableRowProps) {
  // ใช้ข้อมูลชั่วคราวถ้ากำลังแก้ไขอยู่ ถ้าไม่ใช้ข้อมูลจริง
  const displayRow = isEditing ? tempData! : row;

  // ฟังก์ชันช่วยจัดรูปแบบตัวเลข
  const formatNum = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <TableRow
      onDoubleClick={() => onEditClick(row)}
      className={cn(
        "border-b text-base",
        isEditing ? "bg-blue-50/30" : "", // ไฮไลท์แถวที่กำลังแก้ไข
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
            value={displayRow.officePercentLimit}
            onChange={(e) =>
              onInputChange("officePercentLimit", parseFloat(e.target.value))
            }
            className="h-11 text-center bg-white border-gray-200 rounded-xl"
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
            value={displayRow.deputyPercentLimit}
            onChange={(e) =>
              onInputChange("deputyPercentLimit", parseFloat(e.target.value))
            }
            className="h-11 text-center bg-white border-gray-200 rounded-xl"
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
            value={displayRow.directorPercentLimit}
            onChange={(e) =>
              onInputChange("directorPercentLimit", parseFloat(e.target.value))
            }
            className="h-11 text-center bg-white border-gray-200 rounded-xl"
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
          <Select
            value={displayRow.evalResult}
            options={[
              { label: "ดีเด่น", value: "ดีเด่น" },
              { label: "ดีมาก", value: "ดีมาก" },
              { label: "ดี", value: "ดี" },
            ]}
            onChange={(e) => onInputChange("evalResult", e.target.value)}
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
          <div className="relative">
            <Input
              type="number"
              value={displayRow.officeEvalPercent}
              onChange={(e) =>
                onInputChange("officeEvalPercent", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              %
            </span>
          </div>
        ) : (
          <div className="text-center">{row.officeEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <div className="relative">
            <Input
              type="number"
              value={displayRow.officeEvalBaht}
              onChange={(e) =>
                onInputChange("officeEvalBaht", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              ฿
            </span>
          </div>
        ) : (
          <div className="text-center">{row.officeEvalBaht.toFixed(2)}</div>
        )}
      </TableCell>

      {/* รองผู้อำนวยการ */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <div className="relative">
            <Input
              type="number"
              value={displayRow.deputyEvalPercent}
              onChange={(e) =>
                onInputChange("deputyEvalPercent", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              %
            </span>
          </div>
        ) : (
          <div className="text-center">{row.deputyEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <div className="relative">
            <Input
              type="number"
              value={displayRow.deputyEvalBaht}
              onChange={(e) =>
                onInputChange("deputyEvalBaht", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              ฿
            </span>
          </div>
        ) : (
          <div className="text-center">{row.deputyEvalBaht.toFixed(2)}</div>
        )}
      </TableCell>

      {/* ผู้อำนวยการสำนักบริหารหนี้สิน */}
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <div className="relative">
            <Input
              type="number"
              value={displayRow.directorEvalPercent}
              onChange={(e) =>
                onInputChange("directorEvalPercent", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              %
            </span>
          </div>
        ) : (
          <div className="text-center">{row.directorEvalPercent} %</div>
        )}
      </TableCell>
      <TableCell className="py-5 px-1.5">
        {isEditing ? (
          <div className="relative">
            <Input
              type="number"
              value={displayRow.directorEvalBaht}
              onChange={(e) =>
                onInputChange("directorEvalBaht", parseFloat(e.target.value))
              }
              className="h-11 pr-7 text-center rounded-xl"
            />
            <span className="absolute left-3 top-3 text-sm text-subdude">
              ฿
            </span>
          </div>
        ) : (
          <div className="text-center">{row.directorEvalBaht.toFixed(2)}</div>
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
