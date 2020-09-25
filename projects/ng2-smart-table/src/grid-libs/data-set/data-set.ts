import { Row } from './row/row';
import { Column } from '../settings/column/column';
import { Grid } from '../grid';
import { GridResizeColumnFunctions } from '../grid-resize-column-functions';
import { BehaviorSubject } from 'rxjs';
import { SimpleSettings } from '../settings/settings';
import { v4 as uuidv4 } from 'uuid';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export class DataSet {
  filteredAndSortedRows = new BehaviorSubject<Row[]>([]);
  filteredAndSortedRowsHash: { [id: string]: Row } = {};
  viewPortItems = new BehaviorSubject<Row[]>([]);
  newRow: Row;
  private columns: Column[] = [];
  private selectedRow: Row;
  private settingsForReset: { [settingsName: string]: SimpleSettings } = null;

  constructor(public grid: Grid) {
    this.initDataset();
  }

  initDataset() {
    this.settingsForReset = {};
    const columns = [];
    Object.values(this.grid.settings.columns).forEach((c, id) => {
      c.id = Object.keys(this.grid.settings.columns)[id];
      columns.push(c);
    });
    this.saveSettingsFromInput(columns, this.grid.settings.settingsName ? this.grid.settings.settingsName : 'noname');
    if (this.grid.settings.settingsName) {
      const tablesSettingsJson = localStorage.getItem('tablesSettings');
      let settingsFromLocalStorage = null;
      if (tablesSettingsJson) {
        settingsFromLocalStorage = JSON.parse(tablesSettingsJson);
      }
      this.setColumns(settingsFromLocalStorage);
    } else {
      this.setColumns(this.settingsForReset);
    }
    this.setData(this.grid.source.data);
    this.createNewRow();
  }

  // <editor-fold desc="UI Linked Object get">
  getAllColumns(): Column[] {
    return this.columns;
  }

  getNotHiddenColumns(): Column[] {
    return this.columns.filter(c => c.show);
  }

  getHiddenColumns(): Column[] {
    return this.columns.filter(c => !c.show);
  }

  getFirstRow(): Row {
    return this.filteredAndSortedRows.value[0];
  }

  getLastRow(): Row {
    return this.filteredAndSortedRows.value[this.filteredAndSortedRows.value.length - 1];
  }

  getRowByData(data: any): Row {
    return this.filteredAndSortedRows.value.find((row: Row) => row.getData() === data);
  }

  getSelectedRows(): Row[] {
    return this.filteredAndSortedRows.value.filter(r => r.getData().system_info_777_isSelected);
  }

  // </editor-fold>

  // <editor-fold desc="Settings For Columns">

  private saveSettingsFromInput(columnsSettings: Column[], settingsName: string) {
    const gridSettings = this.grid.settings;
    const settingsToSave = {} as SimpleSettings;
    settingsToSave.innerTableWidthPc = gridSettings.innerTableWidthPc;
    settingsToSave.detailsWidth = gridSettings.detailsWidth;
    settingsToSave.quickViewWidth = gridSettings.quickViewWidth;
    settingsToSave.expandRowHeight = gridSettings.expandRowHeight;
    settingsToSave.columns = [];
    this.settingsToSaveColumns(settingsToSave.columns, columnsSettings);
    this.settingsForReset[settingsName] = settingsToSave;
  }

  resetSettingsToInputData() {
    if (this.grid.settings.settingsName) {
      const tablesSettingsJson = localStorage.getItem('tablesSettings');
      if (tablesSettingsJson) {
        const addedSettings = JSON.parse(tablesSettingsJson);
        delete ( addedSettings[this.grid.settings.settingsName] );
        localStorage.setItem('tablesSettings', JSON.stringify(addedSettings));
      }
    }
    this.setColumns(this.settingsForReset);
    this.grid.refreshGrid();
  }

  private setColumns(sourceSettings: { [settingsName: string]: SimpleSettings }) {
    const gridSettings = this.grid.settings;
    const settingsName = gridSettings.settingsName ? gridSettings.settingsName : 'noname';
    this.grid.gridResizeColumnsFunctions.resize(Object.keys(gridSettings.columns)
      .filter((key) => gridSettings.columns[key].show || gridSettings.columns[key].show == null)
      .map(key => gridSettings.columns[key]));

    const isColumnsEmpty = !this.columns.length;
    if (sourceSettings && sourceSettings[settingsName]) {
      gridSettings.innerTableWidthPc = ( sourceSettings[settingsName] as SimpleSettings ).innerTableWidthPc;
      gridSettings.detailsWidth = ( sourceSettings[settingsName] as SimpleSettings ).detailsWidth;
      gridSettings.quickViewWidth = ( sourceSettings[settingsName] as SimpleSettings ).quickViewWidth;
      gridSettings.expandRowHeight = ( sourceSettings[settingsName] as SimpleSettings ).expandRowHeight;
      this.initColumns(Object.values(gridSettings.columns), sourceSettings[settingsName].columns);
    } else {
      for (const id in gridSettings.columns) {
        if (gridSettings.columns.hasOwnProperty(id)) {
          const columnSettings = gridSettings.columns[id];
          if (isColumnsEmpty) {
            this.columns.push(new Column(columnSettings, id, this.grid.settings.innerTableHeightPx - this.grid.settings.minRowHeightPx));
          } else {
            const colFind = this.columns.find(c => c.id === id);
            colFind.columnFunctions.init(columnSettings);
          }
        }
      }
    }

    Object.keys(this.filteredAndSortedRowsHash).forEach(key => this.filteredAndSortedRowsHash[key].toReInit = true);
    this.viewPortItems.value.forEach(row => row.initCells());
  }

  saveSettingsToLocalStorage() {
    const gridSettings = this.grid.settings;
    const settingsName = gridSettings.settingsName;
    if (settingsName) {
      const tablesSettingsJson = localStorage.getItem('tablesSettings');
      const tablesSettings: { [settingsName: string]: SimpleSettings } = tablesSettingsJson ? JSON.parse(tablesSettingsJson) : {};
      tablesSettings[settingsName] = {} as SimpleSettings;
      tablesSettings[settingsName].innerTableWidthPc = gridSettings.innerTableWidthPc;
      tablesSettings[settingsName].detailsWidth = gridSettings.detailsWidth;
      tablesSettings[settingsName].quickViewWidth = gridSettings.quickViewWidth;
      tablesSettings[settingsName].expandRowHeight = gridSettings.expandRowHeight;
      const columnsSettingsToSave: Column[] = [];
      this.settingsToSaveColumns(columnsSettingsToSave, this.getAllColumns());
      tablesSettings[settingsName].columns = columnsSettingsToSave;
      localStorage.setItem('tablesSettings', JSON.stringify(tablesSettings));
    }
  }

  private initColumns(columnsSettings: Column[], sourceColumnsSettings: Column[]) {
    const noData = !this.columns.length;
    let iter = 0;
    sourceColumnsSettings.forEach((column) => {
      const colIndex = columnsSettings.findIndex(c => c.id === column.id);
      if (colIndex !== -1 && columnsSettings[iter]) {
        moveItemInArray(columnsSettings, colIndex, iter);
        iter++;
      }
    });
    if (!noData) {
      columnsSettings.forEach((column: Column, columnPos) => {
        const colIndex = this.columns.findIndex(c => c.id === column.id);
        if (colIndex !== -1) {
          moveItemInArray(this.columns, colIndex, columnPos);
        }
      });
    }
    columnsSettings.forEach((columnSettings: Column) => {
      if (columnSettings.id) {
        const sourceColumn = sourceColumnsSettings.find(c => c.id === columnSettings.id);
        if (sourceColumn) {
          Object.keys(columnSettings)
            .forEach(key => {
                if (sourceColumn[key] != null && (
                  typeof sourceColumn[key] === 'string' && typeof columnSettings[key] === 'string' ||
                  typeof sourceColumn[key] === 'number' && typeof columnSettings[key] === 'number' ||
                  typeof sourceColumn[key] === 'boolean' && typeof columnSettings[key] === 'boolean' )) {
                  columnSettings[key] = sourceColumn[key];
                }
              }
            );
        }
        if (noData) {
          this.columns.push(new Column(columnSettings, columnSettings.id, this.grid.settings.innerTableHeightPx - this.grid.settings.minRowHeightPx));
        } else {
          const colFind = this.columns.find(c => c.id === columnSettings.id);
          if (colFind) {
            colFind.columnFunctions.init(columnSettings);
          }
        }
      }
    });
  }

  private settingsToSaveColumns(settingsToSave: Column[], columnsSettings: Column[]) {
    columnsSettings.forEach(column => {
      const colForSave = {} as Column;
      colForSave.id = column.id;
      colForSave.show = column.show !== false;
      colForSave.anchor = column.anchor === true;
      Object.keys(column).forEach(key => {
        if (typeof column[key] === 'string' ||
          typeof column[key] === 'number' ||
          typeof column[key] === 'boolean') {
          colForSave[key] = column[key];
        }
      });
      settingsToSave.push(colForSave);
    });
  }

  // </editor-fold>

  // <editor-fold desc="Set Columns And Data">

  setData(filteredAndSortedData: any[], action:
    'refresh' | 'load' | 'prepend' | 'append' | 'add' | 'unshift' | 'remove' | 'update' | 'updateField' | 'empty' | 'sort' | 'filter' | 'page' | 'pageByUser'
            = 'load',
          elements?: any) {

    try {
      if (['load', 'refresh', 'filter', 'sort'].includes(action)) {
        if (action === 'load') {
          this.filteredAndSortedRowsHash = {};
          filteredAndSortedData.forEach((data, i) => {
            const newUuid = uuidv4();
            this.filteredAndSortedRowsHash[newUuid] = this.createRow(newUuid, data);
          });
        }
        const filteredAndSortedRows = [];
        filteredAndSortedData.forEach(data => {
          if (!data.system_info_777_uuid || !this.filteredAndSortedRowsHash[data.system_info_777_uuid]) {
            const newUuid = uuidv4();
            this.filteredAndSortedRowsHash[newUuid] = this.createRow(newUuid, data);
          }
          filteredAndSortedRows.push(this.filteredAndSortedRowsHash[data.system_info_777_uuid]);
        });
        this.filteredAndSortedRows.next(filteredAndSortedRows);
      } else if (['add', 'unshift', 'append', 'prepend'].includes(action)) {
        Array.from(elements).forEach((data: any) => {
          const newUuid = uuidv4();
          this.filteredAndSortedRowsHash[newUuid] = this.createRow(newUuid, data);
        });
        this.grid.source.refresh();
        return;
      } else if (['remove'].includes(action)) {
        delete this.filteredAndSortedRowsHash[elements.system_info_777_uuid];
        this.grid.source.refresh();
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  createRow(index: number, data: any): Row {
    const row = new Row(data, this);
    if (!data.system_info_777_isSelected) {
      data.system_info_777_isSelected = false;
    }
    data.system_info_777_uuid = index;
    return row;
  }

  createNewRow() {
    this.newRow = this.createRow(-1, {});
  }

  // </editor-fold>

  // <editor-fold desc="Select Actions">
  reverseRowSelectedFlag(row: Row): Row {
    this.filteredAndSortedRows.value.forEach((r) => {
      r.getData().system_info_777_isSelected = row && row === r ? !r.getData().system_info_777_isSelected : false;
    });
    this.selectedRow = row.getData().system_info_777_isSelected ? row : null;
    return this.selectedRow;
  }

  reverseRowSelectedFlagOnMultiple(row: Row): Row {
    row.getData().system_info_777_isSelected = !row.getData().system_info_777_isSelected;
    this.selectedRow = row;
    return this.selectedRow;
  }

  selectAllRows(status: any, fn: (...attr) => boolean) {
    this.filteredAndSortedRows.value
      .forEach(r => r.getData().system_info_777_isSelected = fn(r.getData()) && status);
  }

  selectFirstRow(): Row {
    if (this.filteredAndSortedRows.value.length) {
      return this.reverseRowSelectedFlag(this.filteredAndSortedRows.value[0]);
    }
  }

  selectLastRow(): Row {
    if (this.filteredAndSortedRows.value.length) {
      return this.reverseRowSelectedFlag(this.filteredAndSortedRows[this.filteredAndSortedRows.value.length - 1]);
    }
  }

  // </editor-fold>
}
