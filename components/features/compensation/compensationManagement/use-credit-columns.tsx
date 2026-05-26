import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";

interface UseCreditColumnsProps {
  onEdit?: (id: any) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  รอพิจารณา: {
    label: "รอพิจารณา",
    color: "bg-[#FFF7ED] text-[#F97316]",
  },

  สำเร็จ: {
    label: "สำเร็จ",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
};

export function useCreditColumns({ onEdit, onDelete }: UseCreditColumnsProps) {
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();
  const c = useTranslations("common");

  // const columns: ColumnDef<CompensationList>[] = useMemo(() => {
  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: "name",
        header: "ชื่อรายการ",
        size: 15,
      },
      {
        accessorKey: "row8",
        header: "จำนวนบุคลากร",
        size: 10,
        cell: ({ row }) => {
          const data = row.original.row8;
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
        accessorKey: "row2",
        header: "เงินเดือนปัจุบันรวม",
        size: 12,
        cell: ({ row }) => {
          const data = row.original.row2;
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
        accessorKey: "row3",
        header: "ประเภทและระดับตำแหน่ง",
        size: 10,
        cell: ({ row }) => {
          const approver = row.original.row3;
          return (
            <div className="flex flex-wrap items-center justify-start gap-2">
              {approver && approver.length > 0
                ? approver.map((item: any, index: number) => (
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
        accessorKey: "row4",
        header: "จัดสรรร้อยละ (%)",
        size: 10,
        cell: ({ row }) => {
          const data = row.original.row4;
          return (
            <h1>
              {data !== undefined && data !== null
                ? `${Number(data).toFixed(2)} %`
                : "-"}
            </h1>
          );
        },
      },
      //     {
      //   accessorKey: "row4",
      //   header: "ผู้อำนวยการสำนัก",
      //   size: 10,
      //   cell: ({ row }) => {
      //     const data = row.original.row4;
      //     return (
      //       <h1>
      //         {data !== undefined && data !== null
      //           ? `${Number(data).toFixed(1)} %`
      //           : "-"}
      //       </h1>
      //     );
      //   },
      // },
      // {
      //   accessorKey: "row5",
      //   header: "รองผู้อำนวยการ",
      //   size: 10,
      //   cell: ({ row }) => {
      //     const data = row.original.row5;
      //     return (
      //       <h1>
      //         {data !== undefined && data !== null
      //           ? `${Number(data).toFixed(1)} %`
      //           : "-"}
      //       </h1>
      //     );
      //   },
      // },
      // {
      //   accessorKey: "row6",
      //   header: "ผู้อำนวยการสำนักบริหารหนี้สิน",
      //   size: 12,
      //   cell: ({ row }) => {
      //     const data = row.original.row6;
      //     return (
      //       <h1>
      //         {data !== undefined && data !== null
      //           ? `${Number(data).toFixed(1)} %`
      //           : "-"}
      //       </h1>
      //     );
      //   },
      // },
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
        accessorKey: "row9",
        header: "ผู้พิจารณา",
        size: 8,
        cell: ({ row }) => {
          const approver = row.original.row9;
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
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(row.original.id)}
                title={c("edit-item")}
                className="text-black hover:text-black"
              >
                <Icon icon="solar:pen-outline" className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(row.original.id)}
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
