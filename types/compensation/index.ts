export const COMPENSATION_SESSION_KEY = "compensation-table-state";

export const COMPENSATION_REQUEST_SESSION_KEY =
  "compensation-request-table-state";

export const CREDIT_LIMIT_LIST_SESSION_KEY = "credit-limit-list-table-state";

export interface CompensationListParams {
  page?: number;
  take?: number;
  search?: string;
  requestNo?: string;
  startDate?: number | null;
  endDate?: number | null;
  departmentId?: string;
  positionId?: string;
  status?: string;
  responsibleHrId?: string;
  name?: string;
  positionLevelId?: string;
}
// ตาราง จัดการค่าตอบแทน
export interface CompensationList {
  id: string;
  createdAt: string;
  name: string;
  employeeCount: number;
  status: string;
  approvedBy: string | null;
}

// สร้าง จัดการค่าตอบแทน
export interface CreateCompensationItem {
  name: string;
  remarks: string;
}

export interface UpdateCompensationItem {
  id: string;
  name: string;
  remarks: string;
}

export interface CompensationItem {
  id: string;
  name: string;
  remarks: string;
}

// ตาราง รายการบริหารวงเงิน
export interface CreditLimitList {
  id: string;
  name: string;
  employeeCount: number;
  totalSalary: number;
  positionLevelNames: string[];
  allocPercent: number;
  status: string;
  reviewerName: string | null;
}

// สร้าง รายการบริหารวงเงิน

export interface CreateCreditLimit {
  payrollPeriodId: string;
  name: string;
  reviewerId: string;
  allocPercent: number;
  id?: string[];
  positionLevelIds?: string[];
  structureUnitIds?: string[];
}

// ข้อมูล หน้าจัดการรายการบริหารวงเงิน ById

export interface CompensationPeriod {
  id: string;
  name: string;
  status: string;
  createdAt: number;
  creatorName: string | null;
}

export interface CompensationGroup {
  id: string;
  name: string;
  status: string;
  createdAt: number;
  creatorName?: string | null;

  totalSalary: number;
  budgetPercent: number;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;

  positionLevelIds: string[];
  positionLevelNames: string[];

  structureUnitIds: string[];

  reviewerId: string;
  reviewerName?: string | null;

  allocPercent: number;
  employeeCount: number;
}

export interface CompensationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
}

// ข้อมูล รายการบริหารวงเงิน Byid

export interface CompensationRequestData {
  period: CompensationPeriod;
  groups: CompensationGroup[];
  meta: CompensationMeta;
}

// ข้อมูล Group Checkbox

export interface GroupItem {
  value: string;
  label: string;
  // id: string;
  // name: string;
  reviewerName?: string | null;
}

// ดึงรายชื่อพนักงานในกลุ่มพร้อมผลคะแนนประเมินและการจัดสรร
export interface PreviewRoundData {
  allocPercent?: number | null;
  allocQuotaPercent?: number | null;
  allocAmount?: number | null;
}

export interface PreviewDataItem {
  employeeId: string;
  round1?: PreviewRoundData;
  round2?: PreviewRoundData;
  round3?: PreviewRoundData;
}

export interface GetCompensationPersonnelParams {
  page: number;
  take: number;
  previewData?: PreviewDataItem[];
  search?: string;
  requestNo?: string;
  name?: string;
  positionId?: string;
  positionLevelId?: string;
  departmentId?: string;
}

// บันทึกข้อมูลแถวการคำนวณโดยใช้ groupsId ใน URL path
export interface SaveCompensationItem {
  id: string;
  allocPercent: number | null;
  allocAmount: number | null;
  allocQuotaPercent: number | null;
  evaluationScore: number | null;
  evaluationResult: string | null;
}

export interface SaveCompensationPayload {
  items: SaveCompensationItem[];
}
