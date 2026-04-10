export const MANPOWER_SESSION_KEY = "manpower-table-state";

export const COMPENSATION_SESSION_KEY = "compensation-table-state";

export const COMPENSATION_REQUEST_SESSION_KEY =
  "compensation-request-table-state";

// RP-01 *************************************************

export interface PositionItems {
  positionTypeId: string;
  positionLevelId: string;
  positionId: string;
  amount: number;
}

export interface ManpowerRequestList {
  id: string;
  requestNumber: string;
  submissionDate: string;
  agency: string;
  numberOfAmount: number;
  status: string;
  responsiblePerson: string;
  createdAt?: string;
  updatedAt?: string;
  userStatus?: string;
  totalAmount: number;
  departmentId?: string | null;
  departmentName?: string | null;
  reason: string;
  existingMission: string;
  additionalMission: string;
  jdDocUrl?: string;
  fileName?: string;
  fileUrl?: string;
  items: PositionItems[];
}

export interface ManpowerRequestData {
  requesterId: string;
  departmentId?: string | null;
  departmentName?: string | null;
  reason: string;
  existingMission: string;
  additionalMission: string;
  jdDocUrl: string;
  organizationId: string;
  organizationName: string;
}
export interface HRConsiderationData {
  hrDecisionDate: string | null;
  hrMemoUrl: string | null;
  hrRejectReason: string | null;
  hrRemark: string | null;
  responsibleHrId: string | null;
}
export interface MinistryConsiderationData {
  ministryDecisionDate: string | null;
  ministryDocumentNo: string | null;
  ministryRejectReason: string | null;
}

export interface ManpowerRequestDetail {
  createdAt: string;
  updatedAt: string;
  id: string;
  requestNo: string;
  status: string;
  userStatus: string;
  hrStatus?: string | null;
  createBy: string;

  header: ManpowerRequestData;
  items: PositionItems[];
  hrConsideration: HRConsiderationData;
  ministryConsideration: MinistryConsiderationData;
}

/**
 * DTOs (Data Transfer Objects)
 */

export interface CreatePositionItemDto {
  items: PositionItems[];
}

export interface AddPositionItemDto {
  positionTypeId: string;
  positionLevelId: string;
  positionId: string;
  amount: number;
}

export interface UpdatePositionItemDto {
  positionTypeId: string;
  positionLevelId: string;
  positionId: string;
  amount: number;
}

export interface UpdateManpowerRequestsDto {
  departmentId?: string | null;
  departmentName?: string | null;
  reason: string;
  existingMission: string;
  additionalMission: string;
  jdDocUrl?: string;
  fileName?: string;
  fileUrl?: string;
}

/**
 * Query parameters
 */

export interface ManpoweRequestListParams {
  page?: number;
  take?: number;
  search?: string;
  requestNumber?: string;
}

// RP-03 *************************************************

export interface DashboardManPowerList {
  id: string;
  req: string;
  date: string;
  agency: string;
  number_1: number;
  number_2: number;
  number_3: number;
  number_4: number;
  number_5: number;
  number_6: number;
}

// PY ---------------------------------------------------------------------------------

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

export interface CompensationList {
  id: string;
  requestNumber: string;
  submissionDate: string;
  agency: string;
  numberOfAmount: number;
  status: string;
  responsiblePerson: string;
  createdAt?: string;
  updatedAt?: string;
  userStatus?: string;
  totalAmount: number;
  departmentId?: string | null;
  departmentName?: string | null;
  reason: string;
  existingMission: string;
  additionalMission: string;
  jdDocUrl?: string;
  fileName?: string;
  fileUrl?: string;
  items: PositionItems[];
}
