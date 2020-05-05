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
			    *ngFor="let column of grid.getColumns(); let i = index"
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
				<span [ngClass]="
				!grid.doDrgDrop && !grid.doResize &&i!==grid.getColumns().length-1?'resize-handle':''
"
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
                   z-index: 2;
                   cursor: col-resize;
                   background-color: black;
               }`]
})
export class TheadTitlesRowComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() isAllSelected: boolean;
  @Input() source: LocalDataSource;
  @Input() minColumnWidth: number;

  @Output() sort = new EventEmitter<any>();
  @Output() selectAllRows = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  oldWidth = 0;
  oldPercent = 0;
  oldWidthNext = [];
  oldWidthPrev = [];
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
    let columns = this.grid.getColumns();
    const id = columns.indexOf(column);
    this.setPreResize(event, el, columns, id);

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
        w = w > this.minColumnWidth ? w : this.minColumnWidth;
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

  setPreResize(e, el, columns, id) {
    this.startPosX = e.screenX;
    this.oldWidth = el.clientWidth;
    this.oldPercent = parseInt(el.style.width, 10);
    let i = 1;
    this.oldWidthNext = [];
    while (columns[id + i]) {
      this.oldWidthNext.push(parseInt(columns[id + i].width, 10));
      i++;
    }
    this.oldWidthPrev = [];
    i = 1;
    while (columns[id - i]) {
      this.oldWidthPrev.push(parseInt(columns[id - i].width, 10));
      i++;
    }
  }

  makeResize(e: MouseEvent, column: Column) {
    if (!this.grid.doResize) {
      this.startPosX = e.screenX;
      this.grid.doResize = true;
    }

    const newWidth = this.oldWidth + (e.screenX - this.startPosX);
    const thisNewPercent = this.oldPercent * newWidth / this.oldWidth;
    const columns = this.grid.getColumns();
    const id = columns.indexOf(column);

    let sumRight = 0;
    let exclude = true;
    this.oldWidthNext.forEach(o => {
      if (o > this.minColumnWidth) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidth) {
        sumRight += o;
      }
    });

    let sumLeft = 0;
    exclude = true;
    this.oldWidthPrev.forEach(o => {
      if (o > this.minColumnWidth) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidth) {
        sumLeft += o;
      }
    });
    const nextForLeft = this.oldWidthNext[0];

    if (thisNewPercent > this.oldPercent) {
      if (sumRight > 0) {
        let needDiff = thisNewPercent - this.oldPercent;
        let realDiff = 0;
        for (let i = 0; i < this.oldWidthNext.length; i++) {
          if (this.oldWidthNext[i] !== this.minColumnWidth && needDiff > 0) {
            if (this.oldWidthNext[i] - needDiff > this.minColumnWidth) {
              realDiff += needDiff;
              columns[id + i + 1].width = this.oldWidthNext[i] - needDiff + '%';
              needDiff = 0;
              break;
            } else {
              realDiff += this.oldWidthNext[i] - this.minColumnWidth;
              needDiff -= this.oldWidthNext[i] - this.minColumnWidth;
              if (columns[id + i + 1].width !== this.minColumnWidth + '%') {
                columns[id + i + 1].width = this.minColumnWidth + '%';
              }
            }
          }
        }
        column.width = this.oldPercent + realDiff + '%';
      }
    }

    if (thisNewPercent < this.oldPercent && nextForLeft) {
      if (sumLeft > 0) {
        let needDiff = this.oldPercent - thisNewPercent;
        let realDiff = 0;

        if (thisNewPercent > this.minColumnWidth) {
          realDiff += needDiff;
          column.width = thisNewPercent + '%';
          needDiff = 0;
        } else {
          realDiff = this.oldPercent - this.minColumnWidth;
          needDiff = this.minColumnWidth - thisNewPercent;
          if (column.width !== this.minColumnWidth + '%') {
            column.width = this.minColumnWidth + '%';
          }
        }

        if (needDiff > 0) {
          for (let i = 0; i < this.oldWidthPrev.length; i++) {
            if (this.oldWidthPrev[i] !== this.minColumnWidth && needDiff > 0) {
              if (this.oldWidthPrev[i] - needDiff > this.minColumnWidth) {
                realDiff += needDiff;
                columns[id - i - 1].width = this.oldWidthPrev[i] - needDiff + '%';
                needDiff = 0;
                break;
              } else {
                realDiff += this.oldWidthPrev[i] - this.minColumnWidth;
                needDiff -= this.oldWidthPrev[i] - this.minColumnWidth;

                if (columns[id - i - 1].width !== this.minColumnWidth + '%') {
                  columns[id - i - 1].width = this.minColumnWidth + '%';
                }
              }
            }
          }
        }
        columns[id + 1].width = nextForLeft + realDiff + '%';
      }
    }
  }
}
