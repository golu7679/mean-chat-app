import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../common/services/auth.service";
import { ApiService } from "../../common/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  hide = true;
  singUpForm: FormGroup;
  submitForm = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private apiService: ApiService, private snackbar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.singUpForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  submit() {
    if (this.singUpForm.invalid) return;
    this.submitForm = true;
    this.singUpForm.disable();
    this.apiService.postSignUp(this.singUpForm.value).subscribe({
      next: async data => {
        this.snackbar.open("Check your node console", "OK");
        await this.router.navigate(["account_verification"], { state: { email: this.singUpForm.value.email } });
      },
      error: err => {
        this.submitForm = false;
        this.singUpForm.enable();
        this.snackbar.open(err.error.message, "OK", {
          duration: 3000,
          panelClass: "error-snackbar",
        });
      },
    });
  }
}
