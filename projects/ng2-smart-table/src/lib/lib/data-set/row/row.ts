import { Cell } from './cell/cell';
import { Column } from '../column/column';
import { DataSet } from '../data-set';

export class Row {

  isSelected = false;
  editing = false;
  showHiddenColumns = false;
  allCells: Cell[] = [];
  cells: Cell[] = [];
  hiddenCells: Cell[] = [];
  constructor(public index: number, protected data: any, protected dataSet: DataSet) {
    this.process();
  }

  getData(): any {
    return this.data;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }

  getNewData(): any {
    const values = Object.assign({}, this.data);
    this.allCells.forEach((cell) => values[cell.getColumn().id] = cell.newValue);
    return values;
  }

  resetNewData(): any {
    const values = Object.assign({}, this.data);
    this.allCells.forEach((cell) => cell.newValue = values[cell.getColumn().id]);
    return values;
  }

  setData(data: any): any {
    this.data = data;
    this.process();
  }

  process() {
    this.allCells = [];
    this.cells = [];
    this.hiddenCells = [];
    this.dataSet.getColumns().forEach((column: Column) => {
      const cell = this.createCell(column);
      this.allCells.push(cell);
      column.show ? this.cells.push(cell) : this.hiddenCells.push(cell);
    });
  }

  createCell(column: Column): Cell {
    const defValue = column.defaultValue ? column.defaultValue : '';
    const value = typeof this.data[column.id] === 'undefined' ? defValue : this.data[column.id];
    return new Cell(value, this, column, this.dataSet);
  }
}
