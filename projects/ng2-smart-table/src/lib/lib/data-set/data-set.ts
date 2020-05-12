import { Row } from './row/row';
import { Column } from './column/column';

export class DataSet {

  newRow: Row;

  protected columns: Column[] = [];
  protected rows: Row[] = [];
  protected selectedRow: Row;
  protected needSelect: 'first' | 'last' | '' = 'first';

  settingsForReset = null;

  constructor(protected data: any[] = [], protected columnSettings: any, protected settingsName: string) {
    const tablesSettingsJson = localStorage.getItem('tablesSettings');
    let addedSettings = null;
    if (tablesSettingsJson) {
      addedSettings = JSON.parse(tablesSettingsJson);
    }
    this.createColumns(columnSettings, settingsName, addedSettings);
    this.setData(data);
    this.createNewRow();
  }

  // create

  createColumns(columnsSettings: any, settingsName: string, addedSettings: any) {

    const oneColumnWidth = 100 / Object.keys(columnsSettings).length;
    let widthSum = 0;
    Object.keys(columnsSettings).forEach((key) => {
      if (!columnsSettings[key].hide) {
        if (columnsSettings[key].width) {
          widthSum += parseInt(columnsSettings[key].width, 10);
        } else {
          widthSum += oneColumnWidth;
          columnsSettings[key].width = oneColumnWidth + '%';
        }
      }
    });

    Object.keys(columnsSettings).forEach((key) => {
      if (!columnsSettings[key].hide) {
        columnsSettings[key].width = Math.round(1000 / widthSum * parseInt(columnsSettings[key].width, 10)) + '%';
      }
    });

    if (!this.settingsForReset) {
      this.settingsForReset = {};
      this.setSettingsForReset(columnsSettings, settingsName);
    }

    if (settingsName && addedSettings && addedSettings[settingsName]) {
      addedSettings[settingsName].forEach((col: Column) => {
        Object.keys(col)
          .forEach(key => columnsSettings[col.id][key] = col[key]);
        this.columns.push(new Column(columnsSettings[col.id], col.id));
      });
    } else {
      for (const id in columnsSettings) {
        if (columnsSettings.hasOwnProperty(id)) {
          this.columns.push(new Column(columnsSettings[id], id));
        }
      }
    }
  }

  setSettings() {
    if (this.settingsName) {
      const tablesSettingsJson = localStorage.getItem('tablesSettings');
      let tablesSettings: {} = {};
      if (tablesSettingsJson) {
        tablesSettings = JSON.parse(tablesSettingsJson);
      }
      const settingsToSave = [];
      this.getColumns().forEach(col => {
        const colForSave = {};
        Object.keys(col).forEach(key => {
          if (typeof col[key] === 'string' ||
            typeof col[key] === 'number' ||
            typeof col[key] === 'boolean') {
            colForSave[key] = col[key];
          }
        });
        settingsToSave.push(colForSave);
      });

      tablesSettings[this.settingsName] = settingsToSave;
      localStorage.setItem('tablesSettings', JSON.stringify(tablesSettings));
    }
  }

  setSettingsForReset(columnsSettings: any, settingsName: string) {
    const settingsToSave = [];
    for (const id in columnsSettings) {
      if (columnsSettings.hasOwnProperty(id)) {
        const colForSave = {};
        const col = columnsSettings[id];
        colForSave['id'] = id;
        colForSave['show'] = col['show'] !== false;
        Object.keys(col).forEach(key => {
          if (typeof col[key] === 'string' ||
            typeof col[key] === 'number' ||
            typeof col[key] === 'boolean') {
            colForSave[key] = col[key];
          }
        });
        settingsToSave.push(colForSave);
      }
    }
    this.settingsForReset[settingsName] = settingsToSave;
  }

  resetSettings() {
    this.columns = [];
    const tablesSettingsJson = localStorage.getItem('tablesSettings');
    if (tablesSettingsJson) {
      const addedSettings = JSON.parse(tablesSettingsJson);
      delete (addedSettings[this.settingsName]);
      localStorage.setItem('tablesSettings', JSON.stringify(addedSettings));
    }
    this.createColumns(this.columnSettings, this.settingsName, this.settingsForReset);
    this.setData(this.data);
    this.createNewRow();
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
    this.newRow.editing = true;
  }

  // get

  getColumns(): Column[] {
    return this.columns;
  }

  getNoHideColumns(): Column[] {
    return this.columns.filter(c => c.show);
  }

  getHideColumns(): Column[] {
    return this.columns.filter(c => !c.show);
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

  multipleSelectRow(row: Row): Row {
    row.isSelected = !row.isSelected;
    this.selectedRow = row;
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
