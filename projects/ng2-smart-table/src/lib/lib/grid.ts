import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Deferred } from './helpers';
import { Column } from './data-set/column';
import { Row } from './data-set/row';
import { DataSet } from './data-set/data-set';
import { DataSource } from './data-source/data-source';
import { DataSourceClass, SortClass } from './data-source/data-source.class';
import { SettingsClass } from './settings.class';

export class Grid {

  source: DataSource;
  settings: SettingsClass;
  dataSet: DataSet;

  createFormShown = false;
  onSelectRowSource = new Subject<any>();

  constructor(source: DataSource, settings: any) {
    this.setSource(source);
    this.setSettings(settings);
  }

  showActionColumn(position: 'left' | 'right'): boolean {
    return position === this.settings.actions.position && this.isActionsVisible();
  }

  isActionsVisible(): boolean {
    return !!this.settings.actions.add || !!this.settings.actions.edit
      || !!this.settings.actions.delete || !!this.settings.actions.custom.length;
  }

  isMultiSelectVisible(): boolean {
    return this.settings.selectMode === 'multi';
  }

  getNewRow(): Row {
    return this.dataSet.newRow;
  }

  setSettings(settings) {
    this.settings = settings;
    this.dataSet = new DataSet([], this.settings.columns);
    if (this.source) {
      this.source.refresh();
    }
  }

  getDataSet(): DataSet {
    return this.dataSet;
  }

  setSource(source: DataSource) {
    this.source = this.prepareSource(source);
    this.source.onChanged.subscribe((changes: any) => this.processDataChange(changes));
    this.source.onUpdated.subscribe((data: any) => {
      const changedRow = this.dataSet.findRowByData(data);
      changedRow.setData(data);
    });
  }

  getSetting(): SettingsClass {
    return this.settings;
  }

  getColumns(): Array<Column> {
    return this.dataSet.getColumns();
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

  onSelectRow(): Observable<any> {
    return this.onSelectRowSource.asObservable();
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
    }).catch((err) => {
      // doing nothing
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
    }).catch((err) => {
      // doing nothing
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
    }).catch((err) => {
      // doing nothing
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
      this.onSelectRowSource.next(row);
    }
  }

  shouldProcessChange(changes: DataSourceClass): boolean {
    if (['filter', 'sort', 'page', 'remove', 'refresh', 'load', 'paging'].includes(changes.action)) {
      return true;
    } else if (['prepend', 'append'].includes(changes.action) && !this.settings.pager.display) {
      return true;
    }
    return false;
  }

  // TODO: move to selectable? Separate directive
  determineRowToSelect(changes: DataSourceClass): Row {
    switch (changes.action) {
      case 'load':
      case 'page':
      case 'filter':
      case 'sort':
      case 'refresh':
        return this.dataSet.select();
      case 'add':
      case 'append':
        return this.dataSet.selectLastRow();
      case 'prepend':
        return this.dataSet.selectFirstRow();
      case  'remove':
        return (changes.elements.length ? this.dataSet.selectPreviousRow() : this.dataSet.selectLastRow());
    }
    return null;
  }

  prepareSource(source: DataSource): DataSource {
    const initialSort: SortClass = this.getInitialSort();
    if (initialSort && initialSort.field && initialSort.direction) {
      source.setSort([initialSort], false);
    }
    if (this.settings.pager.display === true) {
      source.setPaging(1, this.settings.pager.perPage, false);
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
