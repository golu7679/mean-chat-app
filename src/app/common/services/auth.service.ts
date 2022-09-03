import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user;

  constructor() {
    this.currentUserDetails;
  }

  public get currentUserDetails() {
    const dataExist = localStorage.getItem("USER");
    if (dataExist) return (this.user = JSON.parse(dataExist));
  }

  public clearStorageData() {
    localStorage.removeItem("USER");
  }

  public setDataInStorage(data) {
    localStorage.setItem("USER", JSON.stringify(data));
  }
}
