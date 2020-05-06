import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ColumnShowComponent } from './column-show.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  declarations: [
    ColumnShowComponent,
  ],
  exports: [
    ColumnShowComponent,
  ],
})
export class ColumnShowModule { }
