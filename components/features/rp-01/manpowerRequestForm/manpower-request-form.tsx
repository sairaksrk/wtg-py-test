"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAlert } from "@/components/common/alert-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { ModalStateProps } from "@/types/api";
import { PositionManagementModal } from "./position-management-modal";
import Image from "next/image";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "@/components/common/loading";
import { TextArea } from "@/components/ui/textarea";
import type { ChangeEvent } from "react";
import { useFileUpload } from "@/hooks/file/use-file-upload";
import { FileUpload } from "@/components/ui/upload";
import { useTranslations } from "next-intl";
import { useLoadingStore } from "@/stores/loading-store";
import { useSetBreadcrumb } from "@/hooks/breadcrumb/use-set-breadcrumb";
import { Combobox } from "@/components/common/combobox";
import { Badge } from "@/components/ui/badge";
import { toastError, toastSuccess } from "@/utils/toast";
import {
  useDeleteManpowerRequest,
  useDeletePositionItem,
  useManpowerRequestsByID,
  useUpdateManpowerRequest,
} from "@/libs/query/manpower.queries";
import ErrorComponent from "@/components/common/error";
import { formatApiError } from "@/types/api";
import {
  // MANPOWER_SESSION_KEY,
  UpdateManpowerRequestsDto,
} from "@/types/compensation";

function getManPowerFormSchema() {
  return z.object({
    departmentId: z.string().min(1),
    reason: z.string().min(1),
    existingMission: z.string().min(1),
    additionalMission: z.string().min(1),
    fileName: z.string().min(1),
    fileUrl: z.string().min(1),
  });
}
type ManPowerFormValues = z.infer<ReturnType<typeof getManPowerFormSchema>>;

interface RequestFormProps {
  reqId?: any;
}

