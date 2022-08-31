import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user;

  constructor() {}

  public get currentUserDetails() {
    return this.user;
  }

  public clearStorageData() {}

  public setDataInStorage() {}
}
