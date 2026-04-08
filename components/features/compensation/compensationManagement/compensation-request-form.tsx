"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { ModalStateProps } from "@/types/api";
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
  COMPENSATION_SESSION_KEY,
  CompensationListParams,
} from "@/types/compensation";
import { CreditManagementModal } from "./credit-management-modal";
import { CreditTable } from "./credit-table";
import { ApprovalDetailAccordion } from "./approval-detail-accordion";

interface RequestFormProps {
  reqId?: any;
}

const mockDataList: any = {
  data: [
    {
      id: "1ea31ed3-bff6-4f61-aa34-25144cda2275",
      row1: "ที่ปรึกษาฯ",
      row2: 76800.0,
      row3: ["วิชาการทรงคุณวุฒิ"],
      row4: null,
      row5: null,
      row6: 3.0,
      row7: 2304.0,
      row8: 1,
    },
    {
      id: "2ea31ed3-bff6-4f61-aa34-25144cda2278",
      row1: "รองผู้อำนวยการสำนัก",
      row2: 134690.0,
      row3: ["บริหารต้น"],
      row4: 3.0,
      row5: null,
      row6: null,
      row7: 4040.7,
      row8: 2,
    },
  ],
  mockupAppprove: [
    { id: 1, text: "ผู้อำนวยการสำนักเลขานุการกรม", status: "done" },
    { id: 2, text: "ผู้อำนวยการกลุ่มตรวจสอบภายใน", status: "done" },
    { id: 3, text: "ผู้อำนวยการกลุ่มตรวจสอบภายใน", status: "done" },
    { id: 4, text: "ผู้อำนวยการกลุ่มตรวจสอบภายใน", status: "done" },
    { id: 5, text: "ผู้อำนวยการกลุ่มตรวจสอบภายใน", status: "done" },
    {
      id: 6,
      text: "ผู้อำนวยการกองนโยบายและแผนการบริหารหนี้สาธารณะ",
      status: "done",
    },
    { id: 7, text: "ผู้อำนวยการกองจัดการหนี้ 1", status: "done" },
    { id: 8, text: "ผู้อำนวยการกลุ่มกฎหมาย", status: "done" },
    {
      id: 9,
      text: "ผู้อำนวยการกลุ่มบริหารและพัฒนาทรัพยากรบุคคล",
      status: "done",
    },
    { id: 10, text: "ผู้อำนวยการกองประเมินผลโครงการ", status: "pending" },
    { id: 11, text: "ผู้อำนวยการกองประเมินผลโครงการ", status: "pending" },
    {
      id: 12,
      text: "ผู้อำนวยการศูนย์ข้อมูลที่ปรึกษาและเทคโนโลยีสารสนเทศ",
      status: "pending",
    },
  ],
  meta: {
    page: 1,
    take: 5,
    itemCount: 100,
    pageCount: 20,
  },
};

