import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"]
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  // Example: Replace these with real user info from session
  loginName = "user123";
  firstName = "John";
  middleName = "K";
  lastName = "Doe";
  previousPasswords = ["Test@1234", "Pass@1234", "Old@1234"];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
            this.previousCharsValidator.bind(this),
            this.previousPasswordsValidator.bind(this),
            this.loginNameValidator.bind(this),
            this.personalNameValidator.bind(this)
          ]
        ],
        confirmPassword: ["", [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get("newPassword")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    if (password !== confirmPassword) {
      formGroup.get("confirmPassword")?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get("confirmPassword")?.setErrors(null);
    }
  }

  previousCharsValidator(control: any) {
    // Example logic: prevent 3 repeated chars
    const prev = this.previousPasswords.join("");
    const value = control.value || "";
    for (let i = 0; i < value.length - 2; i++) {
      if (prev.includes(value.substr(i, 3))) return { previousChars: true };
    }
    return null;
  }

  previousPasswordsValidator(control: any) {
    return this.previousPasswords.includes(control.value)
      ? { previousPasswords: true }
      : null;
  }

  loginNameValidator(control: any) {
    return control.value.toLowerCase().includes(this.loginName.toLowerCase())
      ? { loginName: true }
      : null;
  }

  personalNameValidator(control: any) {
    const nameArr = [this.firstName, this.middleName, this.lastName];
    for (let name of nameArr) {
      if (
        name &&
        (control.value.toLowerCase().includes(name.toLowerCase()) ||
          control.value.toLowerCase().includes(name.toLowerCase().split("").reverse().join("")))
      )
        return { personalName: true };
    }
    return null;
  }

  backToLogin() {
    this.router.navigateByUrl("authentication/login");
  }

  changedSavePassword() {
    if (this.changePasswordForm.valid) {
      alert("Password changed successfully!");
      // Call your API here
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
