import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "auro-ui";
import { ToasterService } from "auro-ui";
import { firstValueFrom } from "rxjs";

export interface CreateTravelRequestTravelDetailPayload {
  modeOfTransportId: number;
  transportName: string | null;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  returnDate: string;
  departureTime: string | null;
  returnTime: string | null;
  noOfDays: number;
  noOfNights: number;
  accommodationRequired: boolean;
  accomodationLocation: string | null;
}

export interface CreateTravelRequestAdvanceRequiredDetailPayload {
  isAdvanceRequired: boolean;
  currencyTypeId: number;
  forexRate: number;
  amount: number;
  amountInInr: number;
  expectedAdvanceDate: string | null;
}

export interface CreateTravelRequestPayload {
  travelTypeId: number;
  expenseTypeId: number;
  purposeOfTravelId: number;
  nameOfClientOrProject: string;
  projectPin: string;
  travelStartDate: string;
  travelEndDate: string;
  employeeCode: string;
  descriptionNote: string | null;
  travelDetails: CreateTravelRequestTravelDetailPayload[];
  advanceRequiredDetails: CreateTravelRequestAdvanceRequiredDetailPayload[];
  advanceGivenDetails: any[];
  travelHospitalityExpenses: any[];
}

export interface TravelRequestCreateData {
  travelRequestId: number;
  statusId: number;
  currentApprovalLevel: number;
  createdAt: string;
  updatedAt: string;
  travelTypeId: number;
  expenseTypeId: number;
  purposeOfTravelId: number;
  nameOfClientOrProject: string;
  projectPin: string;
  descriptionNote: string | null;
  travelStartDate: string;
  travelEndDate: string;
  employeeCode: string;
  travelDetails: any[];
  advanceRequiredDetails: any[];
  advanceGivenDetails: any[];
  travelApprovals: any[];
  travelHospitalityExpenses: any[];
}

export interface TravelRequestCreateResponse {
  data: TravelRequestCreateData;
  error: any;
  message: string | null;
  warnings: any;
  isSuccess: boolean;
}

export interface BasicTravelRequestItem {
  travelRequestId: number;
  travelTypeName: string;
  expenseTypeName: string;
  purposeName: string;
  travelStartDate: string;
  travelEndDate: string;
  employeeCode: string;
  employeeName: string;
  statusName: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface BasicTravelRequestsResponse {
  data: PagedResult<BasicTravelRequestItem>;
  error: any;
  message: string | null;
  isSuccess: boolean;
}

export interface TravelDetailResponse {
  travelDetailId: number;
  modeOfTransportId: number;
  transportName: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  returnDate: string;
  departureTime: string | null;
  returnTime: string | null;
  noOfDays: number;
  noOfNights: number;
  accommodationRequired: boolean;
  accomodationLocation: string | null;
}

export interface AdvanceRequiredDetailResponse {
  isAdvanceRequired: boolean;
  currencyTypeId: number;
  forexRate: number;
  amount: number;
  amountInInr: number;
  expectedAdvanceDate: string | null;
}

export interface TravelApprovalResponse {
  travelApprovalId: number;
  travelRequestId: number;
  approvalLevel: number;
  employeeCode: string;
  approverName: string;
  statusId: number;
  statusName: string;
  comment: string;
  actionDate: string | null;
}

export interface TravelRequestDetailData {
  travelRequestId: number;
  travelTypeId: number;
  travelTypeName: string;
  expenseTypeId: number;
  expenseTypeName: string;
  purposeOfTravelId: number;
  purposeName: string;
  nameOfClientOrProject: string;
  projectPin: string;
  descriptionNote: string | null;
  travelStartDate: string;
  travelEndDate: string;
  employeeCode: string;
  employeeName: string;
  statusId: number;
  statusName: string;
  currentApprovalLevel: number;
  createdAt: string;
  updatedAt: string;
  travelDetails: TravelDetailResponse[];
  advanceRequiredDetails: AdvanceRequiredDetailResponse[];
  advanceGivenDetails: any[];
  travelApprovals: TravelApprovalResponse[];
}

export interface TravelRequestDetailResponse {
  data: TravelRequestDetailData;
  error: any;
  message: string | null;
  warnings: any;
  isSuccess: boolean;
}

@Injectable({
  providedIn: "root",
})
export class TravelRequestService {
  private apiUrl: string = "";

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private toasterService: ToasterService
  ) {}

  async createTravelRequest(
    payload: CreateTravelRequestPayload
  ): Promise<TravelRequestCreateResponse | null> {
    try {
      await this.configService.waitForConfig();
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;

      const url = `${this.apiUrl}/TravelRequests`;
      const response = await firstValueFrom(
        this.http.post<TravelRequestCreateResponse>(url, payload)
      );

      if (response?.isSuccess) {
        return response;
      }

      throw new Error(response?.message || "Failed to create travel request");
    } catch (error: any) {
      console.error("Error creating travel request:", error);
      this.toasterService.showToaster({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to create travel request. Please try again.",
      });
      return null;
    }
  }

  async getBasicTravelRequests(
    page: number,
    pageSize: number
  ): Promise<BasicTravelRequestsResponse | null> {
    try {
      await this.configService.waitForConfig();
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;

      const url = `${this.apiUrl}/TravelRequests/basic?page=${page}&pageSize=${pageSize}`;
      const response = await firstValueFrom(
        this.http.get<BasicTravelRequestsResponse>(url)
      );

      if (response?.isSuccess) {
        return response;
      }

      throw new Error(response?.message || "Failed to fetch travel requests");
    } catch (error: any) {
      console.error("Error fetching travel requests:", error);
      this.toasterService.showToaster({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to fetch travel requests. Please try again.",
      });
      return null;
    }
  }

  async getTravelRequestById(
    id: number | string
  ): Promise<TravelRequestDetailResponse | null> {
    try {
      await this.configService.waitForConfig();
      const config = this.configService.getConfig();
      this.apiUrl = config.TravelDesk_Server;

      const url = `${this.apiUrl}/TravelRequests/${id}`;
      const response = await firstValueFrom(
        this.http.get<TravelRequestDetailResponse>(url)
      );

      if (response?.isSuccess) {
        return response;
      }

      throw new Error(response?.message || "Failed to fetch travel request details");
    } catch (error: any) {
      console.error("Error fetching travel request details:", error);
      this.toasterService.showToaster({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to fetch travel request details. Please try again.",
      });
      return null;
    }
  }
}

