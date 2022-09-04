import { Component, ElementRef, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "./common/services/auth.service";
import { ApiService } from "./common/services/api.service";
import { ChatService, Message } from "./common/services/chat.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  userAuthenticated = false;
  title = "chat-app";

  userList: Array<any>;
  showActive: boolean;
  userEmail: string;
  currentOnline: boolean;
  receiveActiveObs: any;
  chatWith: string;

  notify: boolean;
  notification: any = { timeout: null };

  @ViewChild("drawer") private drawer: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );
  usersList: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private apiService: ApiService,
    private chatService: ChatService,
    public el: ElementRef,
    public router: Router,
  ) {}

  async ngOnInit() {
    this.userAuthenticated = this.authService.currentUserDetails;
    this.userEmail = this.authService.currentUserDetails.user.email;
    if (this.authService.currentUserDetails) {
      this.getUsersList();
    }
  }

  getUsersList() {
    this.connectToChat();
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  public logout() {
    this.authService.clearStorageData();
    this.userAuthenticated = this.authService.currentUserDetails;
  }

  connectToChat(): void {
    let connected = this.chatService.isConnected();
    if (connected) {
      this.initReceivers();
    } else {
      this.chatService.connect(this.userEmail, () => {
        this.initReceivers();
      });
    }
  }

  getUserList(): void {
    this.chatService.getUserList().subscribe(data => {
      let users = data.users;
      for (let i = 0; i < users.length; i++) {
        if (users[i].email === this.userEmail) {
          users.splice(i, 1);
          break;
        }
      }
      this.userList = users.sort(this.compareByUsername);

      this.receiveActiveObs = this.chatService.receiveActiveList().subscribe(users => {
        for (let onlineUsr of users) {
          if (onlineUsr.email !== this.userEmail) {
            let flagg = 0;
            for (let registered of this.userList) {
              if (registered.email == onlineUsr.email) {
                flagg = 1;
                break;
              }
            }
            if (flagg == 0) {
              this.userList.push(onlineUsr);
              this.userList.sort(this.compareByUsername);
            }
          }
        }

        for (let user of this.userList) {
          let flag = 0;
          for (let liveUser of users) {
            if (liveUser.email == user.email) {
              user.online = true;
              flag = 1;
              break;
            }
          }
          if (flag == 0) {
            user.online = false;
          }
        }
        this.currentOnline = this.checkOnline(this.chatWith);
      });

      this.chatService.getActiveList();
    });
  }

  initReceivers(): void {
    this.getUserList();
  }

  checkMine(message: Message): void {
    if (message.from == this.userEmail) {
      message.mine = true;
    }
  }

  onUsersClick(): void {
    this.showActive = !this.showActive;
  }

  notifSound(): void {
    let sound: any = this.el.nativeElement.querySelector("#notifSound");
    sound.play();
  }

  msgSound(): void {
    let sound: any = this.el.nativeElement.querySelector("#msgSound");
    sound.load();
    sound.play();
  }

  checkOnline(name: string) {
    for (let user of this.userList) {
      if (user.email == name) {
        return user.online;
      }
    }
  }

  compareByUsername(a, b): number {
    if (a.username < b.username) return -1;
    if (a.username > b.username) return 1;
    return 0;
  }
}
