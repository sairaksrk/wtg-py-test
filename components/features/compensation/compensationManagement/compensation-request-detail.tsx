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
  MANPOWER_SESSION_KEY,
  ManpoweRequestListParams,
} from "@/types/manpower";
// import { RequestSearchModal } from "./request-search-modal";
import { CreditManagementModal } from "./credit-management-modal";
import { CreditTable } from "./credit-table";
import { ApprovalDetailAccordion } from "./approval-detail-accordion";

// import ErrorComponent from "@/components/common/error";
// import { formatApiError } from "@/types/api";

interface RequestFormProps {
  itemId?: any;
}

const mockDataList: any = {
  data: [
    {
      id: "01",
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
      id: "02",
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

export default function CompensationRequestdetail({ itemId }: RequestFormProps) {
  const router = useRouter();
  const alert = useAlert();
  const c = useTranslations("common");
  const m = useTranslations("manpower");
  const updateLoading = useLoadingStore((state) => state.updateLoading);

  //   useSetBreadcrumb([{ name: m("add-request-information") }]);

  const [creditManagementModalOpen, setCreditManagementModalOpen] =
    useState<ModalStateProps>({ id: null, state: false });
  const [itemManagementModalOpen, setItemManagementModalOpen] = useState({
    id: null,
    state: false,
  });
  //   const [filterCompensationOpen, setFilterCompensationOpen] = useState(false);

  const [filters, setFilters] = useTableState<ManpoweRequestListParams>(
    MANPOWER_SESSION_KEY,
    {
      page: 1,
      take: getPageSize(),
      // createDate : ""
    },
  );

  //   const {
  //     data: manpowerData,
  //     isLoading: isLoadingManpower,
  //     isError,
  //     error,
  //   } = useManpowerRequestsByID(itemId || "");

  const onSearch = (formData: any) => {
    // setFilters({ ...filters, search: formData?.requestNumber });
    // setFilters({ ...filters, createDate: formData?.createDate });
  };

  //   const updateMutation = useUpdateManpowerRequest();
  //   const isSaving = updateMutation.isPending;
  //   const isLoading = reqId ? isLoadingManpower : false;

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

  const isLoading = false;
  const isError = false;

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

  // const status = manpowerData?.userStatus;
  const status = "ฉบับร่าง";
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
