import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Row } from 'ng2-smart-table';

@Component({
  selector: '[ngx-rt-head-sum-row]',
  template: `
	  <tr class="ngx-rt-sum-row" *ngIf="sumRow">
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
		  <td *ngIf="grid.someIs(['details']) && grid.gridActionsFunctions.lastIsDetailView; else showAll"
		      [cell]="sumRow.detailCell"
		      [grid]="grid"
		      [isInEditing]="false"
		      [isNew]="false"
		      [ngStyle]="{ left: ((showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                            (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0)) +'px'  }"
		      class="ngx-rt-sum-cell ngx-rt-sticky-td"
		      ngx-rt-cell>
		  </td>
		  <ng-template #showAll>
			  <td *ngFor="let cell of sumRow.cells"
			      [cell]="cell"
			      [grid]="grid"
			      [isInEditing]="false"
			      [isNew]="false"
			      [ngStyle]="{ position: cell.getColumn().anchor?'sticky':'',
                      zIndex:cell.getColumn().anchor?6:0,
                      left: cell.getColumn().anchor?
                      ((showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                       (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0)) +'px' : 0}"
			      class="ngx-rt-sum-cell"
			      ngx-rt-cell>
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
export class SumRowComponent implements OnChanges, OnInit, OnDestroy {

  @Input() grid: Grid;
  showMultiSelectColumnLeft: boolean;
  showMultiSelectColumnRight: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  private destroy = new Subject<void>();
  sumRow: Row;

  constructor() {}

  ngOnInit() {
    this.initSum();
    this.grid.source.onChanged.pipe(takeUntil(this.destroy)).subscribe((data) => {
      this.initSum();
    });
  }

  initSum() {
    this.sumRow = this.grid.dataSet.createRow(-2, {});
    const sumRowData = {};
    this.grid.dataSet.filteredAndSortedRows.value.forEach(row => {
      row.cells.forEach(c => {
        if (c.getColumn().type === 'number') {
          sumRowData[c.getId()] = ( sumRowData[c.getId()] == null ? 0 : sumRowData[c.getId()] ) + ( c.cellValue.realValue ? c.cellValue.realValue : 0 );
        }
      });
    });
    this.sumRow.setData(sumRowData);
  }

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
