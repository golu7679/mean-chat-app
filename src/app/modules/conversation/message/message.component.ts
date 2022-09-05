import { Component, Input } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
})
export class MessageComponent {

  @Input() msg: any;
  time: string;

  constructor() {

  }

  ngAfterViewInit() {
    this.updateFromNow();
    setInterval(() => {
      this.updateFromNow();
    }, 60000);
  }

  updateFromNow(): void {
    this.time = moment(this.msg.created).fromNow();
  }
}
