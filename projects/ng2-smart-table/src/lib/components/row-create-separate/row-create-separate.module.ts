import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RowCreateSeparateComponent } from './row-create-separate.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CellModule } from '../tbody/cells/cell/cell.module';
import { TBodyModule } from '../tbody/tbody.module';
import { THeadModule } from '../thead/thead.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CellModule,
    TBodyModule,
    THeadModule
  ],
  declarations: [
    RowCreateSeparateComponent,
  ],
  exports: [
    RowCreateSeparateComponent,
  ],
})
export class RowCreateSeparateModule { }
