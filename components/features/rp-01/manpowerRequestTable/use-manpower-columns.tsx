import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useRouter } from "@/i18n/navigation";
import { InfoHoverCard } from "./info-hover-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
import { ManpowerRequestList } from "@/types/compensation";

interface UseManpowerColumnsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const mockupNumberOfRequest = {
  data: [
    {
      id: 1,
      name: "นักวิชาการคลัง",
      level: "ระดับปฏิบัติการ/ชำนาญการ",
      quantity: 2,
    },
    {
      id: 2,
      name: "เศรษฐกร 1",
      level: "ระดับปฏิบัติการ/ชำนาญการ",
      quantity: 2,
    },
    {
      id: 3,
      name: "เศรษฐกร 2",
      level: "ระดับปฏิบัติการ/ชำนาญการ",
      quantity: 2,
    },
    {
      id: 4,
      name: "เศรษฐกร 3",
      level: "ระดับปฏิบัติการ/ชำนาญการ",
      quantity: 2,
    },
    {
      id: 5,
      name: "เศรษฐกร 4",
      level: "ระดับปฏิบัติการ/ชำนาญการ",
      quantity: 2,
    },
  ],
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ฉบับร่าง: {
    label: "ฉบับร่าง",
    color: "bg-[#F4F4F5] text-subdude",
  },
  รอตรวจสอบ: {
    label: "รอตรวจสอบ",
    color: "bg-[#FEFCE8] text-[#FACC15]",
  },
  ยกเลิกรายการ: {
    label: "ยกเลิกรายการ",
    color: "bg-[#FEF2F2] text-destructive",
  },
  อยู่ระหว่างดำเนินการ: {
    label: "อยู่ระหว่างดำเนินการ",
    color: "bg-[#FFF7ED] text-[#F97316]",
  },
  อนุมัติ: {
    label: "อนุมัติ",
    color: "bg-[#F0FDF4] text-[#16A34A]",
  },
  ไม่อนุมัติ: {
    label: "ไม่อนุมัติ",
    color: "bg-[#FEF2F2] text-destructive",
  },
};

export function useManpowerColumns({
  onEdit,
  onDelete,
}: UseManpowerColumnsProps) {
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();
  const c = useTranslations("common");
  const m = useTranslations("manpower");

  const columns: ColumnDef<ManpowerRequestList>[] = useMemo(() => {
    return [
      {
        accessorKey: "requestNo",
        header: m("column-manpower.request-number"),
        size: 12,
      },
      {
        accessorKey: "createdAt",
        header: m("column-manpower.submission-date"),
        size: 10,
        cell: ({ row }) => formatToBuddhist(Number(row.original.createdAt)),
      },
      {
        accessorKey: "agency",
        header: m("column-manpower.agency"),
        size: 10,
        cell: ({ row }) => {
          const agency = row.original.agency;
          return <h1>{agency ?? "-"}</h1>;
        },
      },

      {
        accessorKey: "totalAmount",
        header: m("column-manpower.number-of-requests"),
        size: 12,
        cell: ({ row }) =>
          row.original.totalAmount ? (
            <div className="flex items-center gap-1.5">
              {row.original.totalAmount} {m("rate")}
              {row.original.totalAmount > 0 && (
                <InfoHoverCard data={mockupNumberOfRequest?.data} />
              )}
            </div>
          ) : (
            <div>-</div>
          ),
      },
      {
        accessorKey: "numberOfAmount",
        header: m("column-manpower.number-of-amount"),
        size: 12,
        cell: ({ row }) =>
          // row.original.numberOfAmount !== null ? (
          row.original.numberOfAmount ? (
            <div className="flex items-center gap-1.5">
              {row.original.numberOfAmount} {m("rate")}
              {row.original.numberOfAmount > 0 && (
                <InfoHoverCard data={mockupNumberOfRequest?.data} />
              )}
            </div>
          ) : (
            <div>-</div>
          ),
      },
      {
        accessorKey: "userStatus",
        header: m("column-manpower.status"),
        size: 5,
        cell: ({ row }) => {
          const status = row.original.userStatus;
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
        accessorKey: "responsiblePerson",
        header: m("column-manpower.responsible-person"),
        size: 9,
        cell: ({ row }) => {
          const responsiblePerson = row.original.responsiblePerson;
          return (
            <>
              {responsiblePerson ? (
                <Badge className="text-sm font-normal" variant="secondary">
                  {responsiblePerson}
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
          const status = row.original.userStatus;

          return (
            <div className="flex items-center gap-2">
              {status !== "ฉบับร่าง" && status !== "รอตรวจสอบ" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(
                      `/create-request/detail-request-information/${row.original.id}`,
                    )
                  }
                  title={c("view-item")}
                  className="text-black hover:text-black"
                >
                  <Icon icon="solar:eye-outline" className="size-4" />
                </Button>
              )}

              {status === "ฉบับร่าง" ? (
                // Status ฉบับร่าง -> Click ไปหน้า เพิ่มข้อมูลคำขออัตรากำลัง
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(
                      `/create-request/add-request-information/${row.original.id}`,
                    )
                  }
                  //  onClick={() => onEdit?.(row.original.id)}
                  title={c("edit-item")}
                  className="text-black hover:text-black"
                >
                  <Icon icon="solar:pen-outline" className="size-4" />
                </Button>
              ) : status === "รอตรวจสอบ" ? (
                // Status รอตรวจสอบ -> Click ไปหน้า รายละเอียดข้อมูลคำขอเพิ่มอัตรากำลัง
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(
                      `/create-request/detail-request-information/${row.original.id}`,
                    )
                  }
                  //  onClick={() => onEdit?.(row.original.id)}
                  title={c("edit-item")}
                  className="text-black hover:text-black"
                >
                  <Icon icon="solar:pen-outline" className="size-4" />
                </Button>
              ) : null}

              {status === "ฉบับร่าง" && (
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
              )}
            </div>
          );
        },
      },
    ];
  }, [onEdit, onDelete, c, formatToBuddhist, router]);

  return columns;
}
