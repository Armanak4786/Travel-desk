import { Component, EventEmitter, OnInit, Output,Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-travel-visa',
  templateUrl: './travel-visa.component.html',
  styleUrls: ['./travel-visa.component.scss']
})
export class TravelVisaComponent implements OnInit {
  @Output() valueChanges = new EventEmitter<any>();
  @Input() viewOnly: boolean = false;
  @Input() currentRole: string = '';
  visaForm: FormGroup;
  uploadedFiles: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.visaForm = this.fb.group({
      documents: [[]]
    });

    this.visaForm.valueChanges.subscribe(val => {
      this.valueChanges.emit(val);
    });
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const objectUrl = URL.createObjectURL(file);

      const fileObj = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        url: objectUrl
      };

      this.uploadedFiles.push(fileObj);
      this.updateDocumentsControl();
      event.target.value = '';
    }
  }

  removeFile(index: number) {
    URL.revokeObjectURL(this.uploadedFiles[index].url);
    this.uploadedFiles.splice(index, 1);
    this.updateDocumentsControl();
  }

  viewFile(file: any) {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  }

  // New Download Method
  downloadFile(file: any) {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name; // Sets the filename for download
    link.click();
  }

  updateDocumentsControl() {
    this.visaForm.patchValue({ documents: this.uploadedFiles });
  }
}