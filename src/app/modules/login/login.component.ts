import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../common/services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  submitForm = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService) {
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
        this.router.navigate([""]);
      },
      error: async err => {
        this.submitForm = false;
        if (err.status === 403) await this.router.navigate(["/account_verification"], { state: { token: "token" } });
      },
    });
  }
}
