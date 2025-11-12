import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LayoutService } from "projects/app/layout/service/app.layout.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  pageType: string = "login";

  valCheck: string[] = ["remember"];

  password!: string;
  hidePassword: boolean = true;
  loginForm: FormGroup;

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Version:15.1");
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false, [Validators.requiredTrue]],
    });
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
}
