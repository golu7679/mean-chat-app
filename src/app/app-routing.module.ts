import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "login",
    loadChildren: () => import("./modules/login/login.module").then(m => m.LoginModule),
  },
  {
    path: "sign_up",
    loadChildren: () => import("./modules/signup/signup.module").then(m => m.SignupModule),
  },
  {
    path: "account_verification",
    loadChildren: () => import("./modules/account-verification/account-verification.module").then(m => m.AccountVerificationModule),
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
