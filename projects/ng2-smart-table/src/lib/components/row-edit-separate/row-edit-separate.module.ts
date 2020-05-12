import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RowEditSeparateComponent } from './row-edit-separate.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CellModule } from '../tbody/cells/cell/cell.module';
import { TBodyModule } from '../tbody/tbody.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CellModule,
    TBodyModule
  ],
  declarations: [
    RowEditSeparateComponent,
  ],
  exports: [
    RowEditSeparateComponent,
  ],
})
export class RowEditSeparateModule { }
