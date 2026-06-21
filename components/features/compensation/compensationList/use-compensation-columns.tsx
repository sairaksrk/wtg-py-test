import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
import { CompensationList } from "@/types/compensation";
import { useGetPermissions } from "@/libs/query/master.queries";

interface UseCompensationColumnsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: {
    label: "ฉบับร่าง",
    color: "bg-[#F4F4F5] text-subdude",
  },
  reviewing: {
    label: "อยู่ระหว่างการพิจารณา",
    color: "bg-[#FEFCE8] text-[#FACC15]",
  },
  submitted: {
    label: "นำส่งเอกสาร",
    color: "bg-[#F0F9FF] text-[#0EA5E9]",
  },
  success: {
    label: "เสร็จสิ้น",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
};

export function useCompensationColumns({
  onEdit,
  onDelete,
}: UseCompensationColumnsProps) {
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();
  const c = useTranslations("common");
  const cl = useTranslations("compensation");

  const { data: permissionsData } = useGetPermissions();

  const columns: ColumnDef<CompensationList>[] = useMemo(() => {
    return [
      {
        accessorKey: "createdAt",
        // header: "วันที่สร้าง",
        header: cl("column.created-date"),
        size: 12,
        cell: ({ row }) =>
          formatToBuddhist(
            Number(row.original.createdAt),
            "dd MMM yyyy HH:mm ",
          ),
      },
      {
        accessorKey: "name",
        // header: "ชื่อรายการ",
        header: cl("column.item-name"),
        size: 12,
      },
      {
        accessorKey: "employeeCount",
        // header: "จำนวนบุคลากร",
        header: cl("column.employee-count"),
        size: 12,
      },
      {
        accessorKey: "status",
        // header: "สถานะ",
        header: cl("column.status"),
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
        accessorKey: "approvedBy",
        // header: "ผู้รับผิดชอบ",
        header: cl("column.responsible-person"),
        size: 9,
        cell: ({ row }) => {
          const approver = row.original.approvedBy;
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
        id: "tools",
        // header: "เครื่องมือ",
        header: cl("column.tools"),
        size: 10,
        cell: ({ row }) => {
          const { id, status } = row.original;

          const canViewOnly =
            status === "success" ||
            (status === "submitted" && permissionsData?.isHR === false);

          if (canViewOnly) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/manage-compensation/item-request/${id}`)
                  }
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

              {permissionsData?.isHR && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(id)}
                  title={c("delete-item")}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon
                    icon="solar:trash-bin-trash-outline"
                    className="size-4"
                  />
                </Button>
              )}
            </div>
          );
        },
      },
    ];
  }, [onEdit, onDelete, c, formatToBuddhist, router]);

  return columns;
}
