import { Column } from './settings/column/column';
import { Grid } from './grid';
import { BehaviorSubject, Subject } from 'rxjs';

export class GridResizeColumnFunctions {
  tableColumnWidthMultiplexer = 10;
  widthMultipleSelectCheckBoxColumn = new BehaviorSubject<number>(0);
  widthActionsColumnLeft = new BehaviorSubject<number>(0);
  widthActionsColumnRight = new BehaviorSubject<number>(0);
  doColumnsResize = new BehaviorSubject<boolean>(false);
  doDrgDrop = new Subject<boolean>();
  resetHeaderFilters = new Subject<void>();
  refreshHeaderFilters = new Subject<void>();

  constructor(private grid: Grid) {}

  resize(inputColumns: Column[]) {
    const staticWidths =
      this.widthActionsColumnLeft.value +
      this.widthActionsColumnRight.value +
      this.widthMultipleSelectCheckBoxColumn.value + 15;
    const fullWidth = ( this.grid.mainTableElementRef.nativeElement as HTMLElement ).clientWidth / 100 * this.grid.settings.innerTableWidthPc - staticWidths;
    const onePixelInPercent = ( 1 / fullWidth ) * 100 * this.tableColumnWidthMultiplexer;
    let widthSum = 0;
    inputColumns.forEach((column) => {
      if (parseInt(column.width, 10) !== 0) {
        widthSum += parseInt(column.width, 10);
      } else {
        column.width = Math.round(( column.minWidth ? column.minWidth : this.grid.settings.minColumnWidthPc ) * onePixelInPercent) + '%';
        widthSum += parseInt(column.width, 10);
      }
    });
    const k = 100 * this.tableColumnWidthMultiplexer / widthSum;
    inputColumns.forEach((column) => {
      column.width = Math.round(parseInt(column.width, 10) * k) + '%';
    });
  }
}
