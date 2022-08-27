import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountVerificationComponent } from "./account-verification.component";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials.module";
import { NgxOtpInputModule } from "ngx-otp-input";

@NgModule({
  declarations: [AccountVerificationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: AccountVerificationComponent,
      },
    ]),
    MaterialsModule,
    NgxOtpInputModule
  ],
})
export class AccountVerificationModule {}
