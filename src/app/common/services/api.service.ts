import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  private authHeader(token?: string) {
    if (!token) {
    }
    return new HttpHeaders({
      Authorization: `Token ${token}`,
    });
  }

  postSignUp(data) {
    return this.httpClient.post(environment.apiUrl + "users/register", data);
  }

  postLogin(data) {
    return this.httpClient.post(environment.apiUrl + "users/login", data);
  }

  postVerifyUser(data) {
    return this.httpClient.post(environment.apiUrl + "users/verify_otp", data);
  }

  postForget(data) {
    return this.httpClient.post(environment.apiUrl + "users/forget", data);
  }

  changePassword(data) {
    return this.httpClient.post(environment.apiUrl + "users/change_password", data);
  }
}
