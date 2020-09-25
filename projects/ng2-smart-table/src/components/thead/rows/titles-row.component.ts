import { AfterViewInit, Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, of, Subject } from 'rxjs';
import { Grid } from '../../../grid-libs/grid';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, delay, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Column } from '../../../grid-libs/settings/column/column';
import { TitleActionsComponent } from '../../actions/head-action/title-actions.component';
import { CheckboxSelectAllComponent } from '../../actions/head-action/checkbox-select-all.component';

@Component({
  selector: '[ngx-rt-head-titles-row]',
  template: `
		<tr cdkDropList
		    cdkDropListOrientation="horizontal"
		    class="ngx-rt-titles"
		    (cdkDropListDropped)="drop($event)">
			<td *ngIf="showMultiSelectColumnLeft"
			    [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':''?'hidden':'',
                      left: 0}"
			    class="ngx-rt-sticky-td">
				<div #multipleSelectCheckBox
				     [grid]="grid"
				     ngx-rt-multiple-select-all
				     class="ngx-rt-action">
				</div>
			</td>
			<td *ngIf="showActionColumnLeft"
			    [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async)<4?'hidden':'',
                      left: !showMultiSelectColumnLeft ? 0: (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 + 'px'}"
			    class="ngx-rt-sticky-td">
				<div #actionsLeft
				     [grid]="grid"
				     [position]="'left'"
				     class="ngx-rt-action ngx-rt-actions-title"
				     ngx-rt-actions-title>
				</div>
			</td>
			<td *ngIf="grid.someIs(['details']) && this.grid.gridActionsFunctions.lastIsDetailView; else showAll"
			    [ngStyle]="{width : '100%',
                        left: (showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                              (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0) +'px'}"
			    class="ngx-rt-sticky-td ngx-rt-title-td">
				<div [column]="grid.getNewRow().detailCell.getColumn()"
				     [grid]="grid"
				     class="ngx-rt-title ngx-rt-title-{{ grid.getNewRow().detailCell.getColumn().id }}"
				     ngx-rt-title>
					<div class="ngx-rt-handle" [ngStyle]="{visibility:'hidden'}">
						<input [(ngModel)]="grid.getNewRow().detailCell.getColumn().anchor"
						       (ngModelChange)="anchor($event, grid.getNewRow().detailCell.getColumn())"
						       class="ngx-rt-anchor-handle"
						       type="checkbox">
					</div>
				</div>
			</td>
			<ng-template #showAll>
				<td (mousedown)="grid.gridResizeColumnsFunctions.doDrgDrop.next(true)"
				    (mouseup)="grid.gridResizeColumnsFunctions.doDrgDrop.next(false)"
				    *ngFor="let column of grid.getNotHiddenColumns(); let i = index"
				    [cdkDragDisabled]="column.anchor"
				    [ngClass]="column.class"
				    [ngStyle]="{width : column.width,
                      position: column.anchor?'sticky':'',
                      zIndex:column.anchor?6:0,
                      left: column.anchor?
                      ((showMultiSelectColumnLeft?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async) + 1 : 0) +
                       (showActionColumnLeft ? (grid.gridResizeColumnsFunctions.widthActionsColumnLeft | async) + 1 : 0)) +'px' : 0}"
				    cdkDrag
				    cdkDragLockAxis="x"
				    class="ngx-rt-title-td">
					<div ngx-rt-title
					     [column]="column"
					     [grid]="grid"
					     class="ngx-rt-title ngx-rt-title-{{ column.id }}">
						<div class="ngx-rt-handle" [ngStyle]="{visibility:'hidden'}">
							<input [(ngModel)]="column.anchor"
							       (mousedown)="$event.stopPropagation()"
							       (ngModelChange)="anchor($event, column)"
							       class="ngx-rt-anchor-handle"
							       type="checkbox">
							<div *ngIf="i !== grid.getNotHiddenColumns().length-1"
							     [ngStyle]="{width:grid.settings.resizerSize+'px'}"
							     [ngClass]="[columnInResize===column?'ngx-rt-resize-handle-hover':'']"
							     (mousedown)="resize($event, column)"
							     class="ngx-rt-resize-handle">
							</div>
						</div>
					</div>
				</td>
			</ng-template>
			<td *ngIf="showActionColumnRight"
			    [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthActionsColumnRight| async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthActionsColumnRight | async)<4?'hidden':'',
                      right: showMultiSelectColumnRight ?(grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+15+'px':'15px'}"
			    class="ngx-rt-sticky-td">
				<div #actionsRight
				     [grid]="grid"
				     [position]="'right'"
				     class="ngx-rt-action ngx-rt-actions-title"
				     ngx-rt-actions-title>
				</div>
			</td>
			<td *ngIf="showMultiSelectColumnRight"
			    [ngStyle]="{width : (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)+'px',
                      visibility:  (grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn | async)<4?'hidden':''?'hidden':'',
                       right: '15px'}"
			    class="ngx-rt-sticky-td">
				<div #multipleSelectCheckBox
				     [grid]="grid"
				     ngx-rt-multiple-select-all
				     class="ngx-rt-action">
				</div>
			</td>
			<!-- Scroller back-->
			<td [ngStyle]="{right: 0, width: '15px'}" class="ngx-rt-sticky-td"></td>
		</tr>
  `
})
export class TitlesRowComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() grid: Grid;
  @ViewChild('multipleSelectCheckBox') multipleSelectCheckBox: CheckboxSelectAllComponent;
  @ViewChild('actionsLeft') actionsLeft: TitleActionsComponent;
  @ViewChild('actionsRight') actionsRight: TitleActionsComponent;

  showMultiSelectColumnLeft: boolean;
  showMultiSelectColumnRight: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;

  oldWidth = 0;
  oldPercent = 0;
  oldWidthNext = [];
  oldWidthPrev = [];
  sumWidthPrev = 0;
  sumWidthNext = 0;
  startPosX = 0;
  columnInResize: Column;

  private destroy = new Subject<void>();

  ngAfterViewInit() {
    [this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft, this.grid.gridResizeColumnsFunctions.widthActionsColumnRight].forEach(widthAction =>
      widthAction
        .pipe(
          takeUntil(this.destroy),
          delay(0)).subscribe(() => {
        if (widthAction === this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft && this.showActionColumnLeft && this.actionsLeft) {
          this.grid.getActionColumnElementWidth([this.actionsLeft.element.nativeElement], widthAction);
        }
        if (widthAction === this.grid.gridResizeColumnsFunctions.widthActionsColumnRight && this.showActionColumnRight && this.actionsRight) {
          this.grid.getActionColumnElementWidth([this.actionsRight.element.nativeElement], widthAction);
        }
      }));

    this.grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn.pipe(
      takeUntil(this.destroy),
      delay(0))
      .subscribe(() => {
        if (this.multipleSelectCheckBox && ( this.showMultiSelectColumnLeft || this.showMultiSelectColumnRight )) {
          this.grid.getActionColumnElementWidth([this.multipleSelectCheckBox.element.nativeElement], this.grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn);
        }
      });
  }

  ngOnChanges() {
    this.showMultiSelectColumnLeft = this.grid.showMultiSelectColumnLeft();
    this.showMultiSelectColumnRight = this.grid.showMultiSelectColumnRight();
    this.showActionColumnLeft = this.grid.showActionColumnLeft();
    this.showActionColumnRight = this.grid.showActionColumnRight();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (!this.grid.getNotHiddenColumns()[event.currentIndex].anchor) {
      this.grid.gridResizeColumnsFunctions.doDrgDrop.next(false);
      const columns = this.grid.getAllColumns();
      const previousIndex = columns.indexOf(this.grid.getNotHiddenColumns()[event.previousIndex]);
      const currentIndex = columns.indexOf(this.grid.getNotHiddenColumns()[event.currentIndex]);
      moveItemInArray(this.grid.getAllColumns(), previousIndex, currentIndex);
      this.grid.refreshGrid();
    }
  }

  anchor(value: boolean, column: Column) {
    if (value) {
      const columns = this.grid.getAllColumns();
      columns.forEach((col) => {
        if (column !== col) {
          col.anchor = false;
        }
      });
      const previousIndex = columns.indexOf(column);
      moveItemInArray(this.grid.getAllColumns(), previousIndex, 0);
    }
    this.grid.refreshGrid();
  }

  resize(event: MouseEvent, column: Column) {
    event.stopPropagation();
    const el = ( event.target as HTMLElement ).closest('td');
    const columns = this.grid.getNotHiddenColumns();
    const id = columns.indexOf(column);
    this.setPreResize(event, el, columns, id);
    this.columnInResize = column;
    fromEvent(window, 'mousemove')
      .pipe(switchMap((e: MouseEvent) => {
          if (!this.grid.gridResizeColumnsFunctions.doColumnsResize.value) {
            this.grid.gridResizeColumnsFunctions.doColumnsResize.next(true);
          }
          return of(e);
        }),
        debounceTime(15),
        finalize(() => {
          this.grid.gridResizeColumnsFunctions.doColumnsResize.next(false);
          this.grid.makeResize();
          this.grid.saveSettingsToLocalStorage();
          this.grid.tableCdr.detectChanges();
          this.columnInResize = null;
        }),
        takeUntil(fromEvent(window, 'mouseup')),
        takeUntil(this.destroy))
      .subscribe((e: MouseEvent) => {
        this.makeResize(e, column);
        this.grid.tableCdr.detectChanges();
      });
  }

  setPreResize(e: MouseEvent, el, columns, id) {
    this.startPosX = e.screenX;
    this.oldWidth = el.clientWidth;
    this.oldPercent = parseInt(el.style.width, 10);
    let i = 1;
    this.oldWidthNext = [];
    this.sumWidthNext = 0;
    while (columns[id + i]) {
      const width = parseInt(columns[id + i].width, 10);
      this.oldWidthNext.push(width);
      this.sumWidthNext += width;
      i++;
    }
    i = 1;
    this.oldWidthPrev = [];
    this.sumWidthPrev = 0;
    while (columns[id - i]) {
      const width = parseInt(columns[id - i].width, 10);
      this.oldWidthPrev.push(width);
      this.sumWidthPrev += width;
      i++;
    }
  }

  minColumnWidthFix(column: Column, onePixelInPercent: number) {
    return Math.round(( column.minWidth ? column.minWidth : this.grid.settings.minColumnWidthPc ) * onePixelInPercent);
  }

  makeResize(e: MouseEvent, column: Column) {
    if (!this.grid.gridResizeColumnsFunctions.doColumnsResize.value) {
      this.startPosX = e.screenX;
    }
    const newWidth = this.oldWidth + ( e.screenX - this.startPosX );
    const thisNewPercent = Math.round(this.oldPercent * newWidth / this.oldWidth);
    const columns = this.grid.getNotHiddenColumns();
    const id = columns.indexOf(column);
    const staticWidths =
      this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft.value +
      this.grid.gridResizeColumnsFunctions.widthActionsColumnRight.value +
      this.grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn.value + 15;
    const fullWidth = ( this.grid.mainTableElementRef.nativeElement as HTMLElement ).clientWidth / 100 * this.grid.settings.innerTableWidthPc - staticWidths;
    const onePixelInPercent = ( 1 / fullWidth ) * 100 * this.grid.gridResizeColumnsFunctions.tableColumnWidthMultiplexer;
    let sumRight = 0;
    let exclude = true;
    this.oldWidthNext.forEach((o, i) => {
      if (o > this.minColumnWidthFix(columns[id + i + 1], onePixelInPercent)) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidthFix(columns[id + i + 1], onePixelInPercent)) {
        sumRight += o;
      }
    });

    let sumLeft = 0;
    exclude = true;
    this.oldWidthPrev.forEach((o, i) => {
      if (o > this.minColumnWidthFix(columns[id - i - 1], onePixelInPercent)) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidthFix(columns[id - i - 1], onePixelInPercent)) {
        sumLeft += o;
      }
    });
    // for right columns from this and this
    if (sumRight > 0 && thisNewPercent >= this.oldPercent) {
      let needDiff = thisNewPercent - this.oldPercent;
      let realDiff = 0;

      if (needDiff > 0) {
        for (let i = 0; i < this.oldWidthNext.length; i++) {
          if (needDiff > 0) {
            const minColumnWidthFix_a1 = this.minColumnWidthFix(columns[id + i + 1], onePixelInPercent);
            if (this.oldWidthNext[i] - needDiff > minColumnWidthFix_a1) {
              realDiff += needDiff;
              columns[id + i + 1].width = this.oldWidthNext[i] - needDiff + '%';
              needDiff = 0;
            } else {
              realDiff += this.oldWidthNext[i] - minColumnWidthFix_a1;
              needDiff -= this.oldWidthNext[i] - minColumnWidthFix_a1;
              if (columns[id + i + 1].width !== minColumnWidthFix_a1 + '%') {
                columns[id + i + 1].width = minColumnWidthFix_a1 + '%';
              }
            }
          } else {
            this.resetToOldNext(columns, id, i);
          }
        }
      } else {
        for (let i = 0; i < this.oldWidthNext.length; i++) {
          this.resetToOldNext(columns, id, i);
        }
      }
      column.width = this.oldPercent + realDiff + '%';
      this.nextSumCheck(columns, id);
    } else {
      for (let i = 1; i < this.oldWidthNext.length; i++) {
        this.resetToOldNext(columns, id, i);
      }
    }

    // for left columns from this

    console.log(column.minWidth, onePixelInPercent, this.minColumnWidthFix(column, onePixelInPercent));
    const minColumnWidthFix = this.minColumnWidthFix(column, onePixelInPercent);

    if (( sumLeft > 0 || this.oldPercent > minColumnWidthFix ) && thisNewPercent <= this.oldPercent) {
      let needDiff = this.oldPercent - thisNewPercent;
      let realDiff;

      if (thisNewPercent > minColumnWidthFix) {
        realDiff = needDiff;
        column.width = thisNewPercent + '%';
        needDiff = 0;
      } else {
        realDiff = this.oldPercent - minColumnWidthFix;
        needDiff -= realDiff;
        if (column.width !== minColumnWidthFix + '%') {
          column.width = minColumnWidthFix + '%';
        }
      }
      if (needDiff > 0) {
        for (let i = 0; i < this.oldWidthPrev.length; i++) {
          if (needDiff > 0) {
            const minColumnWidthFix_m1 = this.minColumnWidthFix(columns[id - i - 1], onePixelInPercent);
            if (this.oldWidthPrev[i] - needDiff > minColumnWidthFix_m1) {
              realDiff += needDiff;
              columns[id - i - 1].width = this.oldWidthPrev[i] - needDiff + '%';
              needDiff = 0;
            } else {
              realDiff += this.oldWidthPrev[i] - minColumnWidthFix_m1;
              needDiff -= this.oldWidthPrev[i] - minColumnWidthFix_m1;
              if (columns[id - i - 1].width !== minColumnWidthFix_m1 + '%') {
                columns[id - i - 1].width = minColumnWidthFix_m1 + '%';
              }
            }
          } else {
            this.resetToOldPrev(columns, id, i);
          }
        }
      } else {
        for (let i = 0; i < this.oldWidthPrev.length; i++) {
          this.resetToOldPrev(columns, id, i);
        }
      }
      columns[id + 1].width = this.oldWidthNext[0] + realDiff + '%';
      this.prevSumCheck(columns, id);
    } else {
      for (let i = 0; i < this.oldWidthPrev.length; i++) {
        this.resetToOldPrev(columns, id, i);
      }
    }
  }

  resetToOldNext(columns: Column[], id: number, i: number) {
    if (columns[id + i + 1].width !== this.oldWidthNext[i] + '%') {
      columns[id + i + 1].width = this.oldWidthNext[i] + '%';
    }
  }

  resetToOldPrev(columns: Column[], id: number, i: number) {
    if (columns[id - i - 1].width !== this.oldWidthPrev[i] + '%') {
      columns[id - i - 1].width = this.oldWidthPrev[i] + '%';
    }
  }

  prevSumCheck(columns: Column[], id: number) {
    let sum = 0;
    for (let i = 0; i < this.oldWidthPrev.length; i++) {
      sum += parseInt(columns[id - i - 1].width, 10);
    }
    sum += parseInt(columns[id + 1].width, 10);
    sum += parseInt(columns[id].width, 10);
    const oldSum = this.sumWidthPrev + this.oldPercent + this.oldWidthNext[0];
    if (sum !== oldSum) {
      columns[id + 1].width = parseInt(columns[id + 1].width, 10) - ( sum - oldSum ) + '%';
    }
  }

  nextSumCheck(columns: Column[], id: number) {
    let sum = 0;
    for (let i = 0; i < this.oldWidthNext.length; i++) {
      sum += parseInt(columns[id + i + 1].width, 10);
    }
    sum += parseInt(columns[id].width, 10);
    const oldSum = this.sumWidthNext + this.oldPercent;
    if (sum !== oldSum) {
      columns[id + 1].width = parseInt(columns[id + 1].width, 10) - ( sum - oldSum ) + '%';
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
