import { Accordion } from "radix-ui";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";

interface BadgeItemProps {
  text: string;
  status: string;
}

const BadgeItem = ({ text, status }: BadgeItemProps) => {
  const isDone = status === "done";

  return (
    <Badge
      className={`
        text-sm border
        ${
          isDone
            ? "border-[#D4D4D8] bg-white text-[#16A34A]"
            : "border-[#D4D4D8] bg-white text-[#71717A]"
        }
      `}
    >
      <Icon
        icon={
          isDone ? "solar:check-circle-linear" : "solar:clock-circle-linear"
        }
      />
      {text}
    </Badge>
  );
};

export function ApprovalDetailAccordion({ data }: any) {
  const doneCount = data?.filter((i: any) => i.status === "done").length || 0;
  const pendingCount =
    data?.filter((i: any) => i.status !== "done").length || 0;
  const total = data?.length || 0;

  return (
    <Accordion.Root
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <Accordion.Item
        value="item-1"
        className="border border-[#84CC16] bg-[#F7FEE7] rounded-xl overflow-hidden"
      >
        <Accordion.Header className="flex">
          <Accordion.Trigger className="cursor-pointer group flex flex-1 items-center justify-between p-4 outline-none transition-all">
            <h1 className="text-base font-medium text-[#18181B]">
              รายละเอียดรายการอนุมัติ
            </h1>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-[#16A34A]">
                <Icon icon="solar:check-circle-linear" fontSize={18} />
                <span>พิจารณาเสร็จสิ้น {doneCount} คน</span>
              </div>

              <div className="flex items-center gap-1.5 text-[#F97316]">
                <Icon icon="solar:clock-circle-linear" fontSize={18} />
                <span>รอพิจารณา {pendingCount} คน</span>
              </div>

              <span className="text-[#71717A]">ทั้งหมด {total} คน</span>

              <Icon
                icon="solar:alt-arrow-down-outline"
                className="transition-transform duration-300 group-data-[state=open]:rotate-180 text-[#71717A]"
              />
            </div>
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
          <div className="mx-4 border-t border-[#b7b7b7]" />
          <div className="p-4 flex flex-wrap gap-3">
            {data.map((item: any) => (
              <BadgeItem key={item.id} text={item.text} status={item.status} />
            ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
