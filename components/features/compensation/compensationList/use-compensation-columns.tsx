import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
// import { ManpowerRequestList } from "@/types/manpower";

interface UseManpowerColumnsProps {
  onEdit?: (id: any) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ฉบับร่าง: {
    label: "ฉบับร่าง",
    color: "bg-[#F4F4F5] text-subdude",
  },
  รอพิจารณา: {
    label: "รอพิจารณา",
    color: "bg-[#FFF7ED] text-[#F97316]",
  },
  อยู่ระหว่างดำเนินการ: {
    label: "อยู่ระหว่างดำเนินการ",
    color: "bg-[#FEFCE8] text-[#FACC15]",
  },
  เสร็จสิ้น: {
    label: "เสร็จสิ้น",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
};

export function useCompensationColumns({
  onEdit,
  onDelete,
}: UseManpowerColumnsProps) {
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();
  const c = useTranslations("common");
  const m = useTranslations("manpower");

  // const columns: ColumnDef<ManpowerRequestList>[] = useMemo(() => {
  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: "createdAt",
        header: "วันที่สร้าง",
        size: 10,
        // cell: ({ row }) => formatToBuddhist(Number(row.original.createdAt)),
      },
      {
        accessorKey: "itemName",
        header: "ชื่อรายการ",
        size: 12,
      },
      {
        accessorKey: "number",
        header: "จำนวนบุคลากร",
        size: 12,
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
        accessorKey: "approver",
        header: "ผู้อนุมัติ / ตรวจสอบ",
        size: 9,
        cell: ({ row }) => {
          const approver = row.original.approver;
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
        header: m("column-manpower.actions"),
        size: 10,
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <div className="flex items-center gap-2">
              {status === "เสร็จสิ้น" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() =>
                  //   router.push(
                  //     `/manage-compensation/edit/${row.original.id}`,
                  //   )
                  // }
                  title={c("view-item")}
                  className="text-black hover:text-black"
                >
                  <Icon icon="solar:eye-outline" className="size-4" />
                </Button>
              ) : (
                <>
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
                    <Icon
                      icon="solar:trash-bin-trash-outline"
                      className="size-4"
                    />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  }, [onEdit, onDelete, c, formatToBuddhist, router]);

  return columns;
}
