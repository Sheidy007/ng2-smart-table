import { Cell } from './cell';
import { Column } from './column';
import { DataSet } from './data-set';

export class Row {

  isSelected = false;
  isInEditing = false;
  showHiddenColumns = false;
  cells: Cell[] = [];
  hiddenCells: Cell[] = [];
  constructor(public index: number, protected data: any, protected dataSet: DataSet) {
    this.process();
  }

  getCells() {
    return this.cells;
  }

  getData(): any {
    return this.data;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }

  getNewData(): any {
    const values = Object.assign({}, this.data);
    this.getCells().forEach((cell) => values[cell.getColumn().id] = cell.newValue);
    return values;
  }

  setData(data: any): any {
    this.data = data;
    this.process();
  }

  process() {
    this.cells = [];
    this.dataSet.getNoHideColumns().forEach((column: Column) => {
      const cell = this.createCell(column);
      this.cells.push(cell);
    });
    this.hiddenCells = [];
    this.dataSet.getHideColumns().forEach((column: Column) => {
      const cell = this.createCell(column);
      this.hiddenCells.push(cell);
    });
  }

  createCell(column: Column): Cell {
    const defValue = column.defaultValue ? column.defaultValue : '';
    const value = typeof this.data[column.id] === 'undefined' ? defValue : this.data[column.id];
    return new Cell(value, this, column, this.dataSet);
  }
}
