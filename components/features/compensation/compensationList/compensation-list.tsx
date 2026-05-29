"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageSize } from "@/utils/helpers";
import { CompensationTable } from "./compensation-table";
import { CompensationSearchModal } from "./compensation-search-modal";
import { useRouter } from "@/i18n/navigation";
import { useCurrentMenuName } from "@/hooks/use-current-menu";
import { useTranslations } from "next-intl";
import { useLoadingStore } from "@/stores/loading-store";
import { useTableState } from "@/hooks/use-session";
import ErrorComponent from "@/components/common/error";
import { toastError, toastSuccess } from "@/utils/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
  PopoverClose,
} from "@/components/ui/popover";

import {
  COMPENSATION_SESSION_KEY,
  CompensationListParams,
} from "@/types/compensation";

import { formatApiError } from "@/types/api";
import { ItemsManagementModal } from "../compensationManagement/items-management-modal";
import { useGetCompensationList } from "@/libs/query/compensation.queries";

export default function CompensationList() {
  const router = useRouter();
  const menuName = useCurrentMenuName() || "จัดการค่าตอบแทน";
  const c = useTranslations("common");
  const alert = useAlert();
  const updateLoading = useLoadingStore((state) => state.updateLoading);
  //   useSetBreadcrumb([{ name: m("add-request-information") }]);

  const [searchCompensationOpen, setSearchCompensationOpen] = useState(false);
  const [itemManagementModalOpen, setItemManagementModalOpen] = useState({
    id: null,
    state: false,
  });

  const [filters, setFilters] = useTableState<CompensationListParams>(
    COMPENSATION_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      startDate: null,
      // departmentId: "",
      // positionId: "",
      // status: "",
      // responsibleHr: "",
    },
  );

  const { data, isLoading, isError, error } = useGetCompensationList({
    page: filters.page,
    take: filters.take,
    // requestNo: filters.requestNo,
    // requestDate: filters.requestDate,
    // departmentId: filters.departmentId,
    // positionId: filters.positionId,
    // status: filters.status,
    // responsibleHr: filters.responsibleHr,
  });

  const onSearch = (formData: any) => {
    setFilters({ ...filters, startDate: formData?.startDate });
  };

  const onClearFilters = () => {
    setFilters({
      ...filters,
      // requestNo: "",
      startDate: null,
      // departmentId: "",
      // positionId: "",
      // status: "",
      // responsibleHrId: "",
    });
    setSearchCompensationOpen(false);
  };

  // const deleteManpowerMutation = useDeleteManpowerRequest();

  const onDeleteRequest = (id: string) => {
    alert.fire({
      type: "delete",
      title: c("delete-confirmation"),
      description: c("delete-confirmation-description"),
      confirmButton: {
        label: c("button.delete"),
        variant: "destructive",
        onClick: async () => {
          // updateLoading(true);
          // try {
          //   await deleteManpowerMutation.mutateAsync(id);
          //   if (filters.page! > 1 && data?.data.length === 1) {
          //     setFilters({ ...filters, page: filters.page! - 1 });
          //   }
          //   toastSuccess(c("successfully"), c("successfully-description"));
          // } catch (error) {
          //   const { title, description } = formatApiError(
          //     error,
          //     c("error-occur"),
          //   );
          //   toastError(title, description || c("error-detail"));
          // } finally {
          //   updateLoading(false);
          // }
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        show: true,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-80">
        <Loading fullscreen={false} />
      </div>
    );
  }

  if (isError) {
    const { title, description, statusCode } = formatApiError(
      error,
      c("error-occur"),
    );
    return (
      <div className="py-0">
        <div className="bg-card rounded-3xl p-6">
          <div className="flex flex-col items-center justify-center my-52">
            <ErrorComponent
              statusCode={statusCode}
              title={title}
              message={description}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              <h1 className="text-xl font-medium">{menuName}</h1>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() =>
                  setItemManagementModalOpen({ id: null, state: true })
                }
                disabled={isLoading}
              >
                <Icon icon="solar:add-circle-outline" />
                {c("button.add-item")}
                {/* เพิ่มรายการ */}
              </Button>
              <Popover
                open={searchCompensationOpen}
                onOpenChange={setSearchCompensationOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                  >
                    <Icon icon="solar:sort-linear" />
                    {c("filter")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl mt-2"
                >
                  <PopoverHeader className="flex flex-row items-center justify-between px-6 py-4">
                    <PopoverTitle className="text-xl font-medium text-[#18181B] mt-2">
                      ตัวกรอง
                    </PopoverTitle>
                    <PopoverClose className="text-gray-400 hover:text-gray-600 transition-colors outline-none">
                      <Icon icon="mdi:close" className="size-6" />
                    </PopoverClose>
                  </PopoverHeader>

                  <div className="px-6 pb-6 pt-4 text-black">
                    <CompensationSearchModal
                      onSearch={onSearch}
                      onClearFilters={onClearFilters}
                      onClose={() => setSearchCompensationOpen(false)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CompensationTable
            data={data?.data || []}
            totalRows={data?.meta.itemCount || 0}
            currentPage={filters.page || 1}
            onPageChange={(page) => setFilters({ ...filters, page })}
            rowsPerPage={filters.take}
            onEdit={(id) =>
              router.push(`/manage-compensation/item-request/${id}`)
            }
            onDelete={onDeleteRequest}
          />
        </CardContent>
      </Card>

      <ItemsManagementModal
        open={itemManagementModalOpen?.state}
        editingId={itemManagementModalOpen?.id}
        onClose={() => setItemManagementModalOpen({ id: null, state: false })}
        onSave={() => setItemManagementModalOpen({ id: null, state: false })}
      />
    </>
  );
}
