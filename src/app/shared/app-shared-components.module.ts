import { NgModule  } from "@angular/core";
import { SharedModule } from "./app-shared.module";
import { ConfirmDialogComponent } from '../components/generic/confirm-dialog/confirm-dialog.component';

export const components = [
  ConfirmDialogComponent
];

@NgModule({
  declarations: [components],
  imports: [SharedModule],
  exports: [components],
})
export class SharedGenericComponentsModule {}