export default function CompensationRequestForm({ reqId }: RequestFormProps) {
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

  const [status, setStatus] = useState<string>("ฉบับร่าง");
  // const status = data?.status;

  const [filters, setFilters] = useTableState<CompensationListParams>(
    COMPENSATION_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      // startDate : ""
    },
  );

  //   const updateMutation = useUpdateManpowerRequest();
  //   const isSaving = updateMutation.isPending;
  //   const isLoading = reqId ? isLoadingManpower : false;

  const isLoading = false;
  const isError = false;

  const onSubmitConsideration = async () => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
          setStatus("รอพิจารณา");
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        variant: "secondary",
        show: true,
      },
    });
  };

  const onSubmitDeliver = async () => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
          setStatus("นำส่งเอกสาร");
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
          setStatus("เสร็จสิ้น");
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        variant: "secondary",
        show: true,
      },
    });
  };

  const onDeleteRequest = async (reqId: string) => {
    alert.fire({
      type: "delete",
      title: c("delete-confirmation"),
      description: c("delete-confirmation-description"),
      confirmButton: {
        label: c("button.delete"),
        variant: "destructive",
        onClick: async () => {
          toastSuccess(c("successfully"), c("successfully-description"));
        },
      },
      cancelButton: {
        label: c("button.secondary-cancel"),
        show: true,
      },
    });
  };

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
    นำส่งเอกสาร: {
      label: "นำส่งเอกสาร",
      color: "bg-[#F0F9FF] text-[#0EA5E9]",
    },
    เสร็จสิ้น: {
      label: "เสร็จสิ้น",
      color: "bg-[#F0FDF4] text-[#16A34A]",
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
    label: "-",
    color: "bg-gray-100 text-gray-400",
  };

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
                <h1 className="text-xl font-medium">
                  รายการค่าตอบแทนประจำปี 2/2569
                </h1>
              </div>

              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <div>
                      <div className="flex flex-row items-center justify-between">
                        <CardTitle>
                          <h1 className="text-xl font-medium">
                            รายการค่าตอบแทนประจำปี 1/2569
                          </h1>
                        </CardTitle>
                        {status === "ฉบับร่าง" || status === "รอพิจารณา" ? (
                          <Button
                            type="button"
                            className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                            onClick={() =>
                              setItemManagementModalOpen({
                                id: null,
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
                            วันที่สร้าง 12 พ.ย. 2568
                            {/* {formatToBuddhist(Number(mockupDetailFormData?.createdAt))} */}
                          </h1>
                        </div>

                        <div className="border-r border-gray-400 h-7" />

                        <div className="flex items-center justify-center gap-2 text-subdude">
                          <Icon icon="solar:user-linear" />
                          <h1 className="text-sm font-normal text-subdude">
                            {/* {mockupDetailFormData?.createBy ?? "-"} */}
                            ธิดาวารินทร์
                          </h1>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {mockDataList.mockupAppprove &&
                  mockDataList.mockupAppprove.length > 0 && (
                    <ApprovalDetailAccordion
                      data={mockDataList?.mockupAppprove}
                    />
                  )}

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
                        {status !== "เสร็จสิ้น" && (
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
                        )}

                        <Button
                          type="button"
                          className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                          // onClick={onExport}
                        >
                          <Icon icon="solar:download-minimalistic-linear" />
                          ออกรายงาน
                          <Icon icon="solar:alt-arrow-down-linear" />
                        </Button>

                        {/* <Button
                        type="button"
                        className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                        onClick={() => setFilterCompensationOpen(true)}
                      >
                        <Icon icon="solar:sort-linear" />
                        {c("filter")}
                      </Button> */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {mockDataList?.data?.length > 0 ? (
                      <>
                        <CreditTable
                          data={mockDataList?.data || []}
                          totalRows={mockDataList?.meta.itemCount || 0}
                          // data={data?.data || []}
                          // totalRows={data?.meta.itemCount || 0}
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
                          // onDelete={onDeleteRequest}
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

              {/* <RequestSearchModal
              open={filterCompensationOpen}
              onClose={() => setFilterCompensationOpen(false)}
              onSearch={onSearch}
            /> */}
            </div>
          </div>
        </main>
      </div>

      <footer className="sticky bottom-0 z-10 rounded-full bg-white px-6 py-4">
        {status === "ฉบับร่าง" && (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              type="button"
              className="bg-[#F4F4F5] border-[#F4F4F5] text-red-500 hover:text-red-500"
              onClick={() => onDeleteRequest?.(reqId)}
              disabled={!reqId}
            >
              ลบรายการ
            </Button>

            <Button
              type="submit"
              disabled={mockDataList?.data?.length === 0}
              onClick={onSubmitConsideration}
            >
              ส่งพิจารณา
            </Button>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          {status === "รอพิจารณา" ? (
            <Button
              type="submit"
              disabled={mockDataList?.data?.length === 0}
              onClick={onSubmitDeliver}
            >
              บันทึกนำส่ง
            </Button>
          ) : status === "นำส่งเอกสาร" ? (
            <Button
              type="submit"
              disabled={mockDataList?.data?.length === 0}
              onClick={onSubmitSuccess}
            >
              เสร็จสิ้น
            </Button>
          ) : null}
        </div>
      </footer>
    </>
  );
}
