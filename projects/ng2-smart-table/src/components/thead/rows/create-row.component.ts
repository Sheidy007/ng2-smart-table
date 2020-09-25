import { AfterViewInit, Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';

import { Grid } from '../../../grid-libs/grid';
import { Row } from '../../../grid-libs/data-set/row/row';
import { delay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CreateCancelComponent } from '../../actions/head-action/add/add-create-cancel.component';

@Component({
  selector: '[ngx-rt-head-create-row]',
  template: `
	  <tr *ngIf="grid.settings.actions.add.viewType==='inline'"
	      class="ngx-rt-create-row">
		  <td *ngIf="showMultiSelectColumnLeft"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':'' ?'hidden':'',
                      left: 0}"
		      class="ngx-rt-sticky-td"></td>
		  <td *ngIf="showActionColumnLeft"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)<4?'hidden':'',
                      left: !showMultiSelectColumnLeft ? 0: (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 + 'px'}"
		      class="ngx-rt-sticky-td">
			  <div #actionsLeft
			       *ngIf="grid.settings.actions.add.position==='left'"
			       [grid]="grid"
			       class="ngx-rt-action ngx-rt-add-create-cancel"
			       ngx-rt-add-create-cancel>
			  </div>
		  </td>
		  <td *ngIf="grid.someIs(['details']) && this.grid.gridActionsFunctions.lastIsDetailView; else showAll"
		      [cell]="grid.getNewRow().detailCell"
		      [grid]="grid"
		      [isInEditing]="!!grid.settings.actions.add.data"
		      [isNew]="true"
		      [ngStyle]="{width : '100%',
                        left: showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0 +
                              showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) : 0 +'px'}"
		      class="ngx-rt-sticky-td ngx-rt-create-row-td ngx-rt-cell"
		      ngx-rt-cell>
		  </td>
		  <ng-template #showAll>
			  <td *ngFor="let cell of grid.getNewRow().cells"
			      [cell]="cell"
			      [grid]="grid"
			      [isInEditing]="!!grid.settings.actions.add.data"
			      [isNew]="true"
			      [ngStyle]="{ position: cell.getColumn().anchor?'sticky':'',
                        zIndex:cell.getColumn().anchor?6:0,
                        left: cell.getColumn().anchor?
                        (showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0 +
                         showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) : 0) +'px' : 0}"
			      class="ngx-rt-create-row-td ngx-rt-cell"
			      ngx-rt-cell>
			  </td>
		  </ng-template>
		  <td *ngIf="showActionColumnRight"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnRight | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnRight | async)<4?'hidden':'',
                      right: showMultiSelectColumnRight?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+15+'px':'15px'}"
		      class="ngx-rt-sticky-td">
			  <div #actionsRight
			       *ngIf="grid.settings.actions.add.position==='right'"
			       [grid]="grid"
			       class="ngx-rt-action ngx-rt-add-create-cancel"
			       ngx-rt-add-create-cancel>
			  </div>
		  </td>
		  <td *ngIf="showMultiSelectColumnRight"
		      [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':'' ?'hidden':'',
                      right: '15px'}"
		      class="ngx-rt-sticky-td"></td>
		  <!-- Scroller back-->
		  <td [ngStyle]="{right: 0, width: '15px'}" class="ngx-rt-sticky-td"></td>
	  </tr>
  `
})
export class CreateRowComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() grid: Grid;
  @Input() row: Row;
  @ViewChild('actionsLeft') actionsLeft: CreateCancelComponent;
  @ViewChild('actionsRight') actionsRight: CreateCancelComponent;

  showMultiSelectColumnLeft: boolean;
  showMultiSelectColumnRight: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;

  private destroy = new Subject<void>();

  ngAfterViewInit() {
    [this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft, this.grid.gridResizeColumnsFunctions.widthActionsColumnRight].forEach(widthAction =>
      widthAction.pipe(takeUntil(this.destroy), delay(0)).subscribe(() => {
        if (widthAction === this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft && this.showActionColumnLeft && this.actionsLeft) {
          this.grid.getActionColumnElementWidth([this.actionsLeft.element.nativeElement], widthAction);
        }
        if (widthAction === this.grid.gridResizeColumnsFunctions.widthActionsColumnRight && this.showActionColumnRight && this.actionsRight) {
          this.grid.getActionColumnElementWidth([this.actionsRight.element.nativeElement], widthAction);
        }
      }));
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
