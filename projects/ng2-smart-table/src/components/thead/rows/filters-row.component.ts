import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Subject } from 'rxjs';

@Component({
  selector: '[ngx-rt-head-filters-row]',
  template: `
	  <tr class="ngx-rt-filters">
		  <td *ngIf="showMultiSelectColumnLeft"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':''?'hidden':'',
                      left: 0}"
		      class="ngx-rt-sticky-td"></td>
		  <td *ngIf="showActionColumnLeft"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)<4?'hidden':'',
                      left: !showMultiSelectColumnLeft ? 0: (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 + 'px'}"
		      class="ngx-rt-sticky-td">
		  </td>
		  <td *ngIf="grid.someIs(['details']) && this.grid.gridActionsFunctions.lastIsDetailView; else showAll"
		      [ngStyle]="{width : '100%',
                        left: (showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                              (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0) +'px'}"
		      class="ngx-rt-sticky-td ngx-rt-filter-td">
			  <ngx-rt-filter class="ngx-rt-filter ngx-rt-filter-{{ grid.getNewRow().detailCell.getColumn().id }}"
			                 [grid]="grid"
			                 [column]="grid.getNewRow().detailCell.getColumn()">
			  </ngx-rt-filter>
		  </td>
		  <ng-template #showAll>
			  <td *ngFor="let column of grid.getNotHiddenColumns()"
			      [ngStyle]="{position: column.anchor?'sticky':'',
                        zIndex:column.anchor?6:0,
                        left: column.anchor?
                        ((showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                        (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0)) +'px' : 0}"
			      class="ngx-rt-filter-td">
				  <ngx-rt-filter class="ngx-rt-filter ngx-rt-filter-{{ column.id }}"
				                 [grid]="grid"
				                 [column]="column">
				  </ngx-rt-filter>
			  </td>
		  </ng-template>
		  <td *ngIf="showActionColumnRight"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnRight | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnRight | async)<4?'hidden':'',
                      right: showMultiSelectColumnRight?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+15+'px':'15px'}"
		      class="ngx-rt-sticky-td">
		  </td>
		  <td *ngIf="showMultiSelectColumnRight"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':''?'hidden':'',
                      right: '15px'}"
		      class="ngx-rt-sticky-td"></td>
		  <!-- Scroller back-->
		  <td [ngStyle]="{right: 0, width: '15px'}" class="ngx-rt-sticky-td"></td>
	  </tr>
  `
})
export class FiltersRowComponent implements OnChanges, OnDestroy {

  @Input() grid: Grid;

  showMultiSelectColumnLeft: boolean;
  showMultiSelectColumnRight: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;

  private destroy = new Subject<void>();

  constructor() {}

  ngOnChanges() {
    this.showMultiSelectColumnLeft = this.grid.showMultiSelectColumnLeft();
    this.showMultiSelectColumnRight = this.grid.showMultiSelectColumnRight();
    this.showActionColumnLeft = this.grid.showActionColumnLeft();
    this.showActionColumnRight = this.grid.showActionColumnRight();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
