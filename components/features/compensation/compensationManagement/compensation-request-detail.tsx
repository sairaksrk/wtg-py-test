"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { ModalStateProps } from "@/types/api";

import Loading from "@/components/common/loading";
import { useTranslations } from "next-intl";
import { useLoadingStore } from "@/stores/loading-store";
import { toastError, toastSuccess } from "@/utils/toast";
import { getPageSize } from "@/utils/helpers";
import { useTableState } from "@/hooks/use-session";
import {
  COMPENSATION_SESSION_KEY,
  CompensationListParams,
} from "@/types/compensation";

interface RequestFormProps {
  itemId?: any;
}

export default function CompensationRequestdetail({
  itemId,
}: RequestFormProps) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  //   useSetBreadcrumb([{ name: m("add-request-information") }]);

  const [creditManagementModalOpen, setCreditManagementModalOpen] =
    useState<ModalStateProps>({ id: null, state: false });
  const [itemManagementModalOpen, setItemManagementModalOpen] = useState({
    id: null,
    state: false,
  });
  //   const [filterCompensationOpen, setFilterCompensationOpen] = useState(false);

  const [filters, setFilters] = useTableState<CompensationListParams>(
    COMPENSATION_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      // createDate : ""
    },
  );

  const onSubmit = async (itemId: string) => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        variant: "secondary",
        show: true,
      },
    });
  };

  const isLoading = false;
  const isError = false;

  if (isLoading) {
    return (
      <div className="py-80">
        <Loading fullscreen={false} />
      </div>
    );
  }

  //   if (isError) {
  //     const { description, statusCode } = formatApiError(error, c("error-occur"));
  //     return (
  //       <div className="py-0">
  //         <div className="bg-card rounded-3xl p-6">
  //           <div className="flex flex-col items-center justify-center my-52">
  //             <ErrorComponent statusCode={statusCode} message={description} />
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <>
      <div className="min-h-[690px]">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-full">
            <div className="mb-6 flex gap-4">
              <Button
                variant="secondary"
                size="icon"
                className="p-3.5"
                onClick={() => {
                  router.push("/manage-compensation");
                }}
              >
                <Icon
                  icon="solar:alt-arrow-left-outline"
                  className="text-base"
                />
              </Button>
              <h1 className="text-xl font-medium">ที่ปรึกษาฯ</h1>
            </div>

            <div className="flex flex-col gap-6">
              <Card></Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
