import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Deferred } from './helpers';
import { Column } from './data-set/column';
import { Row } from './data-set/row';
import { DataSet } from './data-set/data-set';
import { DataSourceClass, SortClass } from './data-source/data-source.class';
import { SettingsClass } from './settings.class';
import { PagingSourceClass } from './paging-source-class';
import { LocalDataSource } from 'ng2-smart-table';

export class Grid {

  source: LocalDataSource;
  settings: SettingsClass;
  pagingSource: PagingSourceClass;
  dataSet: DataSet;
  widthMultipleSelectCheckBox = '0px';
  widthActions = '0px';
  doResize = false;
  doDrgDrop = false;

  createFormShown = false;
  onSelectRowSource = new Subject<any>();

  constructor(settings: any, source: LocalDataSource) {
    this.setSettings(settings);
    this.setSource(source);
    this.setPagingSource(source, settings);
  }

  showActionColumn(position: 'left' | 'right'): boolean {
    return this.isActionsVisible() && position === this.settings.actions.position;
  }

  isActionsVisible(): boolean {
    return this.settings.actions && (!!this.settings.actions.add || !!this.settings.actions.edit
      || !!this.settings.actions.delete || !!this.settings.actions.custom.length);
  }

  isMultiSelectVisible(): boolean {
    return this.settings.selectMode === 'multi';
  }

  setSettings(settings) {
    this.settings = new SettingsClass(settings);
    this.dataSet = new DataSet([], this.settings.columns, this.settings.settingsName);
    if (this.source) {
      this.source.refresh();
    }
  }

  setSource(source: LocalDataSource) {
    this.source = this.prepareSource(source);
    this.source.onChanged.subscribe((changes: any) => this.processDataChange(changes));
    this.source.onUpdated.subscribe((data: any) => {
      const changedRow = this.dataSet.findRowByData(data);
      changedRow.setData(data);
    });
  }

  setPagingSource(source: LocalDataSource, settings: SettingsClass) {
    this.pagingSource = new PagingSourceClass(source, settings);
  }

  getNewRow(): Row {
    return this.dataSet.newRow;
  }

  getDataSet(): DataSet {
    return this.dataSet;
  }

  getSetting(): SettingsClass {
    return this.settings;
  }

  getColumns(): Column[] {
    return this.dataSet.getColumns();
  }

  getNoHideColumns(): Column[] {
    return this.dataSet.getNoHidColumns();
  }

  getRows(): Array<Row> {
    return this.dataSet.getRows();
  }

  selectRow(row: Row) {
    this.dataSet.reverseSelectedFlagOnRow(row);
  }

  multipleSelectRow(row: Row) {
    this.dataSet.multipleSelectRow(row);
  }

  edit(row: Row) {
    row.isInEditing = true;
  }

  create(row: Row, confirmEmitter: EventEmitter<any>) {

    const deferred = new Deferred();
    deferred.promise.then((newData) => {
      newData = newData ? newData : row.getNewData();
      if (deferred.resolve.skipAdd) {
        this.createFormShown = false;
      } else {
        this.source.prepend(newData).then(() => {
          this.createFormShown = false;
          this.dataSet.createNewRow();
        });
      }
    }).catch(() => {
    });

    if (this.settings.add.confirmCreate) {
      confirmEmitter.emit({
        newData: row.getNewData(),
        source: this.source,
        confirm: deferred
      });
    } else {
      deferred.resolve();
    }
  }

  save(row: Row, confirmEmitter: EventEmitter<any>) {

    const deferred = new Deferred();
    deferred.promise.then((newData) => {

      newData = newData ? newData : row.getNewData();
      if (deferred.resolve.skipEdit) {
        row.isInEditing = false;
      } else {
        this.source.update(row.getData(), newData).then(() => {
          row.isInEditing = false;
        });
      }
    }).catch(() => {
    });

    if (this.settings.edit.confirmSave) {
      confirmEmitter.emit({
        data: row.getData(),
        newData: row.getNewData(),
        source: this.source,
        confirm: deferred
      });
    } else {
      deferred.resolve();
    }
  }

  delete(row: Row, confirmEmitter: EventEmitter<any>) {
    const deferred = new Deferred();
    deferred.promise.then(() => {
      this.source.remove(row.getData()).then();
    }).catch(() => {
    });

    if (this.settings.delete.confirmDelete) {
      confirmEmitter.emit({
        data: row.getData(),
        source: this.source,
        confirm: deferred
      });
    } else {
      deferred.resolve();
    }
  }

  processDataChange(changes: DataSourceClass) {
    if (!this.shouldProcessChange(changes)) { return; }

    this.dataSet.setData(changes.elements);
    if (this.settings.selectMode === 'multi') { return; }

    const row = this.determineRowToSelect(changes);
    if (row) {
      this.pagingSource.scrollToRow(row);
      this.onSelectRowSource.next(row);
    }
  }

  shouldProcessChange(changes: DataSourceClass): boolean {
    return ['filter', 'sort', 'page', 'remove', 'refresh', 'load', 'paging', 'prepend', 'append']
      .includes(changes.action);
  }

  determineRowToSelect(changes: DataSourceClass): Row {
    let row = null;
    switch (changes.action) {
      case 'add':
      case 'append':
        row = this.dataSet.selectLastRow();
        break;
      case 'unshift':
      case 'prepend':
        row = this.dataSet.selectFirstRow();
        break;
    }
    return row;
  }

  prepareSource(source: LocalDataSource): LocalDataSource {
    const initialSort: SortClass = this.getInitialSort();
    if (initialSort && initialSort.field && initialSort.direction) {
      source.setSort([initialSort], false);
    }
    source.refresh();
    return source;
  }

  getInitialSort() {
    const sortConf: SortClass = new SortClass();
    this.getColumns().forEach((column: Column) => {
      if (column.sort && column.defaultSortDirection) {
        sortConf.field = column.id;
        sortConf.direction = column.defaultSortDirection;
        sortConf.compare = column.getCompareFunction();
      }
    });
    return sortConf;
  }

  getSelectedRows(): Array<any> {
    return this.dataSet.getRows()
      .filter(r => r.isSelected);
  }

  selectAllRows(status: any) {
    this.dataSet.getRows()
      .forEach(r => r.isSelected = status);
  }

  getFirstRow(): Row {
    return this.dataSet.getFirstRow();
  }

  getLastRow(): Row {
    return this.dataSet.getLastRow();
  }

}
