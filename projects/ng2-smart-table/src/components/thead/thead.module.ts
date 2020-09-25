import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FilterModule } from './rows/filter/filter.module';
import { CellModule } from '../tbody/cells/cell/cell.module';

import { Ng2SmartTableTheadComponent } from './thead.component';
import { CreateCancelComponent } from '../actions/head-action/add/add-create-cancel.component';
import { TitleActionsComponent } from '../actions/head-action/title-actions.component';
import { AddButtonComponent } from '../actions/head-action/add/add-button.component';
import { CheckboxSelectAllComponent } from '../actions/head-action/checkbox-select-all.component';
import { TitleComponent } from './rows/title/title.component';
import { FiltersRowComponent } from './rows/filters-row.component';
import { CreateRowComponent } from './rows/create-row.component';
import { TitlesRowComponent } from './rows/titles-row.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ResizeObserverDirective } from '../../directives/resized.directive';
import { RowShowDirective } from '../../directives/row-show.directive';
import { AddRowComponent } from './rows/add-row.component';
import { SumRowComponent } from './rows/sum-row.component';

const THEAD_COMPONENTS = [
  CreateCancelComponent,
  TitleActionsComponent,
  AddButtonComponent,
  CheckboxSelectAllComponent,
  TitleComponent,
  FiltersRowComponent,
  CreateRowComponent,
  TitlesRowComponent,
  AddRowComponent,
  SumRowComponent,
  Ng2SmartTableTheadComponent,
  ResizeObserverDirective,
  RowShowDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterModule,
    CellModule,
    DragDropModule,
    PerfectScrollbarModule
  ],
  declarations: [
    ...THEAD_COMPONENTS
  ],
  exports: [
    ...THEAD_COMPONENTS
  ]
})
export class THeadModule {}
