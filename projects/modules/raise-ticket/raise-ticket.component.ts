import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Mode } from "auro-ui";
import { CommonService } from "auro-ui";
import { EmployeeProfileService } from "projects/modules/shared/services/employee-profile.service";
import { ToasterService } from "auro-ui";
import { MasterDataService } from "projects/modules/shared/services/master-data.service";
import {
  CreateTravelRequestPayload,
  TravelRequestService,
  TravelRequestDetailData,
} from "projects/modules/shared/services/travel-request.service";
import { TravelTypeComponent } from "./component/travel-type/travel-type.component";
import { TravelDetailsComponent } from "./component/travel-details/travel-details.component";
import { AdvanceRequiredComponent } from "./component/advance-required/advance-required.component";
import { RequestNotesComponent } from "./component/request-notes/request-notes.component";
import { ApproverDetailsComponent } from "./component/approver-details/approver-details.component";
import { TravelAndHospitilityExpensesComponent } from "./component/travel-and-hospitility-expenses/travel-and-hospitility-expenses.component";
@Component({
  selector: "app-raise-ticket",
  templateUrl: "./raise-ticket.component.html",
  styleUrl: "./raise-ticket.component.scss",
})
export class RaiseTicketComponent implements OnInit, OnChanges {
  requestId: string = "";
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = "";
  @Input() hideLayout: boolean = false;
  @Input() requestData: TravelRequestDetailData | null = null;

  @ViewChild(TravelTypeComponent) travelTypeSection: TravelTypeComponent;
  @ViewChild(TravelDetailsComponent) travelDetailsSection: TravelDetailsComponent;
  @ViewChild(AdvanceRequiredComponent) advanceRequiredSection: AdvanceRequiredComponent;
  @ViewChild(RequestNotesComponent) requestNotesSection: RequestNotesComponent;
  @ViewChild(ApproverDetailsComponent) approverDetailsSection: ApproverDetailsComponent;
  @ViewChild(TravelAndHospitilityExpensesComponent) travelExpensesSection: TravelAndHospitilityExpensesComponent;

  formMode: Mode = Mode.create;
  formData: any = {};
  userRole: string = "";
  selectedTab: string = "Travel Details";
  userInfo$ = this.employeeProfileService.employeeCardInfo$;
  isAdvanceRequired: boolean = false;
  isSubmitting: boolean = false;

  // Handler for the event
  handleAdvanceRequiredChange(isRequired: boolean) {
    this.isAdvanceRequired = isRequired;
  }
  constructor(
    public svc: CommonService,
    private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private employeeProfileService: EmployeeProfileService,
    private masterDataService: MasterDataService,
    private travelRequestService: TravelRequestService,
    private toasterService: ToasterService
  ) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem("userRole") || "Employee";

