import { Row } from './row';
import { Column } from './column';

export class DataSet {

  newRow: Row;

  protected data: any[] = [];
  protected columns: Column[] = [];
  protected rows: Row[] = [];
  protected selectedRow: Row;
  protected needSelect: 'first' | 'last' | '' = 'first';

  constructor(data: Array<any> = [], protected columnSettings: any) {
    this.createColumns(columnSettings);
    this.setData(data);
    this.createNewRow();
  }

  // create

  createColumns(columnsSettings: any) {
    for (const id in columnsSettings) {
      if (columnsSettings.hasOwnProperty(id)) {
        this.columns.push(new Column(id, columnsSettings[id], this));
      }
    }
  }

  setData(data: Array<any>) {
    this.data = data;
    this.createRows();
  }

  createRows() {
    this.rows = [];
    this.data.forEach((el, index) => {
      this.rows.push(new Row(index, el, this));
    });
  }

  createNewRow() {
    this.newRow = new Row(-1, {}, this);
    this.newRow.isInEditing = true;
  }

  // get

  getColumns(): Column[] {
    return this.columns;
  }

  getRows(): Row[] {
    return this.rows;
  }

  getFirstRow(): Row {
    return this.rows[0];
  }

  getLastRow(): Row {
    return this.rows[this.rows.length - 1];
  }

  findRowByData(data: any): Row {
    return this.rows.find((row: Row) => row.getData() === data);
  }

  // actions

  select(): Row {
    if (!this.getRows()) {return; }
    if (!this.needSelect || this.needSelect === 'first') {
      this.needSelect = '';
      return this.selectFirstRow();
    } else {
      this.needSelect = '';
      return this.selectLastRow();
    }
  }

  multipleSelectRow(row: Row): Row {
    row.isSelected = !row.isSelected;
    this.selectedRow = row;
    return this.selectedRow;
  }

  selectPreviousRow(): Row {
    if (this.rows.length) {
      let index = this.selectedRow ? this.selectedRow.index : 0;
      if (index > this.rows.length - 1) {
        index = this.rows.length - 1;
      }
      return this.reverseSelectedFlagOnRow(this.rows[index]);
    }
  }

  selectFirstRow(): Row {
    if (this.rows.length) {
      return this.reverseSelectedFlagOnRow(this.rows[0]);
    }
  }

  selectLastRow(): Row {
    if (this.rows.length) {
      return this.reverseSelectedFlagOnRow(this.rows[this.rows.length - 1]);
    }
  }

  reverseSelectedFlagOnRow(row: Row): Row {
    this.deselectAllByRow(row);
    this.selectedRow = row.isSelected ? row : null;
    return this.selectedRow;
  }

  selectRow(row: Row): Row {
    this.deselectAllByRow();
    row.isSelected = true;
    this.selectedRow = row;
    return this.selectedRow;
  }

  deselectAllByRow(useRow?) {
    this.rows.forEach((row) => {
      row.isSelected = useRow && useRow === row ? !row.isSelected : false;
    });
  }

  willSelectFirstRow() {
    this.needSelect = 'first';
  }

  willSelectLastRow() {
    this.needSelect = 'last';
  }

}
