import { Component, OnInit, ViewChild, Input,ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Mode } from 'auro-ui';
import {
  BaseFormComponent,
  GenericFormConfig,
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
  requestId:string="";
@Input() viewOnly: boolean = false;
@Input() currentRole: string = '';
@Input() hideLayout: boolean = false;
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  formConfig: GenericFormConfig;
  formMode: Mode = Mode.create;
  formData: any = {};
  userRole: string = '';
selectedTab: string = 'Travel Details';
  // --- User Info (Mock Data) ---
  userInfo = {
    name: "Pradeep Sharma",
    employeeId: "AP8978870",
    department: "Banking",
    grade: "10",
    designation: "Sr. Associate Manager",
  };

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
    { field: "department", headerName: "Department"},
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

  constructor(public svc: CommonService, private el: ElementRef,private router:Router,private route:ActivatedRoute) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem('userRole') || 'Employee';
    this.approverTableData = this.approverInfo.map((approver) => ({
      ...approver,
      status: approver.status,
      // status: {
      //   value: approver.status,
      //   severity: 'warning',
      // },
    }));

        this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.requestId = params['id'];
      }
  })

    this.formConfig = {
      api: "",
      cardType: "non-border",
      autoResponsive: true,
      fields: [],
    };
  }

ngAfterViewInit() {
    // Check if we are in View Only mode AND if baseForm exists
    if (this.viewOnly) {
      
      // Disable the entire form
      this.formMode = Mode.view;

      // (Optional) Apply your manual unlock logic here if needed
      // this.applyAdminPermissions();
    }
  }
  onTabChange(tab: string) {
  this.selectedTab = tab;

  if (tab === 'Reimbursement Details') {
    // Logic to redirect to the specific reimbursement request
    this.router.navigate(['/reimbursement-details']);
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
