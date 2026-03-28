"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageSize } from "@/utils/helpers";
import { CompensationTable } from "./compensation-table";
import { SearchCompensationModal } from "./compensation-search-modal";
import { useRouter } from "@/i18n/navigation";
import { useCurrentMenuName } from "@/hooks/use-current-menu";
import { useTranslations } from "next-intl";
import { useLoadingStore } from "@/stores/loading-store";
import { useTableState } from "@/hooks/use-session";
import ErrorComponent from "@/components/common/error";
import { toastError, toastSuccess } from "@/utils/toast";

import {
  ManpoweRequestListParams,
  MANPOWER_SESSION_KEY,
} from "@/types/manpower";

import {
  useManpowerRequestsList,
  useDeleteManpowerRequest,
} from "@/libs/query/manpower.queries";
import { formatApiError } from "@/types/api";
import { ItemManagementModal } from "../compensationManagement/Item-management-modal";

/**
 * Client Component - Compensation Lis
 * Manpower Request prefetched data from the server and can refetch on the client
 */

export default function CompensationList() {
  const router = useRouter();
  const menuName = useCurrentMenuName() || "จัดการค่าตอบแทน";
  const c = useTranslations("common");
  const alert = useAlert();
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const [searchCompensationOpen, setSearchCompensationOpen] = useState(false);

  const [itemManagementModalOpen, setItemManagementModalOpen] = useState({
    id: null,
    state: false,
  });

  const [filters, setFilters] = useTableState<ManpoweRequestListParams>(
    MANPOWER_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      // createDate : ""
    },
  );

  const { data, isLoading, isError, error } = useManpowerRequestsList({
    page: filters.page,
    take: filters.take,
    search: filters.search,
    // createDate: filters.createDate,
  });

  const onSearch = (formData: any) => {
    setFilters({ ...filters, search: formData?.requestNumber });
    // setFilters({ ...filters, createDate: formData?.createDate });
  };

  const deleteManpowerMutation = useDeleteManpowerRequest();

  const onDeleteRequest = (id: string) => {
    alert.fire({
      type: "delete",
      title: c("delete-confirmation"),
      description: c("delete-confirmation-description"),
      confirmButton: {
        label: c("button.delete"),
        variant: "destructive",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
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

  const mockDataList: any = {
    data: [
      {
        id: "01",
        itemName: "รายการค่าตอบแทนประจำปี 1/2569",
        createdAt: "3 ส.ค. 2569 09:40",
        number: 240,
        status: "ฉบับร่าง",
        approver: "มาลีฮานัว",
      },
      {
        id: "02",
        itemName: "รายการค่าตอบแทนประจำปี 2/2568",
        createdAt: "1 ม.ค. 2569 09:40",
        number: 10,
        status: "รอพิจารณา",
        approver: "มาลีฮานัว",
      },
      {
        id: "03",
        itemName: "รายการค่าตอบแทนประจำปี 1/2568",
        createdAt: "24 มิ.ย. 2568 09:40",
        number: 240,
        status: "อยู่ระหว่างดำเนินการ",
        approver: "มาลีฮานัว",
      },
      {
        id: "04",
        itemName: "รายการค่าตอบแทนประจำปี 2/2567",
        createdAt: "20 ธ.ค. 2567 09:40",
        number: 240,
        status: "เสร็จสิ้น",
        approver: "มาลีฮานัว",
      },
    ],
    meta: {
      page: 1,
      take: 5,
      itemCount: 100,
      pageCount: 20,
    },
  };

  if (isLoading) {
    return (
      <div className="py-80">
        <Loading fullscreen={false} />
      </div>
    );
  }

  if (isError) {
    const { description, statusCode } = formatApiError(error, c("error-occur"));
    return (
      <div className="py-0">
        <div className="bg-card rounded-3xl p-6">
          <div className="flex flex-col items-center justify-center my-52">
            <ErrorComponent statusCode={statusCode} message={description} />
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
              <Button
                type="button"
                className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                onClick={() => setSearchCompensationOpen(true)}
              >
                <Icon icon="solar:sort-linear" />
                {c("filter")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <CompensationTable
            data={mockDataList?.data || []}
            totalRows={mockDataList?.meta.itemCount || 0}
            // data={data?.data || []}
            // totalRows={data?.meta.itemCount || 0}
            currentPage={filters.page || 1}
            onPageChange={(page) => setFilters({ ...filters, page })}
            rowsPerPage={filters.take}
            onEdit={(id) => setItemManagementModalOpen({ id: id, state: true })}
            onDelete={onDeleteRequest}
          />
        </CardContent>
      </Card>

      <SearchCompensationModal
        open={searchCompensationOpen}
        onClose={() => setSearchCompensationOpen(false)}
        onSearch={onSearch}
      />

      <ItemManagementModal
        open={itemManagementModalOpen?.state}
        editingId={itemManagementModalOpen?.id}
        onClose={() => setItemManagementModalOpen({ id: null, state: false })}
        onSave={() => setItemManagementModalOpen({ id: null, state: false })}
      />
    </>
  );
}
