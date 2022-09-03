import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../common/services/api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../../common/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  submitForm = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  async submit() {
    if (this.loginForm.invalid) return;
    this.loginForm.disable();
    this.submitForm = true;
    this.apiService.postLogin(this.loginForm.value).subscribe({
      next: data => {
        delete data["msg"];
        this.authService.setDataInStorage(data);
        this.snackBar.open("Logged in successfully", "OK");
        this.router.navigate([""]);
        window.location.reload();
      },
      error: async err => {
        this.loginForm.enable();
        this.snackBar.open(err.error.msg, "OK", {
          duration: 3000,
          panelClass: "error-snackbar",
        });
        this.submitForm = false;
        if (err.status === 403) await this.router.navigate(["/account_verification"], { state: { email: this.loginForm.value.email } });
      },
    });
  }
}
