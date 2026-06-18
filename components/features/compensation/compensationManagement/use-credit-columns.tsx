import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
import { CompensationGroup } from "@/types/compensation";
import { useGetPermissions } from "@/libs/query/master.queries";

interface UseCreditColumnsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: {
    label: "ฉบับร่าง",
    color: "bg-[#F4F4F5] text-subdude",
  },
  pending: {
    label: "รอพิจารณา",
    color: "bg-[#FFF7ED] text-[#F97316]",
  },
  reviewing: {
    label: "รอพิจารณา",
    color: "bg-[#FFF7ED] text-[#F97316]",
  },
  success: {
    label: "สำเร็จ",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
};

export function useCreditColumns({
  onEdit,
  onDelete,
  onView,
}: UseCreditColumnsProps) {
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();
  const c = useTranslations("common");

  const { data: permissionsData } = useGetPermissions();

  const columns: ColumnDef<CompensationGroup>[] = useMemo(() => {
    return [
      {
        accessorKey: "name",
        header: "ชื่อรายการ",
        size: 15,
      },
      {
        accessorKey: "employeeCount",
        header: "จำนวนบุคลากร",
        size: 10,
        cell: ({ row }) => {
          const data = row.original.employeeCount;
          return (
            <h1>
              {data !== undefined && data !== null
                ? Number(data).toLocaleString("en-US")
                : "-"}
            </h1>
          );
        },
      },
      {
        accessorKey: "totalSalary",
        header: "เงินเดือนปัจุบันรวม",
        size: 12,
        cell: ({ row }) => {
          const data = row.original.totalSalary;
          return (
            <h1>
              {data !== undefined && data !== null
                ? Number(data).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "-"}
            </h1>
          );
        },
      },
      {
        accessorKey: "positionLevelNames",
        header: "ประเภทและระดับตำแหน่ง",
        size: 10,
        cell: ({ row }) => {
          const approver = row.original.positionLevelNames;
          return (
            <div className="flex flex-wrap items-center justify-start gap-2">
              {approver && approver.length > 0
                ? approver.map((item: string, index: number) => (
                    <Badge
                      key={index}
                      className="text-sm font-normal"
                      variant="outline"
                    >
                      {item}
                    </Badge>
                  ))
                : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "allocPercent",
        header: "จัดสรรร้อยละ (%)",
        size: 10,
        cell: ({ row }) => {
          const data = row.original.allocPercent;

          if (data === undefined || data === null || data === "") {
            return <h1>-</h1>;
          }

          const strVal = String(data);

          // หากมีเครื่องหมายสแลช (/) ให้แสดงผลตรงๆ ตัวตามที่หลังบ้านส่งมาเลย
          if (strVal.includes("/")) {
            return <h1>{strVal} %</h1>;
          }

          // กรณีปกติที่เป็นตัวเลขเดี่ยว ๆ ให้จัดรูปแบบทศนิยม 2 ตำแหน่ง
          const num = parseFloat(strVal);
          return <h1>{isNaN(num) ? strVal : `${num.toFixed(2)} %`}</h1>;
        },
      },
      {
        accessorKey: "status",
        header: "สถานะ",
        size: 5,
        cell: ({ row }) => {
          const status = row.original.status;
          const currentStatus = statusConfig[
            status as keyof typeof statusConfig
          ] || { label: "-", color: "bg-gray-100 text-gray-400" };
          return (
            <Badge
              className={cn(
                "flex items-center gap-2 text-sm font-normal",
                currentStatus.color,
              )}
              variant="secondary"
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {currentStatus.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "reviewerName",
        header: "ผู้พิจารณา",
        size: 8,
        cell: ({ row }) => {
          const approver = row.original.reviewerName;
          return (
            <>
              {approver ? (
                <Badge className="text-sm font-normal" variant="secondary">
                  {approver}
                </Badge>
              ) : (
                "-"
              )}
            </>
          );
        },
      },
      {
        id: "actions",
        header: "เครื่องมือ",
        size: 8,
        cell: ({ row }) => {
          const { id, status } = row.original;

          const canViewOnly =
            status === "success" || permissionsData?.isHR === false;

          if (canViewOnly) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView?.(row.original.id)}
                  title={c("view-item")}
                  className="text-black hover:text-black"
                >
                  <Icon icon="solar:eye-outline" className="size-4" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(id)}
                title={c("edit-item")}
                className="text-black hover:text-black"
              >
                <Icon icon="solar:pen-outline" className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(id)}
                title={c("delete-item")}
                className="text-destructive hover:text-destructive"
              >
                <Icon icon="solar:trash-bin-trash-outline" className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [onEdit, onDelete, c, formatToBuddhist, router]);

  return columns;
}
