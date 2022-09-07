import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChatService, Message } from "../../common/services/chat.service";
import { AuthService } from "../../common/services/auth.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.scss"],
})
export class ConversationComponent implements OnInit {
  receiverEmail: string;
  userInfo: any;
  messageList: Array<Message>;
  sendForm: FormGroup;
  conversationId: string;
  chatWith: string;
  noMsg: boolean;
  receiveMessageObs: any;

  notify: boolean;
  notification: any = { timeout: null };
  senderMessage: string = "";

  senderName: any;

  @ViewChild("chat_scroller") private chatScroller: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private chatService: ChatService, private authService: AuthService, public el: ElementRef) {
    this.receiverEmail = this.activatedRoute.snapshot.params["email"];
    this.senderName = this.activatedRoute.snapshot.params["name"];
  }

  ngOnInit(): void {
    this.userInfo = this.authService.currentUserDetails;
    this.getMessages(this.receiverEmail);
    // this.chatService.getConversation(this.authService.currentUserDetails.user.email, this.receiverEmail).subscribe({
    //   next: (data) => {
    //
    //   },
    //   error: (err) => {
    //     this.snackBar.open(err.error.msg || "Unable to fetch message please try again later", "OK");
    //   },
    // });
  }

  ngAfterViewInit() {
    try {
      this.chatScroller.nativeElement.scrollTop = this.chatScroller.nativeElement.scrollHeight;
    } catch (e) {
      console.log(e);
    }
  }

  ngAfterViewChecked() {
    try {
      this.chatScroller.nativeElement.scrollTop = this.chatScroller.nativeElement.scrollHeight;
    } catch (e) {
      console.log(e);
    }
  }

  getMessages(name: string): void {
    this.chatService.getConversation(this.userInfo.user.email, name).subscribe(async data => {
      this.conversationId = data.conversation._id || data.conversation._doc._id;
      let messages = data.conversation.messages || null;
      if (messages && messages.length > 0) {
        for (let message of messages) {
          this.checkMine(message);
        }
        this.noMsg = false;
        this.messageList = messages;
        // this.scrollToBottom();
      } else {
        this.noMsg = true;
        this.messageList = [];
      }
    });

    this.receiveMessageObs = this.chatService.receiveMessage().subscribe(message => {
      this.checkMine(message);
      if (message.conversationId == this.conversationId) {
        this.noMsg = false;
        this.messageList.push(message);
        // this.scrollToBottom();
        this.msgSound();
      } else if (message.mine !== true) {
        if (this.notification.timeout) {
          clearTimeout(this.notification.timeout);
        }
        this.notification = {
          from: message.from,
          text: message.text,
          timeout: setTimeout(() => {
            this.notify = false;
          }, 4000),
        };
        this.notify = true;
        this.notifSound();
      }
    });
  }

  checkMine(message: Message): void {
    if (message.from == this.userInfo.user.email) {
      message.mine = true;
    }
  }

  // scrollToBottom(): void {
  //   let element: any = this.el.nativeElement.querySelector(".custom");
  //   setTimeout(() => {
  //     element.scrollTop = element.scrollHeight;
  //   }, 100);
  // }

  notifSound(): void {
    let sound: any = this.el.nativeElement.querySelector("#notifSound");
    sound.play();
  }

  msgSound(): void {
    let sound: any = this.el.nativeElement.querySelector("#msgSound");
    sound.load();
    sound.play();
  }

  sendMessage() {
    if (!this.senderMessage.length) return;
    let newMessage: Message = {
      created: new Date(),
      from: this.userInfo.user.email,
      text: this.senderMessage,
      conversationId: this.conversationId,
    };

    this.chatService.sendMessage(newMessage, this.receiverEmail);
    newMessage.mine = true;
    this.noMsg = false;
    this.messageList.push(newMessage);
    // this.msgSound();
    this.senderMessage = "";
  }
}
