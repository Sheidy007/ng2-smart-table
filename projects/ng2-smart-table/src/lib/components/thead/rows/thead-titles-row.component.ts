import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { Grid } from '../../../lib/grid';
import { LocalDataSource } from '../../../lib/data-source/local.data-source';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Column } from 'ng2-smart-table';

@Component({
  selector: '[ng2-st-thead-titles-row]',
  template: `
		<tr cdkDropList
		    cdkDropListOrientation="horizontal"
		    class="example-list"
		    (cdkDropListDropped)="drop($event)">
			<th ng2-st-checkbox-select-all *ngIf="isMultiSelectVisible"
			    [grid]="grid"
			    [source]="source"
			    [isAllSelected]="isAllSelected"
			    (click)="selectAllRows.emit($event)"
			    [ngStyle]="{width : grid.widthMultipleSelectCheckBox}">
			</th>
			<th ng2-st-actions-title
			    *ngIf="showActionColumnLeft"
			    [grid]="grid"
			    [ngStyle]="{width : grid.widthActions}"></th>
			<th cdkDrag
			    *ngFor="let column of grid.getColumns()"
			    [ngClass]="column.class"
			    [style.width]="column.width"
			    [style.minWidth]="'100px'"
			    [style.position]="'relative'"
			    class="ng2-smart-th {{ column.id }}"
			    (mousedown)="grid.doDrgDrop = true"
          (mouseup)="grid.doDrgDrop = false">
				<ng2-st-column-title [settings]="grid.getSetting()"
				                     [source]="source"
				                     [column]="column"
				                     (sort)="sort.emit($event)"></ng2-st-column-title>
				<span [ngClass]="!grid.doDrgDrop && !grid.doResize?'resize-handle':''"
				      (mousedown)="resize($event, column)"></span>
			</th>
			<th ng2-st-actions-title *ngIf="showActionColumnRight"
			    [grid]="grid"
			    [ngStyle]="{width : grid.widthActions}"></th>
		</tr>
  `,
  styles: [`
               .resize-handle {
                   position: absolute;
                   top: 0;
                   right: 0;
                   bottom: 0;
                   width: 2px;
                   z-index: 9999;
                   cursor: col-resize;
                   background-color: black;
               }`]
})
export class TheadTitlesRowComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() isAllSelected: boolean;
  @Input() source: LocalDataSource;

  @Output() sort = new EventEmitter<any>();
  @Output() selectAllRows = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  oldWidth = 0;
  oldPercent = 0;
  oldWidthNext = 0;
  startPosX = 0;
  timer: Subscription;

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
  }

  drop(event: CdkDragDrop<string[]>) {
    this.grid.doDrgDrop = false;
    moveItemInArray(this.grid.getColumns(), event.previousIndex, event.currentIndex);
    this.grid.getRows().forEach(row => row.process());
    this.grid.getDataSet().setSettings();
  }

  resize(event: Event, column: Column) {
    event.stopPropagation();
    const el = (event.target as HTMLElement).parentElement;
    this.oldWidth = el.clientWidth;
    this.oldPercent = parseInt(el.style.width, 10);
    let columns = this.grid.getColumns();
    const id = columns.indexOf(column);
    if (columns[id + 1]) {
      this.oldWidthNext = parseInt(columns[id + 1].width, 10);
    }

    const evUp = fromEvent(window, 'mouseup').subscribe((e: MouseEvent) => {
      if (this.timer) {
        this.timer.unsubscribe();
      }
      this.grid.doResize = false;
      columns = this.grid.getColumns();
      let widthSum = 0;
      columns.forEach((col) => {
        widthSum += parseInt(col.width, 10);
      });
      columns.forEach((col) => {
        let w = Math.round(100 / widthSum * parseInt(col.width, 10));
        w = w > 5 ? w : 5;
        col.width = w + '%';
      });
      this.grid.getDataSet().setSettings();
      evUp.unsubscribe();
      evMove.unsubscribe();
    });
    const evMove = fromEvent(window, 'mousemove').subscribe((e: MouseEvent) => {
      if (this.timer) {
        this.timer.unsubscribe();
      }
      this.timer = timer(15).subscribe(() => {
        this.makeResize(e, column);
      });
    });
  }

  makeResize(e: MouseEvent, column: Column) {
    if (!this.grid.doResize) {
      this.startPosX = e.screenX;
      this.grid.doResize = true;
    }

    let result = this.oldWidth + (e.screenX - this.startPosX);
    result = this.oldPercent * result / this.oldWidth;
    result = result < 5 ? 5 : result;
    const columns = this.grid.getColumns();
    const id = columns.indexOf(column);
    if (this.oldPercent !== result) {
      if (columns[id + 1]) {
        columns[id + 1].width = this.oldWidthNext + (this.oldPercent - result) + '%';
      }
    }
    column.width = result + '%';
  }
}
