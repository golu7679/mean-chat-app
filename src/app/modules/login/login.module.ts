import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: LoginComponent,
      },
    ]),
    MaterialsModule,
  ],
})
export class LoginModule {}
