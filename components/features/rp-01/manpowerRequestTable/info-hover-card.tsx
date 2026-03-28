import { HoverCard } from "radix-ui";
import { ScrollArea } from "radix-ui";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export interface ManPowerItem {
  id: number;
  name: string;
  level: string;
  quantity: number;
}

interface InfoHoverCardProps {
  data?: ManPowerItem[];
}

export function InfoHoverCard({ data }: InfoHoverCardProps) {
  const m = useTranslations("manpower");

  return (
    <HoverCard.Root openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <button type="button">
          <Icon
            icon="solar:info-circle-linear"
            className="cursor-pointer transition-colors"
          />
        </button>
      </HoverCard.Trigger>

      <HoverCard.Content
        side="right"
        align="start"
        sideOffset={12}
        className="w-96 rounded-3xl bg-white shadow-2xl border p-0 z-50"
      >
        <ScrollArea.Root className="max-h-[340px] w-full">
          <ScrollArea.Viewport className="max-h-[340px] w-full">
            {data?.map((item) => (
              <div
                key={item.id}
                className="pt-4 px-4 transition-colors rounded-tl-3xl rounded-tr-3xl"
              >
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.level}
                    </div>
                  </div>

                  <Badge
                    className="flex items-center gap-2 text-sm font-normal"
                    variant="secondary"
                  >
                    {item.quantity} {m("rate")}
                  </Badge>
                </div>
              </div>
            ))}
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex w-2 touch-none p-0.5 mt-4 mb-4 mr-1"
          >
            <ScrollArea.Thumb className="flex-1 rounded-full bg-[#A1A1AA]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        <HoverCard.Arrow className="fill-white" />
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
