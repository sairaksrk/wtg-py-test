"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import Loading from "@/components/common/loading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/helpers";
import { useState } from "react";
import { ModalStateProps } from "@/types/api";
import { CancelRequestModal } from "./cancel-request-modal";
import { useManpowerRequestsDetailById } from "@/libs/query/manpower.queries";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { formatApiError } from "@/types/api";
import ErrorComponent from "@/components/common/error";
import { useTranslations } from "next-intl";

interface RequestFormProps {
  reqId?: any;
}

export default function ManpowerDetailForm({ reqId }: RequestFormProps) {
  const c = useTranslations("common");
  const { formatToBuddhist } = useDateFormatter();
  const router = useRouter();

  const [cancelRequestModalState, setCancelRequestModalState] =
    useState<ModalStateProps>({ id: null, state: false });

  const {
    data: manpowerData,
    isLoading: isLoadingManpower,
    isError,
    error,
  } = useManpowerRequestsDetailById(reqId || "");

  const mockupCardResultCommander: any = {
    // reasons:
    //   "เนื่องจากการขยายตัวของภารกิจงานของหน่วยงาน โดยเฉพาะการเพิ่มขึ้นของโครงการวิเคราะห์ผลกระทบทางเศรษฐกิจในระดับมหภาคและจุลภาครวมถึงการบูรณาการข้อมูลเศรษฐกิจเข้ากับแผนยุทธศาสตร์องค์กร",
    // file: "เอกสารหลักฐาน.pdf",
    // listPosition: [
    //   {
    //     id: 1,
    //     name: "นักวิชาการคลัง",
    //     description: "ระดับปฏิบัติการ/ชำนาญการ",
    //     quantity: 2,
    //     approve: 2,
    //   },
    //   {
    //     id: 2,
    //     name: "เศรษฐกร",
    //     description: "ระดับปฏิบัติการ/ชำนาญการ",
    //     quantity: 2,
    //     approve: 0,
    //   },
    // ],
  };

  const mockupCardResultMinistry: any = {
    // reasons:
    //   "เนื่องจากการขยายตัวของภารกิจงานของหน่วยงาน โดยเฉพาะการเพิ่มขึ้นของโครงการวิเคราะห์ผลกระทบทางเศรษฐกิจในระดับมหภาคและจุลภาครวมถึงการบูรณาการข้อมูลเศรษฐกิจเข้ากับแผนยุทธศาสตร์องค์กร",
    // file: "เอกสารหลักฐาน.pdf",
    // listPosition: [
    //   {
    //     id: 1,
    //     name: "นักวิชาการคลัง",
    //     description: "ระดับปฏิบัติการ/ชำนาญการ",
    //     quantity: 2,
    //     approve: 0,
    //   },
    //   {
    //     id: 2,
    //     name: "เศรษฐกร",
    //     description: "ระดับปฏิบัติการ/ชำนาญการ",
    //     quantity: 2,
    //     approve: 0,
    //   },
    // ],
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

  const status = manpowerData?.userStatus;
  const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
    label: "-",
    color: "bg-gray-100 text-gray-400",
  };

  const handleOpenFile = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isLoading = reqId ? isLoadingManpower : false;

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
      <div className="mb-6 flex gap-4">
        <Button
          variant="secondary"
          size="icon"
          className="p-3.5"
          //  onClick={() => router.back()}
          onClick={() => {
            router.push("/create-request");
          }}
        >
          <Icon icon="solar:alt-arrow-left-outline" className="text-base" />
        </Button>
        <h1 className="text-xl font-medium">
          {/* {m("detail-manpower-information")}  */}
          รายละเอียดข้อมูลคำขอเพิ่มอัตรากำลัง
        </h1>
      </div>

      {/* Card  */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col items-start justify-center gap-2">
                <h1 className="text-base font-normal text-subdude">
                  เลขที่คำขอ
                </h1>
                <h1 className="text-xl font-medium">
                  {manpowerData?.requestNo}
                </h1>

                <div className="flex items-center justify-center gap-4 mt-2">
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
                      วันที่ขอ{" "}
                      {formatToBuddhist(Number(manpowerData?.createdAt))}
                    </h1>
                  </div>

                  <div className="border-r border-gray-400 h-7" />

                  <div className="flex items-center justify-center gap-2 text-subdude">
                    <Icon icon="solar:user-linear" />
                    <h1 className="text-sm font-normal text-subdude">
                      {/* {mockupDetailFormData?.createBy ?? "-"} */}
                      {manpowerData?.createBy ?? "-"}
                    </h1>
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* <div className="flex flex-col xl:flex-row gap-4 w-full"> */}
          <Card className="lg:col-span-2 h-full">
            {/* <Card className="w-full h-full"> */}
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>
                  <div className="flex items-center gap-1">
                    <h1 className="text-xl font-medium">
                      ข้อมูลคำขอเพิ่มอัตรากำลัง
                    </h1>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* ยกเลิกรายการ */}
              {status === "ยกเลิกรายการ" && (
                <div className="flex items-center gap-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#EF4444] mb-5">
                  <div className="flex items-center  justify-center rounded-full w-8 h-8 bg-[#EF4444]">
                    <Icon
                      icon="solar:danger-circle-linear"
                      className="w-4 h-4 text-white"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-normal">ยกเลิกรายการ</h1>

                    <p className="text-sm font-normal text-[#71717A]">
                      {/* {mockupDetailFormData?.cancelReason ?? "-"} */}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-sm font-normal text-subdude">
                    หน่วยงานที่ร้องขอ
                  </h1>
                  <p className="text-base font-normal">
                    {manpowerData?.header?.departmentName ?? "-"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <h1 className="text-sm font-normal text-subdude">
                    ตำแหน่งที่ต้องการเพิ่มอัตรากำลัง
                  </h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    {manpowerData?.items?.map(
                      (position: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon Circle */}
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sub-background border">
                              <Icon
                                icon="solar:users-group-rounded-linear"
                                className="text-gray-700"
                              />
                            </div>

                            {/* Text Section */}
                            <div className="flex flex-col justify-center gap-1">
                              <h1 className="text-base font-medium text-gray-900">
                                {position?.positionName}
                              </h1>

                              <p className="text-sm text-gray-500">
                                ระดับปฏิบัติการ/{position?.positionLevelName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-1">
                            <Badge
                              className="flex items-center gap-2 text-sm font-normal"
                              variant="secondary"
                            >
                              {position.amount} อัตรา
                            </Badge>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <h1 className="text-sm font-normal text-subdude">เหตุผล</h1>
                    <p className="text-base font-normal">
                      {manpowerData?.header?.reason}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <h1 className="text-sm font-normal text-subdude">
                      ภารกิจงานเดิม
                    </h1>
                    <p className="text-base font-normal">
                      {manpowerData?.header?.existingMission}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                    <h1 className="text-sm font-normal text-subdude">
                      ภารกิจงานเพิ่ม
                    </h1>
                    <p className="text-base font-normal">
                      {manpowerData?.header?.additionalMission}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="min-h-64">
              {/* <Card className="xl:w-[430px] 2xl:[512px] min-h-64"> */}
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>
                    <div className="flex items-center justify-between gap-1">
                      <h1 className="text-xl font-medium">
                        ผลการพิจารณาผู้บังคับบัญชา
                      </h1>
                    </div>
                  </CardTitle>

                  {/* {!mockupCardResultMinistry?.reasons && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F4F5] border cursor-pointer">
                          <Icon
                            icon="solar:pen-outline"
                            className="text-gray-700"
                          />
                        </div>
                      )} */}
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  {mockupCardResultCommander?.reasons ? (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-normal text-subdude">
                          ผลการพิจารณา
                        </h1>
                        <p className="text-base font-normal">
                          {mockupCardResultCommander?.reasons}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-normal text-subdude">
                          ไฟล์แนบ
                        </h1>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleOpenFile(mockupCardResultMinistry?.file)
                          }
                        >
                          <Icon icon="solar:file-text-linear" />
                          <p className="text-base font-normal">
                            {mockupCardResultCommander?.file}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <h1 className="text-sm font-normal text-subdude">
                          รายการตำแหน่ง
                        </h1>

                        <div className="grid grid-cols-1 gap-4 mt-2">
                          {mockupCardResultCommander?.listPosition?.map(
                            (position: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sub-background border">
                                    <Icon
                                      icon="solar:users-group-rounded-linear"
                                      className="text-gray-700"
                                    />
                                  </div>

                                  <div className="flex flex-col justify-center gap-3">
                                    <h1 className="text-base font-medium text-gray-900">
                                      {position.name}
                                    </h1>

                                    <p className="text-sm text-gray-500">
                                      {position.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end justify-center gap-3">
                                  {position?.approve > 0 ? (
                                    <Badge
                                      className="flex items-center gap-2 text-sm font-normal bg-[#F0FDF4] text-[#16A34A]"
                                      variant="secondary"
                                    >
                                      <Icon
                                        icon="solar:check-circle-linear"
                                        className="w-3 h-3"
                                      />
                                      อนุมัติ {position.quantity} อัตรา
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className="flex items-center gap-2 text-sm font-normal bg-[#FEF2F2] text-destructive"
                                      variant="secondary"
                                    >
                                      <Icon
                                        icon="solar:close-circle-linear"
                                        className="w-3 h-3"
                                      />
                                      ไม่อนุมัติ
                                    </Badge>
                                  )}

                                  <p className="text-xs font-normal text-subdude">
                                    จำนวนขอ 3 อัตรา
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
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
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-64">
              {/* <Card className="xl:w-[430px] 2xl:[512px] min-h-64"> */}
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>
                    <div className="flex items-center justify-between gap-1">
                      <h1 className="text-xl font-medium">
                        ผลการพิจารณากระทรวง
                      </h1>
                    </div>
                  </CardTitle>

                  {/* {!mockupCardResultMinistry?.reasons && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F4F4F5] border cursor-pointer">
                          <Icon
                            icon="solar:pen-outline"
                            className="text-gray-700"
                          />
                        </div>
                      )} */}
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  {mockupCardResultMinistry?.reasons ? (
                    // {mockupCardResultMinistry?.hrConsideration?.reasons ? (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-normal text-subdude">
                          ผลการพิจารณา
                        </h1>
                        <p className="text-base font-normal">
                          {mockupCardResultMinistry?.reasons}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-normal text-subdude">
                          ไฟล์แนบ
                        </h1>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            handleOpenFile(mockupCardResultMinistry?.file)
                          }
                        >
                          <Icon icon="solar:file-text-linear" />
                          <p className="text-base font-normal">
                            {mockupCardResultMinistry?.file}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <h1 className="text-sm font-normal text-subdude">
                          รายการตำแหน่ง
                        </h1>

                        <div className="grid grid-cols-1 gap-4 mt-2">
                          {mockupCardResultMinistry?.listPosition?.map(
                            (position: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sub-background border">
                                    <Icon
                                      icon="solar:users-group-rounded-linear"
                                      className="text-gray-700"
                                    />
                                  </div>

                                  <div className="flex flex-col justify-center gap-3">
                                    <h1 className="text-base font-medium text-gray-900">
                                      {position.name}
                                    </h1>

                                    <p className="text-sm text-gray-500">
                                      {position.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end justify-center gap-3">
                                  {position?.approve > 0 ? (
                                    <Badge
                                      className="flex items-center gap-2 text-sm font-normal bg-[#F0FDF4] text-[#16A34A]"
                                      variant="secondary"
                                    >
                                      <Icon
                                        icon="solar:check-circle-linear"
                                        className="w-3 h-3"
                                      />
                                      อนุมัติ {position.quantity} อัตรา
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className="flex items-center gap-2 text-sm font-normal bg-[#FEF2F2] text-destructive"
                                      variant="secondary"
                                    >
                                      <Icon
                                        icon="solar:close-circle-linear"
                                        className="w-3 h-3"
                                      />
                                      ไม่อนุมัติ
                                    </Badge>
                                  )}

                                  <p className="text-xs font-normal text-subdude">
                                    จำนวนขอ 3 อัตรา
                                  </p>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CancelRequestModal
        open={cancelRequestModalState?.state}
        editingId={manpowerData?.id ?? null}
        onClose={() => setCancelRequestModalState({ id: null, state: false })}
        onSave={() => setCancelRequestModalState({ id: null, state: false })}
      />

      {/* Footer  */}

      {status === "รอตรวจสอบ" && (
        <footer className="rounded-full bg-white px-6 py-4 sticky bottom-0">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              className="cursor-pointer"
              onClick={() =>
                setCancelRequestModalState({ id: null, state: true })
              }
              // disabled={isSaving}
            >
              ยกเลิกรายการ
            </Button>
          </div>
        </footer>
      )}
    </>
  );
}
