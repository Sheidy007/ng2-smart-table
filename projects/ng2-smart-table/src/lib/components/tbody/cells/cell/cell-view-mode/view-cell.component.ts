import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Cell } from '../../../../../lib/data-set/row/cell/cell';

@Component({
  selector: 'table-cell-view-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<div [ngSwitch]="cell.getColumn().type"
		     [ngStyle]="{overflow:'hidden'}">
			<div class="table-cell-view-default"
			     [ngStyle]="{
			     whiteSpace:'nowrap'
			     , overflow:'hidden'
			     , textOverflow:'ellipsis'}"
			     *ngSwitchDefault>{{ cell.getValue() }}</div>
			<div *ngSwitchCase="'html'"
			     [innerHTML]="cell.getValue() | sanitizeHtml"
			     [ngStyle]="{overflow:'hidden'}"
			     class="table-cell-view-html"></div>
			<custom-view-component *ngSwitchCase="'custom'"
			                       [cell]="cell"></custom-view-component>
		</div>
  `,
  styleUrls: ['./view-cell.component.scss']
})
export class ViewCellComponent {

  @Input() cell: Cell;
}