export default function ManpowerRequestForm({ reqId }: RequestFormProps) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");
  const m = useTranslations("manpower");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  // const params = useParams();
  // const reqId = params?.id as string;

  const manPowerFormSchema = getManPowerFormSchema();

  useSetBreadcrumb([{ name: m("add-request-information") }]);

  const [positionManageModalOpen, setPositionManageModalOpen] =
    useState<ModalStateProps>({ id: null, state: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: manpowerData,
    isLoading: isLoadingManpower,
    isError,
    error,
  } = useManpowerRequestsByID(reqId || "");

  const items = manpowerData ?? [];

  // const { data: agencyData, isLoading: isLoadingAgency } = useAgencyList()

  // const agencyOptions = useMemo(
  //   () =>
  //     agencyData?.data.map((agency) => ({
  //       value: agency.id,
  //       label: agency.name,
  //     })) || [],
  //   [agencyData?.data],
  // );

  const updateMutation = useUpdateManpowerRequest();
  const deletePositionItemMutation = useDeletePositionItem();
  const deleteManpowerMutation = useDeleteManpowerRequest();

  const isSaving = updateMutation.isPending;
  // const isLoading = isLoadingAgency || (reqId ? isLoadingManpower : false);
  const isLoading = reqId ? isLoadingManpower : false;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManPowerFormValues>({
    resolver: standardSchemaResolver(manPowerFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      departmentId: "",
      reason: "",
      existingMission: "",
      additionalMission: "",
      fileName: "",
      fileUrl: "",
    },
  });

  const onSubmit = async (formData: ManPowerFormValues) => {
    alert.fire({
      type: "warning",
      title: c("save-data-confirmation"),
      description: c("save-data-confirmation-description"),
      confirmButton: {
        label: c("button.confirm"),
        variant: "default",
        onClick: async () => {
          updateLoading(true);
          try {
            if (reqId) {
              const payload: UpdateManpowerRequestsDto = {
                // departmentId: formData.departmentId,
                departmentId: null,
                reason: formData.reason,
                existingMission: formData.existingMission,
                additionalMission: formData.additionalMission,
                jdDocUrl: "https://example.com/jd.pdf",
                // fileName: formData.fileName,
                // fileUrl: formData.fileUrl,
              };
              await updateMutation.mutateAsync({ id: reqId, data: payload });
            }
            // sessionStorage.removeItem(MANPOWER_SESSION_KEY);
            toastSuccess(c("successfully"), c("successfully-description"));
            router.push(`/create-request`);
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
        variant: "secondary",
        show: true,
      },
    });
  };

  const onDeleteRequest = async (id: any) => {
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
            toastSuccess(c("successfully"), c("successfully-description"));
            router.push(`/create-request`);
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

  const onDeletePositionModal = async (id: string) => {
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
            await deletePositionItemMutation.mutateAsync({
              id,
              reqId,
            });
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

  // File upload hook
  const { uploadAsync, isUploading } = useFileUpload({
    context: "private",
    onSuccess: (result) => {
      setUploadedFileUrl(result.path);
      if (selectedFile) {
        // Auto-fill fileName and fileUrl fields
        const values = {
          fileName: selectedFile.name,
          fileUrl: result.path,
        };
        reset({
          ...control._formValues,
          ...values,
        });
      }
    },
    onError: (error) => {
      setUploadedFileUrl("path.test");
      if (selectedFile) {
        const values = {
          fileName: selectedFile.name,
          fileUrl: "path.test",
        };
        reset({
          ...control._formValues,
          ...values,
        });
      }

      // const { title, description } = formatApiError(error, c("error-occur"));
      // toastError(title, description || c("error-detail"));

      // alert.fire({
      //   type: "error",
      //   title: "พบข้อผิดพลาด",
      //   description: error?.hint?.join("<br/>") ?? "รายละเอียดข้อผิดพลาด",
      // });
    },
  });

  // Handle file selection and auto-upload
  // Auto-upload immediately

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(null); // Reset error ทุกครั้งที่มีการเลือกใหม่

    if (file) {
      // ตรวจสอบขนาดไฟล์ (10 MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        setFileError("ขนาดไฟล์ต้องไม่เกิน 10 MB");
        // ล้างค่าใน input เพื่อให้เลือกใหม่ได้
        e.target.value = "";
        return;
      }

      // ตรวจสอบนามสกุลไฟล์ (เผื่อกรณีผู้ใช้ลากไฟล์มาวางแบบ Drag & Drop หรือ bypass html)
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("รองรับเฉพาะไฟล์ PDF, PNG และ JPG เท่านั้น");
        e.target.value = "";
        return;
      }

      // ถ้าผ่านทุกเงื่อนไข -> ทำการอัปโหลด
      // console.log("File is valid:", e.target.files?.[0]);
      const files = e.target.files;
      if (files && files.length > 0) {
        const fileData = files[0];
        setSelectedFile(fileData);
        setFileError("");
        try {
          await uploadAsync(fileData);
        } catch (error) {
          console.error("Upload failed:", error);
          setSelectedFile(null);
        }
      }
    }
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
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[780px]">
          <div className="mb-6 flex gap-4">
            <Button
              variant="secondary"
              size="icon"
              className="p-3.5"
              onClick={() => {
                router.push("/create-request");
              }}
            >
              <Icon icon="solar:alt-arrow-left-outline" className="text-base" />
            </Button>
            <h1 className="text-xl font-medium">
              {/* {m("add-manpower-information")}  */}
              เพิ่มข้อมูลคำขออัตรากำลัง
            </h1>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>
                  <div className="flex items-center gap-1">
                    <h1 className="text-base font-medium">
                      ข้อมูลตำแหน่งที่ต้องการ
                    </h1>
                    <p className="text-red-500">*</p>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="bg-[#F4F4F5] text-black hover:bg-[#F4F4F5]"
                    onClick={() =>
                      setPositionManageModalOpen({ id: null, state: true })
                    }
                  >
                    <Icon icon="tabler:plus" />
                    {/* {c("rp.create-new")} */}
                    เพิ่มรายการ
                  </Button>
                </div>
              </div>

              {items?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 my-4">
                  {items?.map((position: any, index: number) => (
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

                        <div className="flex flex-col justify-center gap-1">
                          <h1 className="text-base font-medium text-gray-900">
                            {position.positionName}
                          </h1>

                          <p className="text-sm text-gray-500">
                            ระดับปฏิบัติการ/{position.positionLevelName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <Badge
                          className="flex items-center gap-2 text-sm font-normal"
                          variant="secondary"
                        >
                          {position.amount} {m("rate")}
                        </Badge>

                        <div className="border-r  border-[#D4D4D8] h-6 ml-3 mr-4" />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setPositionManageModalOpen({
                              id: position.id,
                              state: true,
                            })
                          }
                        >
                          <Icon icon="solar:pen-outline" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeletePositionModal?.(position.id)}
                        >
                          <Icon
                            icon="solar:trash-bin-trash-outline"
                            className="text-red-500"
                          />
                        </Button>
                      </div>
                    </div>
                  ))}
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
              <div className="border-b border-dashed border-[#D4D4D8] pt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-1">
                  <h1 className="text-base font-medium">
                    ข้อมูลรายละเอียดคำขอ
                  </h1>
                </div>

                {/* เลือกหน่วยงาน */}
                <div className="grid grid-cols-1 gap-6">
                  <Controller
                    name="departmentId"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        // options={agencyOptions}
                        options={[
                          {
                            label: "สำนักงานเลขานุการกรม",
                            value: "สำนักงานเลขานุการกรม",
                          },
                        ]}
                        value={field.value}
                        valueType="string"
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        label={m("field.select-agency")}
                        floatingLabel
                        error={errors.departmentId?.message}
                        disabled={isSaving}
                        required
                      />
                    )}
                  />

                  {/* เหตุผล */}
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        label="เหตุผล"
                        disabled={isSaving}
                        floatingLabel
                        required
                        error={errors.reason?.message}
                      />
                    )}
                  />

                  <Controller
                    name="existingMission"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        label="ภารกิจงานเดิม"
                        disabled={isSaving}
                        floatingLabel
                        required
                        error={errors.existingMission?.message}
                      />
                    )}
                  />

                  <Controller
                    name="additionalMission"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        label="ภารกิจงานเพิ่ม"
                        disabled={isSaving}
                        floatingLabel
                        required
                        error={errors.additionalMission?.message}
                      />
                    )}
                  />

                  {/* File Upload Section */}
                  <FileUpload
                    label="แนบไฟล์/JD"
                    required
                    isUploading={isUploading}
                    uploadedFileUrl={uploadedFileUrl}
                    onChange={handleFileSelect}
                    accept=".pdf, .png, .jpg, .jpeg"
                    acceptMessage={
                      "รองรับ .pdf / .png / .jpg ขนาดไฟล์ไม่เกิน 10 MB"
                    }
                    error={errors.fileName?.message || errors.fileUrl?.message}
                    errorFile={fileError}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <PositionManagementModal
            open={positionManageModalOpen?.state}
            editingId={positionManageModalOpen?.id}
            reqId={reqId}
            onClose={() =>
              setPositionManageModalOpen({ id: null, state: false })
            }
            onSave={() =>
              setPositionManageModalOpen({ id: null, state: false })
            }
          />
        </div>
      </div>

      <footer className="rounded-full bg-white px-6 py-4 sticky bottom-0">
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
            disabled={!reqId}
            onClick={handleSubmit(onSubmit)}
          >
            ยืนยันส่งคำขอ
          </Button>
        </div>
      </footer>
    </>
  );
}
