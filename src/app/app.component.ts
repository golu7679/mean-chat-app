import { Component, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "./common/services/auth.service";
import { ApiService } from "./common/services/api.service";
import { ChatService } from "./common/services/chat.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  userAuthenticated = false;
  title = "chat-app";

  @ViewChild("drawer") private drawer: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );
  folders = [
    {
      name: "Photos",
      updated: new Date("1/1/16"),
    },
    {
      name: "Recipes",
      updated: new Date("1/17/16"),
    },
    {
      name: "Work",
      updated: new Date("1/28/16"),
    },
  ];
  notes = [
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
    },
  ];

  usersList: any;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private apiService: ApiService, private chatService: ChatService) {
    this.userAuthenticated = this.authService.currentUserDetails;
    if (authService.currentUserDetails) {
      this.getUsersList();
    }
  }

  getUsersList() {
    this.connectToChat();
  }

  connectToChat() {
    if (this.chatService.isConnected()) {
    } else {
      this.chatService.connect(this.authService.currentUserDetails.user.email, () => {
        this.chatService.getUserList().subscribe({
          next: data => {},
          error: err => {},
        });
      });
    }
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  public logout() {
    this.authService.clearStorageData();
    this.userAuthenticated = this.authService.currentUserDetails;
  }
}
