import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutService } from "projects/layout/service/app.layout.service";
import { DatePipe } from "@angular/common";
import { LanguageService } from "auro-ui";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  providers: [DatePipe],
})
export class LoginComponent implements OnInit {
  pageType: string = "login";
  langData: any = [
    { name: "English", code: "en" },
    { name: "हिंदी", code: "hi" },
    { name: "मराठी", code: "mr" },
    { name: "বাংলা", code: "bn" },
  ];
  valCheck: string[] = ["remember"];

  password!: string;
  hidePassword: boolean = true;
  loginForm: FormGroup;
  formattedDate: string;
  selectedLang: string;

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private translate: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLanguage("en");
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false, [Validators.requiredTrue]],
    });
    this.formattedDate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.selectedLang = "en";
    this.translate.useLanguage("en_US");
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  basicAuthentication() {
    if (
      !this.loginForm.controls["username"].value ||
      !this.loginForm.controls["password"].value
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.router.navigate(["/dashboard"]);
  }
  switchLanguage(language) {
    this.translate.useLanguage(language.value.toString());
    this.cdr.detectChanges();
  }
}
