import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';

@Component({
  selector: '[ngx-rt-checkbox-select]',
  template: `
	  <div (click)="onSelect($event)"
	       class="ngx-rt-checkbox-select-container">
		  <input [ngModel]="row.getData().system_info_777_isSelected"
		         [disabled]="!grid.settings.canSelectedFunction(row.getData())"
		         type="checkbox">
	  </div>
  `
})
export class CheckboxSelectComponent {
  @Input() grid: Grid;
  @Input() row: Row;
  constructor(public element: ElementRef) {}
  onSelect(event: any) {
    event.stopPropagation();
    this.grid.reverseRowSelectedFlagOnMultiple(this.row);
  }
}
