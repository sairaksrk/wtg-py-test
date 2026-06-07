"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { formatApiError, ModalStateProps } from "@/types/api";
import Image from "next/image";
import { cn } from "@/utils/helpers";
import Loading from "@/components/common/loading";
import { useTranslations } from "next-intl";
import { useLoadingStore } from "@/stores/loading-store";
import { Badge } from "@/components/ui/badge";
import { toastError, toastSuccess } from "@/utils/toast";
import { ItemsManagementModal } from "./items-management-modal";
import { getPageSize } from "@/utils/helpers";
import { useTableState } from "@/hooks/use-session";
import {
  CompensationListParams,
  CREDIT_LIMIT_LIST_SESSION_KEY,
} from "@/types/compensation";
import { CreditManagementModal } from "./credit-management-modal";
import { CreditTable } from "./credit-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useDeleteCreditLimitList,
  useGetCompensationRequestById,
} from "@/libs/query/compensation.queries";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import ErrorComponent from "@/components/common/error";

interface RequestFormProps {
  reqId?: string;
}

export default function CompensationRequestForm({ reqId }: RequestFormProps) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  const { formatToBuddhist } = useDateFormatter();

  const [creditManagementModalOpen, setCreditManagementModalOpen] =
    useState<ModalStateProps>({ id: null, state: false });
  const [itemManagementModalOpen, setItemManagementModalOpen] = useState<{
    id: string | null;
    state: boolean;
  }>({
    id: null,
    state: false,
  });
  const [exportCompensationOpen, setExportCompensationOpen] = useState(false);

  const [filters, setFilters] = useTableState<CompensationListParams>(
    CREDIT_LIMIT_LIST_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
    },
  );

  const {
    data: compensationRequestData,
    isLoading: isLoadingCompensationRequest,
    isError,
    error,
  } = useGetCompensationRequestById(reqId || "", {
    page: filters.page,
    take: filters.take,
  });

  const status = compensationRequestData?.period?.status;

  const statusConfig: Record<string, { label: string; color: string }> = {
    draft: {
      label: "ฉบับร่าง",
      color: "bg-[#F4F4F5] text-subdude",
    },
    reviewing: {
      label: "อยู่ระหว่างพิจาราณา",
      color: "bg-[#FEFCE8] text-[#FACC15]",
    },
    นำส่งเอกสาร: {
      label: "นำส่งเอกสาร",
      color: "bg-[#F0F9FF] text-[#0EA5E9]",
    },
    success: {
      label: "เสร็จสิ้น",
      color: "bg-[#F0FDF4] text-[#16A34A]",
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
    label: "-",
    color: "bg-gray-100 text-gray-400",
  };

  const onSubmitDeliver = () => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
          // updateLoading(true);
          // try {
          //   await updateSubmitDeliverMutation.mutateAsync({
          //     reqId: reqId || "",
          //   });
          //   toastSuccess(c("successfully"), c("successfully-description"));
          //   router.push(
          //     `/manage-compensation/item-request/${reqId}}`,
          //   );
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
        variant: "secondary",
        show: true,
      },
    });
  };

  const onSubmitSuccess = async () => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
          // updateLoading(true);
          // try {
          //   await updateSubmitSuccessMutation.mutateAsync({
          //     reqId: reqId || "",
          //   });
          //   toastSuccess(c("successfully"), c("successfully-description"));
          //   router.push(
          //     `/manage-compensation/item-request/${reqId}}`,
          //   );
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
        variant: "secondary",
        show: true,
      },
    });
  };

  const onDeleteRequest = () => {
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
          //  await deleteCreditLimitListMutation.mutateAsync(reqId);
          //   toastSuccess(c("successfully"), c("successfully-description"));
          //   router.push(
          //     `/manage-compensation/item-request/${reqId}}`,
          //   );
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

  const deleteCreditLimitListMutation = useDeleteCreditLimitList();

  const onDeleteCreditLimitList = (id: string) => {
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
            await deleteCreditLimitListMutation.mutateAsync(id);
            if (
              filters.page! > 1 &&
              compensationRequestData?.groups.length === 1
            ) {
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

  const onExport1 = async () => {
    setExportCompensationOpen(false);
  };

  const onExport2 = async () => {
    setExportCompensationOpen(false);
  };

  const isDisabled = compensationRequestData?.groups?.length === 0;

  const actionButton =
    status === "draft" || status === "reviewing" ? (
      <Button
        variant="secondary"
        type="button"
        disabled={isDisabled}
        onClick={onSubmitDeliver}
      >
        บันทึกการนำส่ง
      </Button>
    ) : status === "นำส่งเอกสาร" ? (
      <Button type="button" disabled={isDisabled} onClick={onSubmitSuccess}>
        เสร็จสิ้น
      </Button>
    ) : null;

  const groups = compensationRequestData?.groups ?? [];

  const isLoading = reqId ? isLoadingCompensationRequest : false;

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
      <div className="flex min-h-[calc(100vh-197px)] flex-col">
        <main className="flex-1">
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
                <h1 className="text-xl font-medium">ย้อนกลับ</h1>
              </div>

              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <div>
                      <div className="flex flex-row items-center justify-between">
                        <CardTitle>
                          <h1 className="text-xl font-medium">
                            {compensationRequestData?.period?.name ?? "-"}
                          </h1>
                        </CardTitle>
                        {status === "draft" || status === "reviewing" ? (
                          <Button
                            type="button"
                            className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                            onClick={() =>
                              setItemManagementModalOpen({
                                id: compensationRequestData?.period?.id || null,
                                state: true,
                              })
                            }
                          >
                            <Icon icon="solar:pen-outline" />
                            จัดการข้อมูล
                          </Button>
                        ) : null}
                      </div>

                      <div className="flex items-start justify-start gap-4 mt-2">
                        <div>
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
                        </div>
                        <div className="border-r border-gray-400 h-6" />
                        <div className="flex items-center justify-center gap-2 text-subdude">
                          <Icon icon="solar:calendar-linear" />
                          <h1 className="text-sm font-normal text-subdude">
                            วันที่สร้าง {""}
                            {formatToBuddhist(
                              Number(
                                compensationRequestData?.period?.createdAt,
                              ),
                              "dd MMM yyyy",
                            )}
                          </h1>
                        </div>

                        <div className="border-r border-gray-400 h-7" />

                        <div className="flex items-center justify-center gap-2 text-subdude">
                          <Icon icon="solar:user-linear" />
                          <h1 className="text-sm font-normal text-subdude">
                            {/* ธิดาวารินทร์ */}
                            {compensationRequestData?.period?.creatorName ??
                              "-"}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* 
                {mockDataList.mockupAppprove &&
                  mockDataList.mockupAppprove.length > 0 && (
                    <ApprovalDetailAccordion
                      data={mockDataList?.mockupAppprove}
                    />
                  )} */}

                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle>
                        <div className="flex items-center gap-1">
                          <h1 className="text-xl font-medium">
                            รายการบริหารวงเงิน
                          </h1>
                        </div>
                      </CardTitle>

                      <div className="flex items-center gap-2">
                        {status == "draft" ||
                        status == "reviewing" ||
                        status == "pending" ? (
                          <Button
                            type="button"
                            onClick={() =>
                              setCreditManagementModalOpen({
                                id: null,
                                state: true,
                              })
                            }
                            disabled={isLoading}
                          >
                            <Icon icon="solar:add-circle-outline" />
                            {c("button.add-item")}
                            {/* เพิ่มรายการ */}
                          </Button>
                        ) : (
                          <Popover
                            open={exportCompensationOpen}
                            onOpenChange={setExportCompensationOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                              >
                                <Icon icon="solar:download-minimalistic-linear" />
                                ออกรายงาน
                                <Icon icon="solar:alt-arrow-down-linear" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="end"
                              className="w-[230px] overflow-hidden rounded-2xl border-none shadow-2xl mt-2"
                            >
                              <div className="flex flex-col gap-4 p-2 text-black w-full cursor-pointer">
                                <div className="flex gap-4" onClick={onExport1}>
                                  <Icon
                                    className="w-4 h-4"
                                    icon="solar:download-minimalistic-linear"
                                  />
                                  บัญชีรายละเอียดการเลื่อนเงิน <br />
                                  เดือนข้าราชการ
                                </div>
                                <div className="flex gap-4" onClick={onExport2}>
                                  <Icon
                                    className="w-4 h-4"
                                    icon="solar:download-minimalistic-linear"
                                  />
                                  รายชื่อข้าราชการผู้มีผล <br />
                                  ประเมินระดับดีเด่นและดีมาก
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {groups.length > 0 ? (
                      <>
                        <CreditTable
                          data={groups}
                          totalRows={
                            compensationRequestData?.meta.itemCount || 0
                          }
                          currentPage={filters.page || 1}
                          onPageChange={(page) =>
                            setFilters({ ...filters, page })
                          }
                          rowsPerPage={filters.take}
                          onEdit={(id) =>
                            router.push(
                              `/manage-compensation/item-request/${reqId}/${id}`,
                            )
                          }
                          onDelete={onDeleteCreditLimitList}
                          onView={(id) =>
                            router.push(
                              `/manage-compensation/item-request/${reqId}/${id}`,
                            )
                          }
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-6 py-6">
                        <div className="relative h-24 w-24">
                          <Image
                            src="/no-data.png"
                            alt="Profile Image"
                            className="rounded-full object-cover"
                            sizes="(max-width: 768px) 100vw, 80vw"
                            fill
                          />
                        </div>

                        <h1 className="text-sm font-light text-subdude">
                          ยังไม่มีข้อมูล
                        </h1>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <ItemsManagementModal
                open={itemManagementModalOpen?.state}
                editingId={itemManagementModalOpen?.id}
                onClose={() =>
                  setItemManagementModalOpen({ id: null, state: false })
                }
                onSave={() =>
                  setItemManagementModalOpen({ id: null, state: false })
                }
              />

              <CreditManagementModal
                open={creditManagementModalOpen?.state}
                editingId={creditManagementModalOpen?.id}
                reqId={reqId}
                onClose={() =>
                  setCreditManagementModalOpen({ id: null, state: false })
                }
                onSave={() =>
                  setCreditManagementModalOpen({ id: null, state: false })
                }
              />
            </div>
          </div>
        </main>
      </div>

      <footer className="sticky bottom-0 z-10 rounded-full bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          {status === "draft" || status === "reviewing" ? (
            <Button
              variant="secondary"
              type="button"
              className="border-[#F4F4F5] bg-[#F4F4F5] text-red-500 hover:text-red-500"
              onClick={onDeleteRequest}
              disabled={!reqId}
            >
              ลบรายการ
            </Button>
          ) : (
            <div />
          )}

          {actionButton}
        </div>
      </footer>
    </>
  );
}
