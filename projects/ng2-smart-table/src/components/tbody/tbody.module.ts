import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CellModule } from './cells/cell/cell.module';

import { Ng2SmartTableTbodyComponent } from './tbody.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { THeadModule } from '../thead/thead.module';
import { RoundNumberPipe } from '../../pipes/round-number-pipe';
import { CheckboxSelectComponent } from '../actions/inline-actions/delete-show-checkbox/checkbox-select.component';
import { VirtualScrollerModule } from '../../grid-libs/sys/virtual-scroller';

const TBODY_COMPONENTS = [
  CheckboxSelectComponent,
  Ng2SmartTableTbodyComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CellModule,
    PerfectScrollbarModule,
    VirtualScrollerModule,
    ScrollingModule,
    THeadModule
  ],
  declarations: [
    ...TBODY_COMPONENTS,
    RoundNumberPipe
  ],
  exports: [
    ...TBODY_COMPONENTS
  ]
})
export class TBodyModule {}
