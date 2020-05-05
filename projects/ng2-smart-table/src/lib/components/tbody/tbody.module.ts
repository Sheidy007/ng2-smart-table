import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CellModule } from './cells/cell/cell.module';

import { Ng2SmartTableTbodyComponent } from './tbody.component';
import { TbodyCreateCancelComponent } from './cells/cell/cell-actions/create-cancel.component';
import { TbodyEditDeleteComponent } from './cells/cell/cell-actions/edit-delete.component';
import { TbodyCustomComponent } from './cells/cell/cell-actions/custom.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const TBODY_COMPONENTS = [
  TbodyCreateCancelComponent,
  TbodyEditDeleteComponent,
  TbodyCustomComponent,
  Ng2SmartTableTbodyComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CellModule,
    ScrollingModule,
    PerfectScrollbarModule
  ],
  declarations: [
    ...TBODY_COMPONENTS,
  ],
  exports: [
    ...TBODY_COMPONENTS,
  ],
})
export class TBodyModule { }
