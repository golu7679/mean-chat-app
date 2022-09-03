import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./modules/home/home.component";
import { AuthGuard } from "./common/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "login",
    loadChildren: () => import("./modules/login/login.module").then(m => m.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: "sign_up",
    loadChildren: () => import("./modules/signup/signup.module").then(m => m.SignupModule),
    canActivate: [AuthGuard],
  },
  {
    path: "account_verification",
    loadChildren: () => import("./modules/account-verification/account-verification.module").then(m => m.AccountVerificationModule),
    canActivate: [AuthGuard],
  },
  {
    path: "conversation/:id",
    loadChildren: () => import("./modules/conversation/conversation.module").then(m => m.ConversationModule),
    canActivate: [!AuthGuard],
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
