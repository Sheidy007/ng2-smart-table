import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { fromEvent, of, Subject } from 'rxjs';
import { Grid } from '../../../lib/grid';
import { LocalDataSource } from '../../../lib/data-source/local.data-source';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Column } from 'ng2-smart-table';
import { debounceTime, finalize, switchMap, takeUntil } from 'rxjs/operators';

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
			    *ngFor="let column of noHideColumns; let i = index"
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
				!grid.doDrgDrop && !grid.doResize &&i!==noHideColumns.length-1?'resize-handle':''
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

  get minColumnWidthFix() {
    return this.minColumnWidth * 10;
  }

  get noHideColumns() {
    return this.grid.getNoHideColumns();
  }

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  oldWidth = 0;
  oldPercent = 0;
  oldWidthNext = [];
  oldWidthPrev = [];
  startPosX = 0;
  destroy = new Subject<void>();

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
  }

  drop(event: CdkDragDrop<string[]>) {
    this.grid.doDrgDrop = false;
    const columns = this.grid.getColumns();
    const previousIndex = columns.indexOf(this.noHideColumns[event.previousIndex]);
    const currentIndex = columns.indexOf(this.noHideColumns[event.currentIndex]);
    moveItemInArray(this.grid.getColumns(), previousIndex, currentIndex);
    this.grid.getRows().forEach(row => row.process());
    this.grid.getDataSet().setSettings();
  }

  resize(event: Event, column: Column) {
    event.stopPropagation();
    const el = (event.target as HTMLElement).parentElement;
    let columns = this.noHideColumns;
    const id = columns.indexOf(column);
    this.setPreResize(event, el, columns, id);

    fromEvent(window, 'mousemove')
      .pipe(switchMap((e: MouseEvent) => {
          if (!this.grid.doResize) {
            this.grid.doResize = true;
          }
          return of(e);
        }),
        debounceTime(15),
        finalize(() => {
          this.grid.doResize = false;
          columns = this.noHideColumns;
          let widthSum = 0;
          columns.forEach((col) => {
            widthSum += parseInt(col.width, 10);
          });
          columns.forEach((col) => {
            let w = Math.round(1000 / widthSum * parseInt(col.width, 10));
            w = w > this.minColumnWidthFix ? w : this.minColumnWidthFix;
            col.width = w + '%';
          });
          this.grid.getDataSet().setSettings();
        }),
        takeUntil(fromEvent(document, 'mouseup')),
        takeUntil(this.destroy))
      .subscribe((e: MouseEvent) => {
        this.makeResize(e, column);
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
    }

    const newWidth = this.oldWidth + (e.screenX - this.startPosX);
    const thisNewPercent = this.oldPercent * newWidth / this.oldWidth;
    const columns = this.noHideColumns;
    const id = columns.indexOf(column);

    let sumRight = 0;
    let exclude = true;
    this.oldWidthNext.forEach(o => {
      if (o > this.minColumnWidthFix) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidthFix) {
        sumRight += o;
      }
    });

    let sumLeft = 0;
    exclude = true;
    this.oldWidthPrev.forEach(o => {
      if (o > this.minColumnWidthFix) {
        exclude = false;
      }
      if (!exclude || o > this.minColumnWidthFix) {
        sumLeft += o;
      }
    });
    const nextForLeft = this.oldWidthNext[0];

    if (thisNewPercent > this.oldPercent) {
      if (sumRight > 0) {
        let needDiff = thisNewPercent - this.oldPercent;
        let realDiff = 0;
        for (let i = 0; i < this.oldWidthNext.length; i++) {
          if (this.oldWidthNext[i] !== this.minColumnWidthFix && needDiff > 0) {
            if (this.oldWidthNext[i] - needDiff > this.minColumnWidthFix) {
              realDiff += needDiff;
              columns[id + i + 1].width = this.oldWidthNext[i] - needDiff + '%';
              needDiff = 0;
              break;
            } else {
              realDiff += this.oldWidthNext[i] - this.minColumnWidthFix;
              needDiff -= this.oldWidthNext[i] - this.minColumnWidthFix;
              if (columns[id + i + 1].width !== this.minColumnWidthFix + '%') {
                columns[id + i + 1].width = this.minColumnWidthFix + '%';
              }
            }
          }
        }
        column.width = this.oldPercent + realDiff + '%';
      }
    }

    if ((sumLeft > 0 || this.oldPercent > this.minColumnWidthFix) && thisNewPercent < this.oldPercent && nextForLeft) {
      let needDiff = this.oldPercent - thisNewPercent;
      let realDiff = 0;

      if (thisNewPercent > this.minColumnWidthFix) {
        realDiff += needDiff;
        column.width = thisNewPercent + '%';
        needDiff = 0;
      } else {
        realDiff = this.oldPercent - this.minColumnWidthFix;
        needDiff = this.minColumnWidthFix - thisNewPercent;
        if (column.width !== this.minColumnWidthFix + '%') {
          column.width = this.minColumnWidthFix + '%';
        }
      }

      if (needDiff > 0) {
        for (let i = 0; i < this.oldWidthPrev.length; i++) {
          if (this.oldWidthPrev[i] !== this.minColumnWidthFix && needDiff > 0) {
            if (this.oldWidthPrev[i] - needDiff > this.minColumnWidthFix) {
              realDiff += needDiff;
              columns[id - i - 1].width = this.oldWidthPrev[i] - needDiff + '%';
              needDiff = 0;
              break;
            } else {
              realDiff += this.oldWidthPrev[i] - this.minColumnWidthFix;
              needDiff -= this.oldWidthPrev[i] - this.minColumnWidthFix;

              if (columns[id - i - 1].width !== this.minColumnWidthFix + '%') {
                columns[id - i - 1].width = this.minColumnWidthFix + '%';
              }
            }
          }
        }
      }
      columns[id + 1].width = nextForLeft + realDiff + '%';

    }
  }
}
