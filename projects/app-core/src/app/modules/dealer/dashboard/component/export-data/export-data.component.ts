import { Component, ElementRef, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrintService } from 'auro-ui';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'], // Corrected property name
})
export class ExportDataComponent {
  exportData = [
    { name: 'CSV', code: 'csv' }, // Ensure lowercase codes match the PrintService type
    { name: 'PDF', code: 'pdf' },
    { name: 'Excel', code: 'xlsx' },
  ];
  selectedExportValue: string = '';
  exportDisplayName: 'csv' | 'pdf' | 'xlsx' | 'png' | 'txt' = 'csv'; // Use allowed types

  constructor(
    private printSer: PrintService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  changeExportEvent(e: any) {
    this.exportDisplayName = e.value as 'csv' | 'pdf' | 'xlsx'; // Ensure type safety
  }

  close() {
    this.ref.close({});
  }

  export() {
    const { tableId, dt } = this.config.data || {};
    if (!tableId || !dt) {
      // console.error('Table ID or data is missing');
      return;
    }

    let columns = dt.columns || [];
    const data = dt.dataList || [];

    if (columns) {
      columns = columns.filter((column) => column.headerName !== 'Action');
    }
    if (this.exportDisplayName) {
      this.printSer.export(this.exportDisplayName, tableId, columns, data);
    } else {
      // console.error('No export format selected');
    }
  }
}
