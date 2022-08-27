import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConversationComponent } from "./conversation.component";
import { RouterModule } from "@angular/router";
import { MaterialsModule } from "../../materials.module";

@NgModule({
  declarations: [ConversationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ConversationComponent,
      },
    ]),
    MaterialsModule,
  ],
})
export class ConversationModule {}
