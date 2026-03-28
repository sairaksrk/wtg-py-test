"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import Loading from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageSize } from "@/utils/helpers";
import { ManPowerTable } from "./manpower-table";
import { SearchManpowerModal } from "./manpower-search-modal";
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

/**
 * Client Component - Manpower Request List
 * Manpower Request prefetched data from the server and can refetch on the client
 */

export default function ManpowerRequestList() {
  const router = useRouter();
  const menuName = useCurrentMenuName() || "ข้อมูลคำขอเพิ่มอัตรากำลัง";
  const c = useTranslations("common");
  const alert = useAlert();
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const [searchManpowerOpen, setSearchManpowerOpen] = useState(false);

  const [filters, setFilters] = useTableState<ManpoweRequestListParams>(
    MANPOWER_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      // requestNumber : ""
    },
  );

  const { data, isLoading, isError, error } = useManpowerRequestsList({
    page: filters.page,
    take: filters.take,
    search: filters.search,
    // requestNumber: filters.requestNumber,
  });

  const onSearch = (formData: any) => {
    console.log(formData);
    setFilters({ ...filters, search: formData?.requestNumber });
    // setFilters({ ...filters, requestNumber: formData?.requestNumber });
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
          updateLoading(true);
          try {
            await deleteManpowerMutation.mutateAsync(id);
            if (filters.page! > 1 && data?.data.length === 1) {
              setFilters({ ...filters, page: filters.page! - 1 });
            }
            toastSuccess(c("successfully"), c("successfully-description"));
          } catch (error) {
            const { title, description } = formatApiError(
              error,
              c("error-occur"),
            );
            toastError(title, description || c("error-detail"));
          } finally {
            updateLoading(false);
          }
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        show: true,
      },
    });
  };

  // const mockDataList: any = {
  //   data: [
  //     {
  //       id: "01",
  //       requestNumber: "REQ-2568-431",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "กองจัดการหนี้ 1",
  //       numberOfRequests: 2,
  //       numberOfAmount: null,
  //       status: "ฉบับร่าง",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //     {
  //       id: "02",
  //       requestNumber: "REQ-2568-432",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "กองจัดการหนี้ 2",
  //       numberOfRequests: 2,
  //       numberOfAmount: null,
  //       status: "รอตรวจสอบ",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //     {
  //       id: "03",
  //       requestNumber: "REQ-2568-433",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "ศูนย์เทคโนโลยีสารสนเทศ",
  //       numberOfRequests: 2,
  //       numberOfAmount: null,
  //       status: "ยกเลิกรายการ",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //     {
  //       id: "04",
  //       requestNumber: "REQ-2568-434",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "ศูนย์เทคโนโลยีสารสนเทศ",
  //       numberOfRequests: 2,
  //       numberOfAmount: 2,
  //       status: "อยู่ระหว่างดำเนินการ",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //     {
  //       id: "05",
  //       requestNumber: "REQ-2568-435",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "ศูนย์เทคโนโลยีสารสนเทศ",
  //       numberOfRequests: 2,
  //       numberOfAmount: 0,
  //       status: "อนุมัติ",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //     {
  //       id: "06",
  //       requestNumber: "REQ-2568-435",
  //       submissionDate: "15 ธ.ค. 2568",
  //       agency: "ศูนย์เทคโนโลยีสารสนเทศ",
  //       numberOfRequests: 2,
  //       numberOfAmount: 0,
  //       status: "ไม่อนุมัติ",
  //       responsiblePerson: "มาตาลดา",
  //     },
  //   ],
  //   meta: {
  //     page: 1,
  //     take: 5,
  //     itemCount: 100,
  //     pageCount: 20,
  //   },
  // };

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
                  router.push(`/create-request/add-request-information`)
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
                onClick={() => setSearchManpowerOpen(true)}
              >
                <Icon icon="solar:sort-linear" />
                {c("filter")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ManPowerTable
            data={data?.data || []}
            totalRows={data?.meta.itemCount || 0}
            currentPage={filters.page || 1}
            onPageChange={(page) => setFilters({ ...filters, page })}
            rowsPerPage={filters.take}
            // onEdit={(id) =>
            //   router.push(`/create-request/add-request-information/${id}`)
            // }
            onDelete={onDeleteRequest}
          />
        </CardContent>
      </Card>

      <SearchManpowerModal
        open={searchManpowerOpen}
        onClose={() => setSearchManpowerOpen(false)}
        onSearch={onSearch}
      />
    </>
  );
}
