import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
// Import your 'auro-ui' types. Make sure the path is correct.
import {
  BaseFormComponent,
  GenericFormConfig,
  Mode,
  CommonService,
} from "auro-ui";
@Component({
  selector: "app-raise-ticket",
  templateUrl: "./raise-ticket.component.html",
  styleUrl: "./raise-ticket.component.scss",
})
export class RaiseTicketComponent implements OnInit {
  onFormValueChange($event: any) {
    throw new Error("Method not implemented.");
  }

  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  formConfig: GenericFormConfig;
  formMode: Mode = Mode.create;
  formData: any = {
    travelType: "International",
    travelDetails: [
      {
        modeOfTransport: "air",
      },
    ],
  };
  // --- User Info (Mock Data) ---

  userInfo = {
    name: "Pradeep Sharma",
    employeeId: "AP8978870",
    department: "Banking",
    grade: "10",
    designation: "Sr. Associate Manager",
  };
  // --- select Options (Mock Data) ---
  modeOfTransportOptions: any[] = [
    {
      label: "Air",
      value: "air",
      image: "assets/images/transport/airplaneTilt.svg",
    },
    {
      label: "Train",
      value: "train",
      image: "assets/images/transport/train.svg",
    },
    { label: "Bus", value: "bus", image: "assets/images/transport/bus.svg" },
    { label: "Cab", value: "cab", image: "assets/images/transport/cab.svg" },
    { label: "Others", value: "others", image: "" },
  ];

  // --- Approver Info (Mock Data) ---
  approverInfo = [
    {
      level: "Approver 1",
      name: "Mr. Amit Prasad (Business Head)",
      department: "Banking Department",
      status: "Approved",
    },
    {
      level: "Approver 2",
      name: "Mr. Amit Prasad (Business Head)",
      department: "Banking Department",
      status: "Rejected",
    },
  ];

  approverColumns = [
    { field: "level", headerName: "Level" },
    { field: "name", headerName: "Manager Name (Designation)" },
    { field: "department", headerName: "Department" },
    {
      field: "status",
      headerName: "Status",
      type: "html",
      format: (row) => {
        const status = (row.status || "").toLowerCase();
        let statusClass = "";
        if (status === "approved") {
          statusClass = "status-approved";
        } else if (status === "rejected") {
          statusClass = "status-rejected";
        } else {
          statusClass = "status-pending";
        }
        return `<span class="status-badge ${statusClass}">${row.status}</span>`;
      },
    },
  ];
  approverTableData: any[] = [];

  constructor(public svc: CommonService, private el: ElementRef) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.approverTableData = this.approverInfo.map((approver) => ({
      ...approver,
      status: approver.status,
      // status: {
      //   value: approver.status,
      //   severity: 'warning',
      // },
    }));

    this.formConfig = {
      api: "",
      cardType: "non-border",
      autoResponsive: true,
      fields: [],
    };
  }

  onFormButtonEvent(event: any) {
    if (event.field.name === "addTravelSegment") {
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
    this.baseForm.form.reset({
      travelType: "International",
    });
  }

  onSave(): void {
    const formData = this.baseForm.value;
  }

  onSubmit(): void {
    if (this.baseForm.form.valid) {
      const formData = this.baseForm.value;
    } else {
      this.baseForm.form.markAllAsTouched();
    }
  }
}
