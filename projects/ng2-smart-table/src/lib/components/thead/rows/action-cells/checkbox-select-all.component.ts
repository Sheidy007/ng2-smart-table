import { Component, Input } from '@angular/core';

import { Grid } from '../../../../lib/grid';
import { LocalDataSource } from '../../../../lib/data-source/local.data-source';

@Component({
  selector: '[ng2-st-checkbox-select-all]',
  template: `
    <input type="checkbox" [ngModel]="isAllSelected">
  `,
})
export class CheckboxSelectAllComponent {

  @Input() grid: Grid;
  @Input() source: LocalDataSource;
  @Input() isAllSelected: boolean;
}
