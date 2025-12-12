import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFormComponent, GenericFormConfig, Mode } from 'auro-ui';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html'
})
export class TravelDetailsComponent implements OnInit {
  @ViewChild(BaseFormComponent) baseForm: BaseFormComponent;
  @Output() valueChanges = new EventEmitter<any>();
  @Output() formButtonEvent = new EventEmitter<any>();

  formMode: Mode = Mode.create;
  formData: any = {
    travelDetails: [
      {
        modeOfTransport: "air",
      },
    ],
  }; 

  modeOfTransportOptions: any[] = [
      { label: 'Air', value: 'air', image: 'assets/images/transport/airplaneTilt.svg' },
      { label: 'Train', value: 'train', image: 'assets/images/transport/train.svg' },
      { label: 'Bus', value: 'bus', image: 'assets/images/transport/bus.svg' },
      { label: 'Cab', value: 'cab', image: 'assets/images/transport/cab.svg' },
      { label: 'Others', value: 'others', image: '' }
    ];
    groupedCityOptions: any[] = [
  { label: "Mumbai, India (BOM)", value: "BOM" },
  { label: "New Delhi, India (DEL)", value: "DEL" },
  { label: "Bengaluru, India (BLR)", value: "BLR" },
  { label: "Chennai, India (MAA)", value: "MAA" },
  { label: "Hyderabad, India (HYD)", value: "HYD" },
  { label: "Kolkata, India (CCU)", value: "CCU" },
  { label: "Pune, India (PNQ)", value: "PNQ" },
  { label: "Ahmedabad, India (AMD)", value: "AMD" },
  ];
  timeOptions: any[] = [
    { label: "Morning (08:00 - 11:00)", value: "morning" },
    { label: "Afternoon (12:00 - 16:00)", value: "afternoon" },
    { label: "Evening (17:00 - 21:00)", value: "evening" },
  ];
  formConfig: GenericFormConfig = {
    api: '',
    cardType: 'non-border',
    autoResponsive: true,
    sections: [
        {
          sectionName: "travelDetailsSection",
          // headerTitle: "Travel Details",
          cols: 12,
          // headerClass: "text-xs col-12 font-semibold text-primary",
          sectionClass: "mb-3 w-full text-xs p-4 pb-0",
        },
    ],
    fields:[
              {
          type: "radio",
          name: "modeOfTransport",
          // label: "Mode of Transport",
          // sectionName: "travelDetailsSection",
          // options: this.modeOfTransportOptions,
          // validators: [Validators.required],
          // className: "col-12",
        },
        {
          type: "select",
          name: "departureCity",
          label: "Departure City",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          sectionName: "travelDetailsSection",
          options: this.groupedCityOptions,
          filter: true,
          placeholder: "-- Select City --",
          validators: [Validators.required],
          className: "col-12 md:col-12 lg:col-2 align-items-center",
        },
        {
          type: "date",
          name: "departureDate",
          label: "Departure Date",
          inputType: "vertical",
          inputClass: "gen-input underline-calendar pt-3",
          placeholder: "DD/MM/YYYY",
          sectionName: "travelDetailsSection",
          validators: [Validators.required],
          className: "col-12 md:col-6 lg:col-2",
        },
        {
          type: "select",
          name: "departureTime",
          label: "Departure Preferred Time",
          labelClass: "text-xs",
          sectionName: "travelDetailsSection",
          inputClass: "vertical",
          alignmentType: "vertical",
          options: this.timeOptions,
          placeholder: "-- Select Time --",
          validators: [Validators.required],
          className: "col-12 md:col-12 lg:col-2 align-items-center",
        },
        {
          type: "date",
          name: "returnDate",
          label: "Return Date",
          inputType: "vertical",
          inputClass: "gen-input underline-calendar pt-3",
          placeholder: "DD/MM/YYYY",
          sectionName: "travelDetailsSection",
          validators: [Validators.required],
          className: "col-12 md:col-6 lg:col-2",
        },
        {
          type: "select",
          name: "returnTime",
          label: "Return Preferred Time",
          sectionName: "travelDetailsSection",
          labelClass: "text-xs",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          options: this.timeOptions,
          placeholder: "-- Select Time --",
          validators: [Validators.required],
          className: "col-12 md:col-12 lg:col-2 align-items-center",
        },
        {
          type: "select",
          name: "accommodationLocation",
          inputClass: "gen-select mb-3",
          alignmentType: "vertical",
          labelClass: "text-xs",
          label: "Location Preferred for Accommodation",
          sectionName: "travelDetailsSection",
          rightIcon:true,
          icon:'fa-regular fa-magnifying-glass',
          options: this.groupedCityOptions,
          filter: true,
          placeholder: "-- Select City --",
          className: "col-12 md:col-12 lg:col-4 align-items-center",
        },
        {
          type: "files",
          name: "travelTicketFile",
          sectionName: "travelDetailsSection",
          inputType:'vertical',
          labelClass:'mb-2',
          label: "Travel Ticket",
          className: "col-12 md:col-4 lg:col-3",
        },
        {
          type: "files",
          name: "hotelBookingFile",
          sectionName: "travelDetailsSection",
          label: "Hotel Booking",
          inputType:'vertical',
          labelClass:'pb-3',
          inputClass:'pt-3',
          className: "col-12 md:col-4 lg:col-4",
        },
        {
          type:'button',
          name:'addMoreTravelDetails',
          sectionName: "travelDetailsSection",
          label:"Add More",
          btnType:'plus-btn',
          submitType:'internal',
          className: "col-2 block w-auto add-btn font-semibold",
        },
    ]
  };

  constructor() {}

  ngOnInit(): void {}

  // Parent helpers
  getValue(): any {
    return this.baseForm ? this.baseForm.form.getRawValue() : this.formData;
  }

  isValid(): boolean {
    return this.baseForm ? this.baseForm.form.valid : true;
  }
  markAllTouched(): void {
    if (this.baseForm) this.baseForm.form.markAllAsTouched();
  }

  // pass-through handlers
  handleValueChanges(ev: any) { this.valueChanges.emit(ev); }
  handleButtonEvent(ev: any) { this.formButtonEvent.emit(ev); }
}
