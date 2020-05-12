import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterModule } from './rows/filter/filter.module';
import { CellModule } from '../tbody/cells/cell/cell.module';

import { Ng2SmartTableTheadComponent } from './thead.component';
import { ActionsComponent } from './rows/action-cells/actions.component';
import { ActionsTitleComponent } from './rows/action-cells/actions-title.component';
import { AddButtonComponent } from './rows/action-cells/add-button.component';
import { CheckboxSelectAllComponent } from './rows/action-cells/checkbox-select-all.component';
import { ColumnTitleComponent } from './rows/title/column-title.component';
import { TitleComponent } from './rows/title/title.component';
import { TheadFiltersRowComponent } from './rows/thead-filters-row.component';
import { TheadFormRowComponent } from './rows/thead-form-row.component';
import { TheadTitlesRowComponent } from './rows/thead-titles-row.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const THEAD_COMPONENTS = [
  ActionsComponent,
  ActionsTitleComponent,
  AddButtonComponent,
  CheckboxSelectAllComponent,
  ColumnTitleComponent,
  TitleComponent,
  TheadFiltersRowComponent,
  TheadFormRowComponent,
  TheadTitlesRowComponent,
  Ng2SmartTableTheadComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterModule,
    CellModule,
    DragDropModule
  ],
  declarations: [
    ...THEAD_COMPONENTS
  ],
  exports: [
    ...THEAD_COMPONENTS
  ]
})
export class THeadModule { }
