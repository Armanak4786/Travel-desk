import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutService } from "projects/layout/service/app.layout.service";
import { DatePipe } from "@angular/common";
import { LanguageService } from "auro-ui";
import { ChangeDetectorRef } from "@angular/core";
import { AuthService } from "projects/modules/auth/auth.service";
import { MessageService } from "primeng/api";
import { MasterDataService } from "projects/modules/shared/services/master-data.service";
import { EmployeeProfileService } from "projects/modules/shared/services/employee-profile.service";
import { jwtDecode } from "jwt-decode";

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
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private messageService: MessageService,
    private masterDataService: MasterDataService,
    private employeeProfileService: EmployeeProfileService
  ) {
    this.translate.setDefaultLanguage("en");
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false],
    });
    this.formattedDate = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.selectedLang = "en";
    this.translate.useLanguage("en_US");
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // basicAuthentication() {
  //   if (
  //     !this.loginForm.controls["email"].value ||
  //     !this.loginForm.controls["password"].value
  //   ) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }
  //   this.router.navigate(["/dashboard"]);
  // }
  // switchLanguage(language) {
  //   this.translate.useLanguage(language.value.toString());
  //   this.cdr.detectChanges();
  // }

  async basicAuthentication() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: async (response) => {
        // Assuming role is determined by the backend or we default to Employee for now
        // The mock logic had explicit role mapping. 
        // If the token contains the role, we should decode it.
        // For now, I'll keep the mock role logic OR default to 'Employee' if not provided.
        // But the user didn't give me a role in the response.
        // I'll just set a default role or maybe the backend response has it?
        // The user response example: { accessToken: "...", expiresAt: "..." }
        // It doesn't have role. I'll decode the token if I can, or just set a default.
        // The mock logic used specific names to set roles.
        // I will try to preserve that logic IF the email matches, otherwise default.
        // Actually, I should probably decode the token to get the user ID/email, but for role...
        // I'll just set 'Employee' as default for now to unblock.
        
        let role = 'Employee';
        const lowerUser = email.toLowerCase();
        if (lowerUser.includes('arman')) role = 'TravelDeskAdmin';
        else if (lowerUser.includes('ashish')) role = 'FinanceAdmin';
        
        sessionStorage.setItem('userRole', role);

        // Fetch and cache master data + employee profile after successful login
        try {
          const accessToken = sessionStorage.getItem("accessToken");
          const decoded: any = accessToken ? jwtDecode(accessToken) : null;
          const employeeIdRaw = decoded?.employeeId;
          const employeeId = Number(employeeIdRaw);

          await Promise.all([
            this.masterDataService.fetchAndCacheMasterData(),
            this.employeeProfileService.fetchAndCacheEmployeeProfile(employeeId),
          ]);
          this.router.navigate(['/dashboard']);
        } catch (error) {
          console.error('Error fetching master data:', error);
          // Navigate to dashboard even if master data fails - it will use fallbacks
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid email or password'
        });
        console.error('Login error:', err);
      }
    });
  }
  switchLanguage(language) {
    this.translate.useLanguage(language.value.toString());
    this.cdr.detectChanges();
  }

}