    this.route.queryParams.subscribe((params) => {
      if (params["id"]) {
        this.requestId = params["id"];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requestData'] && this.requestData) {
      setTimeout(() => this.patchChildComponents(), 0);
    }
  }

  ngAfterViewInit() {
    if (this.viewOnly) {
      this.formMode = Mode.view;
    }
    if (this.requestData) {
      setTimeout(() => this.patchChildComponents(), 0);
    }
  }

  private patchChildComponents(): void {
    if (!this.requestData) return;

    if (this.travelTypeSection) {
      this.travelTypeSection.patchFromApi(this.requestData);
    }
    if (this.travelDetailsSection) {
      this.travelDetailsSection.patchFromApi(this.requestData);
    }
    if (this.advanceRequiredSection) {
      this.advanceRequiredSection.patchFromApi(this.requestData);
    }
    if (this.requestNotesSection) {
      this.requestNotesSection.patchFromApi(this.requestData);
    }
    if (this.approverDetailsSection) {
      this.approverDetailsSection.patchFromApi(this.requestData);
    }
    if (this.travelExpensesSection) {
      this.travelExpensesSection.patchFromApi(this.requestData);
    }
  }
  onTabChange(tab: string) {
    this.selectedTab = tab;

    if (tab === "Reimbursement Details") {
      // Logic to redirect to the specific reimbursement request
      this.router.navigate(["/reimbursement-details"]);
      // console.log('Redirecting to Reimbursement Details...');
    }
  }
  onCancel(): void {
    this.svc?.ui?.showOkDialog(
      "Any unsaved changes will be lost. Are you sure you want to cancel?",
      "Cancel this ticket ",
      () => {
        this.svc.router.navigateByUrl("/dashboard");
      }
    );
  }

  onSave(): void {
    // Intentionally left blank for now (Save behavior pending discussion).
  }

  async onSubmit(): Promise<void> {
    if (this.viewOnly) return;
    if (this.isSubmitting) return;

    const travelTypeValid = this.travelTypeSection?.isValid?.() ?? true;
    const travelDetailsValid = this.travelDetailsSection?.isValid?.() ?? true;
    const advanceRequiredValid = this.advanceRequiredSection?.isValid?.() ?? true;
    const requestNotesValid = this.requestNotesSection?.isValid?.() ?? true;

    if (!travelTypeValid) this.travelTypeSection?.markAllTouched?.();
    if (!travelDetailsValid) this.travelDetailsSection?.markAllTouched?.();
    if (!advanceRequiredValid) this.advanceRequiredSection?.markAllTouched?.();
    if (!requestNotesValid) this.requestNotesSection?.markAllTouched?.();

    if (!travelTypeValid || !travelDetailsValid || !advanceRequiredValid || !requestNotesValid) {
      this.toasterService.showToaster({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete all required fields before submitting.",
      });
      return;
    }

    const employee = this.employeeProfileService.getCachedEmployeeCardInfo();
    const employeeCode = employee?.employeeId?.toString();
    if (!employeeCode) {
      this.toasterService.showToaster({
        severity: "error",
        summary: "Error",
        detail: "Employee code not found. Please login again.",
      });
      return;
    }

    const travelTypeValue = this.travelTypeSection?.getValue?.() ?? {};
    const travelDetailsValue = this.travelDetailsSection?.getValue?.() ?? {};
    const advanceRequiredValue = this.advanceRequiredSection?.getValue?.() ?? {};
    const requestNotesValue = this.requestNotesSection?.getValue?.() ?? {};

    const travelDetailsRows: any[] = Array.isArray(travelDetailsValue?.travelDetails)
      ? travelDetailsValue.travelDetails
      : [];

    const dates = this.getTravelStartEndDates(travelDetailsValue, travelDetailsRows);
    if (!dates) {
      this.toasterService.showToaster({
        severity: "error",
        summary: "Error",
        detail: "Please add at least one travel detail with valid dates.",
      });
      return;
    }

    const payload: CreateTravelRequestPayload = {
      travelTypeId: Number(travelTypeValue?.travelType),
      expenseTypeId: Number(travelTypeValue?.expenseType),
      purposeOfTravelId: Number(travelTypeValue?.purposeOfTravel),
      nameOfClientOrProject: (travelTypeValue?.clientProjectName ?? "").toString(),
      projectPin: (travelTypeValue?.projectPin ?? "").toString(),
      travelStartDate: dates.travelStartDateIso,
      travelEndDate: dates.travelEndDateIso,
      employeeCode,
      descriptionNote: (requestNotesValue?.requestNotes ?? null)?.toString?.() ?? null,
      travelDetails: travelDetailsRows.map((row) => {
        const transportId = Number(row?.modeOfTransportId ?? row?.modeOfTransport);
        const fromLocation = this.getCityLabel(row?.fromLocation ?? row?.fromCity);
        const toLocation = this.getCityLabel(row?.toLocation ?? row?.toCity);

        const departure = this.asDate(row?.departureDate);
        const ret = this.asDate(row?.returnDate);

        const nights = Number(row?.noOfNights ?? row?.nights ?? 0);
        const daysFromDates =
          departure && ret ? this.diffDaysInclusive(departure, ret) : null;
        const noOfDays = daysFromDates ?? (nights > 0 ? nights + 1 : 1);

        return {
          modeOfTransportId: transportId,
          transportName: this.masterDataService.getNameById(
            "modeOfTransports",
            transportId
          ),
          fromLocation,
          toLocation,
          departureDate: this.toApiDateTime(departure),
          returnDate: this.toApiDateTime(ret),
          departureTime: (row?.departureTime ?? null)?.toString?.() ?? null,
          returnTime: (row?.returnTime ?? null)?.toString?.() ?? null,
          noOfDays,
          noOfNights: nights,
          accommodationRequired: Boolean(
            row?.accommodationRequired ?? row?.isAccommodationRequired
          ),
          accomodationLocation:
            (row?.accomodationLocation ?? row?.accommodationLocation ?? null)
              ?.toString?.() ?? null,
        };
      }),
      advanceRequiredDetails: this.buildAdvanceRequiredDetails(
        advanceRequiredValue
      ),
      // Admin-only editable sections must be empty on create.
      advanceGivenDetails: [],
      travelHospitalityExpenses: [],
    };

    // Basic contract sanity checks
    if (
      !payload.travelTypeId ||
      !payload.expenseTypeId ||
      !payload.purposeOfTravelId ||
      !payload.nameOfClientOrProject ||
      !payload.projectPin
    ) {
      this.toasterService.showToaster({
        severity: "error",
        summary: "Validation Error",
        detail: "Please complete Travel Type section before submitting.",
      });
      return;
    }

    this.isSubmitting = true;
    try {
      const response = await this.travelRequestService.createTravelRequest(payload);
      const travelRequestId = response?.data?.travelRequestId;

      if (response?.isSuccess && travelRequestId) {
        this.toasterService.showToaster({
          severity: "success",
          summary: "Success",
          detail: response?.message || "Travel request created successfully",
        });

        this.router.navigate(["/view-request"], {
          queryParams: { id: travelRequestId },
        });
        return;
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private buildAdvanceRequiredDetails(advanceRequiredValue: any): any[] {
    const isAdvanceRequired = Boolean(advanceRequiredValue?.advanceRequired);
    const details: any[] = Array.isArray(advanceRequiredValue?.advanceRequiredDetails)
      ? advanceRequiredValue.advanceRequiredDetails
      : [];

    if (!isAdvanceRequired) return [];

    return details.map((row) => ({
      isAdvanceRequired: true,
      currencyTypeId: Number(row?.currencyTypeId ?? row?.currency),
      forexRate: Number(row?.forexRate ?? 0),
      amount: Number(row?.amount ?? 0),
      amountInInr: Number(row?.amountInInr ?? row?.amountInINR ?? 0),
      // Not captured by current UI for Employees; explicitly send null.
      expectedAdvanceDate: null,
    }));
  }

  private getTravelStartEndDates(
    travelDetailsValue: any,
    rows: any[]
  ): { travelStartDateIso: string; travelEndDateIso: string } | null {
    const topStart = this.asDate(travelDetailsValue?.travelDate);
    const topEnd = this.asDate(travelDetailsValue?.returnDate);

    const departures = rows
      .map((r) => this.asDate(r?.departureDate))
      .filter((d): d is Date => !!d);
    const returns = rows
      .map((r) => this.asDate(r?.returnDate))
      .filter((d): d is Date => !!d);

    const start = departures.length
      ? new Date(Math.min(...departures.map((d) => d.getTime())))
      : topStart;
    const end = returns.length
      ? new Date(Math.max(...returns.map((d) => d.getTime())))
      : topEnd;

    if (!start || !end) return null;

    return { travelStartDateIso: start.toISOString(), travelEndDateIso: end.toISOString() };
  }

  private getCityLabel(cityValue: any): string {
    // Handle new object format from autocomplete
    if (typeof cityValue === 'object' && cityValue?.label) {
      return cityValue.label;
    }
    // Handle string value (backward compatibility)
    return (cityValue ?? "").toString();
  }

  private asDate(value: any): Date | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  private toApiDateTime(date: Date | null): string {
    if (!date) return "";
    // Backend sample uses date time without timezone (00:00:00). Preserve date-only intent.
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T00:00:00`;
  }

  private diffDaysInclusive(start: Date, end: Date): number {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    const diff = Math.floor((e - s) / (24 * 60 * 60 * 1000));
    return Math.max(1, diff + 1);
  }
}
