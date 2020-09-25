import { Cell } from './cell/cell';
import { Column } from '../../settings/column/column';
import { DataSet } from '../data-set';

export class Row {

  showContent = true;
  toReInit = false;

  allCells: Cell[] = [];
  cells: Cell[] = [];
  hiddenCells: Cell[] = [];

  get detailCell(): Cell {
    const arr = this.dataSet.grid.settings.actions.custom.filter(c => c.viewType === 'details' && !!c.data);
    if (this.dataSet.grid.settings.actions.add
      && this.dataSet.grid.settings.actions.add.viewType === 'details'
      && this.dataSet.grid.settings.actions.add.data) {
      arr.push(this.dataSet.grid.settings.actions.add);
    }
    if (this.dataSet.grid.settings.actions.edit
      && this.dataSet.grid.settings.actions.edit.viewType === 'details'
      && this.dataSet.grid.settings.actions.edit.data) {
      arr.push(this.dataSet.grid.settings.actions.edit);
    }
    if (this.dataSet.grid.settings.actions.show
      && this.dataSet.grid.settings.actions.show.viewType === 'details'
      && this.dataSet.grid.settings.actions.show.data) {
      arr.push(this.dataSet.grid.settings.actions.show);
    }
    const cell = arr.length && this.allCells.length ? this.allCells.filter(c => c.getId() === arr[0].detailColumnName)[0] : null;
    return cell ? cell : this.allCells[0];
  }

  constructor(protected data: any, protected dataSet: DataSet) {
    this.initCells();
  }

  getDataSet(): DataSet {
    return this.dataSet;
  }

  getData(): any {
    return this.data;
  }

  getNewData(): any {
    const values = Object.assign({}, this.data);
    this.allCells.forEach((cell) => values[cell.getColumn().id] = cell.cellValue.realValue);
    return values;
  }

  saveNewDataAndReturn(): any {
    const values = Object.assign({}, this.data);
    this.allCells.forEach((cell) => {
      cell.cellValue.saveToRealValue();
      values[cell.getColumn().id] = cell.cellValue.realValue;
    });
    return values;
  }

  resetNewDataAndReturn(): any {
    const values = Object.assign({}, this.data);
    this.allCells.forEach((cell) => {
      cell.cellValue.resetEditedValue();
      values[cell.getColumn().id] = cell.cellValue.realValue;
    });
    return values;
  }

  setData(data: any): any {
    if (!data) {return; }
    this.data = data;
    this.initCells();
  }

  initCells() {
    const columns = this.dataSet.getAllColumns();
    for (let i = 0; i < columns.length; i++) {
      if (!this.allCells[i]) {
        const cell = this.createCell(columns[i]);
        this.allCells.push(cell);
      } else if (this.allCells[i].getColumn() !== columns[i]) {
        const columnIndex = this.allCells.findIndex(c => c.getColumn() === columns[i]);
        if (columnIndex !== -1) {
          [this.allCells[columnIndex], this.allCells[i]] = [this.allCells[i], this.allCells[columnIndex]];
          this.updateCellDataIfNotEqualRowData(i, columns);
        } else {
          this.allCells.splice(i, 0, this.createCell(columns[i]));
        }
      } else {
        this.updateCellDataIfNotEqualRowData(i, columns);
      }
    }
    while (this.allCells.length > columns.length) {
      this.allCells.pop();
    }
    this.cells = this.allCells.filter(c => c.getColumn().show);
    this.hiddenCells = this.allCells.filter(c => !c.getColumn().show);
    this.toReInit = false;
  }

  updateCellDataIfNotEqualRowData(cellId: number, columns: Column[]) {
    if (this.allCells[cellId].getRow().getData()[columns[cellId].id] !== this.allCells[cellId].cellValue.realValue) {
      this.allCells[cellId].cellValue.updateIfNotEq(this.allCells[cellId].getRow().getData()[columns[cellId].id]);
    }
  }

  createCell(column: Column): Cell {
    return new Cell(this, column, this.data[column.id], this.prepareDefaultValue(column));
  }

  prepareDefaultValue(column: Column): any {
    let value = column.defaultValue;
    switch (column.type) {
      case 'text':
      case 'date':
      case 'dateTime':
      case 'html':
      case 'custom': {
        value = value ?? '';
        break;
      }
      case 'boolean': {
        value = value ?? false;
        break;
      }
      case 'number': {
        value = value ?? -1;
        break;
      }
      case 'table': {
        value = value ?? [];
        break;
      }
    }
    return value;
  }
}
