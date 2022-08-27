import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignupComponent } from "./signup.component";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials.module";

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: SignupComponent
    }]),
    MaterialsModule
  ],
})
export class SignupModule {}
