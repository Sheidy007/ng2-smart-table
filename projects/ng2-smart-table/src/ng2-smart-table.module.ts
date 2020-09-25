import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TBodyModule } from './components/tbody/tbody.module';
import { THeadModule } from './components/thead/thead.module';
import { CellModule } from './components/tbody/cells/cell/cell.module';
import { FilterModule } from './components/thead/rows/filter/filter.module';
import { PagerModule } from './components/pager/pager.module';

import { SeparateModule } from './components/actions/separate-actions/separate.module';
import { ColumnShowModule } from './components/columns-show/column-show.module';
import { Ng2SmartTableComponent } from './ng2-smart-table.component';
import { CellTableViewComponent } from './components/tbody/cells/cell/cell-view/cell-table/cell-table-view.component';
import { TableEditorComponent } from './components/tbody/cells/cell/cell-editor/editor-types/table-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TBodyModule,
    THeadModule,
    CellModule,
    FilterModule,
    PagerModule,
    SeparateModule,
    ColumnShowModule
  ],
  declarations: [
    Ng2SmartTableComponent,
    CellTableViewComponent,
    TableEditorComponent
  ],
  exports: [
    Ng2SmartTableComponent,
    CellTableViewComponent,
    TableEditorComponent
  ]
})
export class Ng2SmartTableModule {
}
