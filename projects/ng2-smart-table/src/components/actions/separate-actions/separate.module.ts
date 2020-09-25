import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CustomSeparateComponent } from './custom-separate/custom-separate.component';
import { EditSeparateComponent } from './edit-separate/edit-separate.component';
import { ShowSeparateComponent } from './show-separate/show-separate.component';
import { CreateSeparateComponent } from './create-separate/create-separate.component';
import { CellModule } from '../../tbody/cells/cell/cell.module';
import { TBodyModule } from '../../tbody/tbody.module';
import { THeadModule } from '../../thead/thead.module';

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
    CreateSeparateComponent,
    CustomSeparateComponent,
    EditSeparateComponent,
    ShowSeparateComponent,
  ],
  exports: [
    CreateSeparateComponent,
    CustomSeparateComponent,
    EditSeparateComponent,
    ShowSeparateComponent,
  ],
})
export class SeparateModule { }
