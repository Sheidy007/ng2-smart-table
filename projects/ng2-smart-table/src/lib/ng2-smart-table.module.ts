import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CellModule } from './components/tbody/cells/cell/cell.module';
import { FilterModule } from './components/thead/rows/filter/filter.module';
import { PagerModule } from './components/pager/pager.module';
import { TBodyModule } from './components/tbody/tbody.module';
import { THeadModule } from './components/thead/thead.module';

import { Ng2SmartTableComponent } from './ng2-smart-table.component';
import { ColumnShowModule } from './components/columns-show/column-show.module';
import { RowEditSeparateModule } from './components/row-edit-separate/row-edit-separate.module';
import { RowCreateSeparateModule } from './components/row-create-separate/row-create-separate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CellModule,
    FilterModule,
    PagerModule,
    TBodyModule,
    THeadModule,
    ColumnShowModule,
    RowEditSeparateModule,
    RowCreateSeparateModule
  ],
  declarations: [
    Ng2SmartTableComponent
  ],
  exports: [
    Ng2SmartTableComponent
  ]
})
export class Ng2SmartTableModule {
}
