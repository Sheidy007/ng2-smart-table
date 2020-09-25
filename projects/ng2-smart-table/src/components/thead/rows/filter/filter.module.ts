import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from '@akveo/ng2-completer';

import { FilterComponent } from './filter.component';
import { CustomFilterComponent } from './filter-base/custom-filter.component';
import { CheckboxFilterComponent } from './filter-types/checkbox-filter.component';
import { InputFilterComponent } from './filter-types/input-filter.component';
import { SelectFilterComponent } from './filter-types/select-filter.component';
import { DefaultFilterComponent } from './filter-base/default-filter.component';
import { MultiSelectFilterComponent } from './filter-types/multi-select-filter.component';
import { CellModule } from '../../../tbody/cells/cell/cell.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from '../../../../grid-libs/sys/virtual-scroller';

const FILTER_COMPONENTS = [
  DefaultFilterComponent,
  FilterComponent,
  CustomFilterComponent,
  CheckboxFilterComponent,
  InputFilterComponent,
  SelectFilterComponent,
  MultiSelectFilterComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    CellModule,
    PerfectScrollbarModule,
    VirtualScrollerModule
  ],
  declarations: [
    ...FILTER_COMPONENTS
  ],
  exports: [
    ...FILTER_COMPONENTS
  ]
})
export class FilterModule {}
