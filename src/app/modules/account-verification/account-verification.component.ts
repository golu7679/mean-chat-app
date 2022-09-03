import { Component, OnInit } from "@angular/core";
import { NgxOtpInputConfig } from "ngx-otp-input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ApiService } from "../../common/services/api.service";

@Component({
  selector: "app-account-verification",
  templateUrl: "./account-verification.component.html",
  styleUrls: ["./account-verification.component.scss"],
})
export class AccountVerificationComponent implements OnInit {
  otp: string;
  data;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: "my-super-box-class",
      input: "my-super-class",
      inputFilled: "my-super-filled-class",
      inputDisabled: "my-super-disable-class",
      inputSuccess: "my-super-success-class",
      inputError: "my-super-error-class",
    },
  };

  constructor(private snackBar: MatSnackBar, private router: Router, private apiService: ApiService) {
    this.data = this.router.getCurrentNavigation()?.extras.state;
  }

  async ngOnInit() {
    if (!this.data) {
      await this.router.navigate(["/"]);
    }
  }

  submit() {
    if (this.otp.length !== 6) {
      this.snackBar.open("Please enter your OTP", "OK", {
        duration: 3000,
      });
      return;
    }
    this.apiService.postVerifyUser({ otp: this.otp, email: this.data.email }).subscribe({
      next: async data => {
        await this.router.navigate(["/login"]);
      },
      error: err => {
        this.snackBar.open(err.error.msg || "Something went wrong, please try again later", "OK");
      },
    });
  }
}
