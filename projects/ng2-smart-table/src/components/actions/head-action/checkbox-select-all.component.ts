import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';

import { Grid } from '../../../grid-libs/grid';

@Component({
  selector: '[ngx-rt-multiple-select-all]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<div (click)="onSelect($event)"
		     class="ngx-rt-checkbox-select-container">
			<input [ngModel]="grid.isAllSelected | async"
			       [indeterminate]="grid.someIsSelected | async"
			       type="checkbox">
		</div>
  `
})
export class CheckboxSelectAllComponent {
  @Input() grid: Grid;

  constructor(public element: ElementRef) {}

  onSelect(event: MouseEvent) {
    event.stopPropagation();
    this.grid.allRowReverseSelectFlag();
  }
}
