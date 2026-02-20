import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-approver-details",
  templateUrl: "./approver-details.component.html",
  styleUrls: ["./approver-details.component.scss"],
})
export class ApproverDetailsComponent implements OnInit {
  // ... inputs/outputs same as before ... 
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = ""; 
  @Output() onApproverUpdate = new EventEmitter<any[]>();

  approverTableData: any[] = [];
  approverColumns: any[] = [];

  statusOptions = [
        { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'On Hold', value: 'OnHold' }
  ];
  
  approverInfo: any[] = [];

  constructor() {}
  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('userRole') || 'Employee';
    this.initializeColumns();
  }

  patchFromApi(data: any): void {
    if (!data?.travelApprovals || !Array.isArray(data.travelApprovals)) {
      this.approverInfo = [];
      this.processTableData();
      return;
    }

    this.approverInfo = data.travelApprovals.map((approval: any) => ({
      level: `Approver ${approval.approvalLevel || 1}`,
      name: approval.approverName || '-',
      department: '-',
      status: approval.statusName || 'Pending',
      comment: approval.comment || ''
    }));

    this.processTableData();
  }

  processTableData() {
    this.approverTableData = this.approverInfo.map((approver) => ({
      ...approver,
      // For View Only mode
      statusHtml: this.getStatusBadgeHtml(approver.status) 
    }));
  }

  initializeColumns() {
    const baseColumns = [
      { field: "level", headerName: "Level" },
      { field: "name", headerName: "Manager Name (Designation)" },
      { field: "department", headerName: "Department" },
    ];

    if (this.currentRole === 'Manager') {
      this.approverColumns = [
        ...baseColumns,
        {
          field: "status",
          headerName: "Status",
          format: "#dropdown",
          options: this.statusOptions,
          editable: true,
          placeholder: 'Select',
          // CHANGE HERE: Do NOT add 'status-badge'. Only add identifier classes.
          cellClassRules: {
            'cell-approved': (row: any) => row.status === 'Approved',
            'cell-rejected': (row: any) => row.status === 'Rejected',
            'cell-on-hold': (row: any) => row.status === 'OnHold',
            'cell-pending': (row: any) => !row.status || row.status === 'Pending'
          }
        },
        {
          field: "comment",
          headerName: "Comment",
          format: "#inputbox",
          editable: true,
          placeholder: 'Add comments'
        }
      ];
    } else {
      this.approverColumns = [
        ...baseColumns,
        {
          field: "status",
          headerName: "Status",
          type: "html",
          // Original HTML Logic for View Only
          format: (row: any) => this.getStatusBadgeHtml(row.status),
        },
        {
          field: "comment",
          headerName: "Comment"
        }
      ];
    }
  }
  
  // ... helper methods (getStatusBadgeHtml, onCellValueChange) same as before ...
  getStatusBadgeHtml(statusValue: string): string {
    const status = (statusValue || "").toLowerCase();
    let statusClass = "status-pending";

    if (status === "approved") statusClass = "status-approved";
    else if (status === "rejected") statusClass = "status-rejected";
    else if (status === "onhold") statusClass = "status-on-hold";

    return `<span class="status-badge ${statusClass}">${statusValue || 'Pending'}</span>`;
  }
  
    onCellValueChange(event: any) {
    if (event && this.approverTableData[event.index]) {
      this.approverTableData[event.index][event.column] = event.value;
      this.onApproverUpdate.emit(this.approverTableData);
    }
  }
}