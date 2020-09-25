import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Subject } from 'rxjs';

@Component({
  selector: '[ngx-rt-head-add-row]',
  template: `
	  <tr *ngIf="grid.settings.actions.add && (!grid.settings.actions.add.data || grid.settings.actions.add.viewType!=='inline')"
	      class="ngx-rt-add-row">
		  <td class="ngx-rt-sticky-td ngx-rt-add-row-td">
			  <div class="ngx-rt-add-row-content"
			       [ngStyle]="{width: ((grid.pagingSource.viewportWidth | async) - 1)+'px'}">
				  <ngx-rt-add-button [grid]="grid"
				                     class="ngx-rt-add-button">
				  </ngx-rt-add-button>
			  </div>
		  </td>
	  </tr>
  `
})
export class AddRowComponent implements OnChanges, OnDestroy {

  @Input() grid: Grid;

  private destroy = new Subject<void>();

  constructor() {}

  ngOnChanges() {
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
