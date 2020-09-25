import { ComponentRef, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Grid } from 'projects/ng2-smart-table/src/grid-libs/grid';
import { Row } from 'projects/ng2-smart-table/src/grid-libs/data-set/row/row';
import { Cell } from 'projects/ng2-smart-table/src/grid-libs/data-set/row/cell/cell';

export class BaseSeparateGrid implements OnInit, OnDestroy {
  @Input() grid: Grid;
  @Input() row: Row;
  @Input() type: 'inline' | 'expandRow' | 'quickView' | 'details' | 'modal';

  groupedCells: { groupName: string, cells: Cell[], gridColumnMax: number }[] = [];
  cellsMain: Cell[] = [];
  groupsIds = [];
  gridColumnMax = 2;
  destroy: Subject<void> = new Subject<void>();

  constructor(public gridType, public element: ElementRef) {}

  ngOnInit() {
    this.row.allCells.filter(cell => cell.getColumn()[this.gridType]).forEach(cell => {
      if (!!cell.getColumn()[this.gridType].separateGroup) {
        let group = this.groupedCells.find(g => g.groupName === cell.getColumn()[this.gridType].separateGroup);
        if (!group) {
          const newGroup = { groupName: cell.getColumn()[this.gridType].separateGroup, cells: [], gridColumnMax: 1 };
          group = this.groupedCells.push(newGroup) && newGroup;
        }
        group.cells.push(cell);
      } else {
        this.cellsMain.push(cell);
      }
    });

    const maxSetRow = Math.max(...this.cellsMain.map(cell => cell.getColumn()[this.gridType].separateGrid.gridRowPosition));
    for (let i = 1; i <= maxSetRow; i++) {
      const sum = this.cellsMain
        .filter(cell => cell.getColumn() &&
          cell.getColumn()[this.gridType] &&
          cell.getColumn()[this.gridType].separateGrid.gridRowPosition === i)
        .map(cell => cell.getColumn()[this.gridType].separateGrid.gridColumnCount)
        .reduce((a, b) => a + b + 1, 0);
      this.gridColumnMax = sum > this.gridColumnMax ? sum : this.gridColumnMax;
      const sumBlock = {};
      this.groupedCells.forEach(group => {
        sumBlock[group.groupName] =
          group.cells.filter(cell => cell.getColumn() &&
            cell.getColumn()[this.gridType] &&
            cell.getColumn()[this.gridType].separateGrid.gridRowPosition === i)
            .map(cell => cell.getColumn()[this.gridType].separateGrid.gridColumnCount)
            .reduce((a, b) => a + b + 1, 0);
        group.gridColumnMax = sumBlock[group.groupName] > group.gridColumnMax ? sumBlock[group.groupName] : group.gridColumnMax;
      });
    }
    this.gridColumnMax = this.gridColumnMax - 1;

    this.cellsMain = this.sortedCells(this.cellsMain);
    this.groupedCells.forEach(group => {group.cells = this.sortedCells(group.cells); });
    if (!['quickView', 'details'].includes(this.type)) {
      this.groupsIds = [0];
    }
    this.grid.gridActionsFunctions.onAction.next();

    switch (this.type) {
      case 'details':
      case 'quickView': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastQuickViewComponent);
        break;
      }
      case 'expandRow': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastExpandRowComponent);
        break;
      }
      case 'modal': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastModalComponent);
        break;
      }
    }
  }

  checkIsThisComponentOpenLast(subj: BehaviorSubject<ComponentRef<any>>) {
    subj.pipe(takeUntil(this.destroy))
      .subscribe((component) => {
        if (this as any !== component.instance) {
          ( this.element.nativeElement as HTMLElement ).style.display = 'none';
        } else {
          ( this.element.nativeElement as HTMLElement ).style.display = 'block';
        }
      });
  }

  sortedCells(cells: Cell[]): Cell[] {
    const maxColumnPosition = Math.max(...cells.filter(cell => cell.getColumn() && cell.getColumn()[this.gridType])
      .map(cell => cell.getColumn()[this.gridType].separateGrid.gridColumnPosition));
    return cells.filter(cell => cell.getColumn() && cell.getColumn()[this.gridType])
      .sort((cellA, cellB) => {
        const a = cellA.getColumn()[this.gridType].separateGrid.gridColumnPosition
          + cellA.getColumn()[this.gridType].separateGrid.gridRowPosition * maxColumnPosition;
        const b = cellB.getColumn()[this.gridType].separateGrid.gridColumnPosition
          + cellB.getColumn()[this.gridType].separateGrid.gridRowPosition * maxColumnPosition;
        return a > b ? 1 : a < b ? -1 : 0;
      });
  }

  openIds(id: number) {
    if (!['quickView', 'details'].includes(this.type)) {
      this.groupsIds = [id];
    } else {
      if (this.groupsIds.includes(id)) {
        this.groupsIds = this.groupsIds.filter(i => i !== id);
      } else {
        this.groupsIds.push(id);
      }
    }
  }

  ngOnDestroy() {
    this.grid.gridActionsFunctions.onAction.next();
  }
}
