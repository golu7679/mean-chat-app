import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConversationComponent } from "./conversation.component";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials.module";
import { FormsModule } from "@angular/forms";
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [ConversationComponent, MessageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ConversationComponent,
      },
    ]),
    MaterialsModule,
    FormsModule
  ],
})
export class ConversationModule {}
