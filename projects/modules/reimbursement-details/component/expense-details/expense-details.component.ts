import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit {
  expenseForm: FormGroup;
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  @Output() totalChange = new EventEmitter<number>();
  // Summary variables
  totalExpenses: number = 0;
  advanceAmount: number = 20; // Default from your config

  reimbursementTypeOptions: any[] = [
    { label: "Car", value: "car" },
    { label: "Travel", value: "travel" },
    { label: "Food", value: "food" },
  ];

  currencyOptions: any[] = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "AED", value: "AED" },
    { label: "GBP", value: "GBP" },
    { label: "SGD", value: "SGD" }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.checkViewMode();
  }

  initForm() {
    this.expenseForm = this.fb.group({
      expenseDetails: this.fb.array([])
    });


if (sessionStorage.getItem("userRole") !== 'Employee') {
      // If Admin/Finance: Load dummy data (2 Rows)
      this.addSampleRows();
    } else if (!this.viewOnly) {
      // If Employee (Creator): Start with 1 empty row
      this.addExpenseItem();
    }

    // Listen for changes to update the Grand Total
    this.expenseDetails.valueChanges.subscribe(() => {
      this.calculateTotalExpenses();
    });
  }

  get expenseDetails(): FormArray {
    return this.expenseForm.get('expenseDetails') as FormArray;
  }

addSampleRows() {
    // 1. Create Dummy Files
    // We create a fake PDF and a fake Image using a simple string array as content.
    const dummyPdf = new File(["dummy content"], "airport_cab_invoice.pdf", { type: "application/pdf" });
    const dummyImg = new File(["dummy content"], "client_dinner_receipt.png", { type: "image/png" });

    // Row 1: Cab Expense (With PDF)
    const row1 = this.createExpenseItem();
    row1.patchValue({
      expenseDate: new Date(), 
      reimbursementType: 'travel',
      particulars: 'Cab to Airport from Office',
      billFile: dummyPdf, // <--- Attached dummy file
      currency: 'INR',
      amount: 1500,
      forexRate: 1,
      inrAmount: 1500
    });
    this.expenseDetails.push(row1);

    // Row 2: Client Dinner (With Image)
    const row2 = this.createExpenseItem();
    row2.patchValue({
      expenseDate: new Date(),
      reimbursementType: 'food',
      particulars: 'Dinner with Client',
      billFile: dummyImg, // <--- Attached dummy file
      currency: 'USD',
      amount: 50,
      forexRate: 84,
      inrAmount: 4200
    });
    this.expenseDetails.push(row2);
  }
  // NEW: Helper to disable the form
  checkViewMode() {
    if (this.viewOnly || (this.currentRole && this.currentRole !== 'Employee')) {
      this.expenseForm.disable(); // This disables all inputs, dropdowns, and rows automatically
    }
  }

  createExpenseItem(): FormGroup {
    const group = this.fb.group({
      expenseDate: [new Date(), Validators.required],
      reimbursementType: [null, Validators.required],
      particulars: ['', Validators.required],
      billFile: [null], // Placeholder for file
      currency: ['INR', Validators.required],
      amount: [null, Validators.required],
      forexRate: [1, Validators.required], // Default to 1
      inrAmount: [{ value: 0, disabled: true }]
    });

    // Row-level calculation listener
    group.valueChanges.subscribe(val => {
      this.calculateRowINR(group);
    });

    return group;
  }

  addExpenseItem() {

const item = this.createExpenseItem();
    
    // Edge Case: If we are in view mode and somehow adding a row (e.g. patching data), 
    // ensure the new row is also disabled.
    if (this.expenseForm.disabled) {
        item.disable();
    }
    
    this.expenseDetails.push(item);
  }

  removeExpenseItem(index: number) {
    if (this.expenseForm.disabled) return;
    this.expenseDetails.removeAt(index);
  }

  // Calculate INR for a specific row
  calculateRowINR(group: FormGroup) {
    const amount = group.get('amount')?.value || 0;
    const rate = group.get('forexRate')?.value || 0;
    const total = amount * rate;
    
    // Update without emitting to avoid infinite loops
    if (group.get('inrAmount')?.value !== total) {
      group.get('inrAmount')?.setValue(total, { emitEvent: false });
    }
  }

  // Calculate Grand Total
  calculateTotalExpenses() {
    this.totalExpenses = this.expenseDetails.controls.reduce((acc, curr) => {
      const inr = curr.get('inrAmount')?.value || 0;
      return acc + inr;
    }, 0);
        this.totalChange.emit(this.totalExpenses); 
  }


  // Helper to handle file selection (visual only)
  onFileSelect(event: any, index: number) {
    if (this.expenseForm.disabled) return;
    const file = event.files[0];
    this.expenseDetails.at(index).patchValue({ billFile: file });
  }
viewFile(file: File) {
  if (!file) return;

  // Create a URL for the file object and open it in a new tab
  const fileUrl = URL.createObjectURL(file);
  window.open(fileUrl, '_blank');
}
  // Helper to remove file
  removeFile(index: number) {
    if (this.expenseForm.disabled) return;
    this.expenseDetails.at(index).patchValue({ billFile: null });
  }

}