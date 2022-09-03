import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { io } from "socket.io-client";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Message {
  mine?: boolean;
  created: Date;
  from: string;
  text: string;
  conversationId: string;
  inChatRoom: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: any;
  private apiUrl: string = `${environment.apiUrl}/messages`;
  private usersUrl: string = `${environment.apiUrl}users`;

  constructor(public authService: AuthService, public http: HttpClient) {}

  connect(email: string, callback: Function = () => {}): void {
    // initialize the connection
    this.socket = io(environment.chatUrl, { path: environment.chatPath });

    this.socket.on("error", error => {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    });

    this.socket.on("connect", () => {
      this.sendUser(email);
      console.log("connected to the chat server");
      callback();
    });
  }

  isConnected(): boolean {
    return !!this.socket;
  }

  sendUser(username: string): void {
    this.socket.emit("email", { email: username });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  getConversation(name1: string, name2: string): any {
    let url = this.apiUrl;
    if (name2 != "chat-room") {
      let route = "/" + name1 + "/" + name2;
      url += route;
    }

    let authToken = this.authService.currentUserDetails.token;
    return this.http.post(url, {}, { headers: new HttpHeaders(`Authorization: ${authToken}`) });
  }

  getUserList(): any {
    let url = this.usersUrl;
    let authToken = this.authService.currentUserDetails.token;
    return this.http.get(url, { headers: new HttpHeaders(`Authorization: ${authToken}`) });
  }

  receiveMessage(): any {
    return new Observable(observer => {
      this.socket.on("message", (data: Message) => {
        observer.next(data);
      });
    });
  }

  receiveActiveList(): any {
    return new Observable(observer => {
      this.socket.on("active", data => {
        observer.next(data);
      });
    });
  }

  sendMessage(message: Message, chatWith: string): void {
    this.socket.emit("message", { message: message, to: chatWith });
  }

  getActiveList(): void {
    this.socket.emit("getactive");
  }

  extractData(res: Response): any {
    let body = res.json();
    return body || {};
  }
}
