import { BehaviorSubject, Subject } from 'rxjs';
import { ChangeDetectorRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { Column } from './settings/column/column';
import { Row } from './data-set/row/row';
import { DataSet } from './data-set/data-set';
import { DataSource } from './source/data-source';
import { ComponentLoader, Settings } from './settings/settings';
import { PagerSource } from './pagination/pager-source';
import { LocalDataSource } from './source/local.data-source';
import { takeUntil } from 'rxjs/operators';
import { GridResizeColumnFunctions } from './grid-resize-column-functions';
import { GridEvents } from './grid-events';
import { GridActionsFunctions } from './grid-actions-functions';
import { moveItemInArray } from '@angular/cdk/drag-drop';

export class Grid {

  componentLoader: ComponentLoader;
  gridEvents: GridEvents;
  gridActionsFunctions: GridActionsFunctions;
  gridResizeColumnsFunctions: GridResizeColumnFunctions;
  pagingSource: PagerSource;
  dataSet: DataSet;
  parentRowData: ParentRowData;
  mainTableElementRef: ElementRef;
  tableCdr: ChangeDetectorRef;
  destroy = new Subject<void>();

  cellMinHtml$ = new Subject<string>();
  cellMinHtml = '';

  isAllSelected = new BehaviorSubject<boolean>(false);
  someIsSelected = new BehaviorSubject<boolean>(false);

  constructor(public settings: Settings, public source: LocalDataSource, public resolver: ComponentFactoryResolver, mainTableElementRef: ElementRef) {
    this.mainTableElementRef = mainTableElementRef;
    this.componentLoader = new ComponentLoader();
    this.gridActionsFunctions = new GridActionsFunctions(this);
    this.gridResizeColumnsFunctions = new GridResizeColumnFunctions(this);
    this.gridEvents = new GridEvents();
    this.pagingSource = new PagerSource(this);
    this.dataSet = new DataSet(this);
    this.subscribeToSourceEvents();
    this.makeResize();
  }

  // <editor-fold desc="Init Settings And Source">
  onUpdateSettings(settings?: Settings) {
    this.settings = settings;
    if (this.source) {
      this.source.refresh();
      this.dataSet.initDataset();
      this.subscribeToSourceEvents();
    }
    this.gridResizeColumnsFunctions.resetHeaderFilters.next();
    this.pagingSource.initPager();
  }

  onUpdateSource(source?: LocalDataSource) {
    this.source = source;
    this.source.refresh();
    this.dataSet.initDataset();
    this.subscribeToSourceEvents();
    this.gridResizeColumnsFunctions.resetHeaderFilters.next();
    this.pagingSource.initPager();
  }

  onUpdateSourceAndSettings(source?: LocalDataSource, settings?: Settings) {
    this.source = source;
    this.settings = settings;
    this.source.refresh();
    this.dataSet.initDataset();
    this.subscribeToSourceEvents();
    this.gridResizeColumnsFunctions.resetHeaderFilters.next();
    this.pagingSource.initPager();
  }

  subscribeToSourceEvents() {
    this.destroy.next();
    this.source.onUpdated.pipe(takeUntil(this.destroy))
      .subscribe((data: any) => this.dataSet.getRowByData(data)?.setData(data));
    this.source.onChanged.pipe(takeUntil(this.destroy))
      .subscribe((changes: any) => this.updateDataSet(changes));
  }

  // </editor-fold>

  // <editor-fold desc="UI Linked Object get">
  // settings
  isView(viewType: string[]): boolean {
    return this.settings.actions.show && viewType.includes(this.settings.actions.show.viewType)
      && !!this.settings.actions.show.data;
  }

  isEdit(viewType: string[]): boolean {
    return this.settings.actions.edit && viewType.includes(this.settings.actions.edit.viewType)
      && !!this.settings.actions.edit.data;
  }

  isCreate(viewType: string[]): boolean {
    return this.settings.actions.add && viewType.includes(this.settings.actions.add.viewType)
      && !!this.settings.actions.add.data;
  }

  isCustom(viewType: string[], data?: any): boolean {
    const array = this.settings.actions.custom.filter(c => viewType.includes(c.viewType));
    return array && array.length && !!array.filter(a => !!a.data && ( !data || a.data === data )).length;
  }

  someIs(viewType: string[]): boolean {
    return this.isCustom(viewType)
      || this.isView(viewType)
      || this.isEdit(viewType)
      || this.isCreate(viewType);
  }

  noOneIs(viewType: string[]): boolean {
    return !this.isCustom(viewType)
      && !this.isView(viewType)
      && !this.isEdit(viewType)
      && !this.isCreate(viewType);
  }

  showActionColumnLeft(): boolean {
    return this.isActionsVisible('left');
  }

  showActionColumnRight(): boolean {
    return this.isActionsVisible('right');
  }

  isActionsVisible(position: 'left' | 'right' | 'top' | 'bottom'): boolean {
    return this.settings.actions
      && ( !!this.settings.actions.add && this.settings.actions.add.position === position && !this.settings.actions.add.dblclickOnRow
        || !!this.settings.actions.show && this.settings.actions.show.position === position && !this.settings.actions.show.dblclickOnRow
        || !!this.settings.actions.edit && this.settings.actions.edit.position === position && !this.settings.actions.edit.dblclickOnRow
        || !!this.settings.actions.delete && this.settings.actions.delete.position === position && !this.settings.actions.delete.dblclickOnRow
        || !!this.settings.actions.custom.length && !!this.settings.actions.custom.find(action => action.position === position && !action.dblclickOnRow) );
  }

  showMultiSelectColumnLeft(): boolean {
    return this.settings.selectMode === 'multi' && this.settings.actions.selectorPosition === 'left';
  }

  showMultiSelectColumnRight(): boolean {
    return this.settings.selectMode === 'multi' && this.settings.actions.selectorPosition === 'right';
  }

  showMultiSelectColumn(): boolean {
    return this.settings.selectMode === 'multi';
  }

  // grid
  getAllColumns(): Column[] {
    return this.dataSet.getAllColumns();
  }

  getNotHiddenColumns(): Column[] {
    return this.dataSet.getNotHiddenColumns();
  }

  getHiddenColumns(): Column[] {
    return this.dataSet.getHiddenColumns();
  }

  getSelectedRows(): Row[] {
    return this.dataSet.getSelectedRows();
  }

  getFirstRow(): Row {
    return this.dataSet.getFirstRow();
  }

  getLastRow(): Row {
    return this.dataSet.getLastRow();
  }

  getNewRow(): Row {
    return this.dataSet.newRow;
  }

  // </editor-fold>

  // <editor-fold desc="Main Actions">

  private updateDataSet(changes: DataSource) {
    if (!['load', 'refresh', 'filter', 'sort', 'remove', 'prepend', 'append', 'unshift', 'add']
      .includes(changes.action)) { return; }

    this.dataSet.setData(changes.elements, changes.action, changes.changedElements);

    if (this.settings.selectMode === 'multi') { return; }

    let row: Row = null;
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

    if (row) {
      this.pagingSource.scrollToRow(row);
      this.emitSelectRowByUser(row, true);
    }
  }

  refreshGrid() {
    Object.keys(this.dataSet.filteredAndSortedRowsHash).forEach(key => this.dataSet.filteredAndSortedRowsHash[key].toReInit = true);
    this.dataSet.viewPortItems.value.forEach(row => row.initCells());
    this.makeResize();
    this.saveSettingsToLocalStorage();
    this.resetScroll();
  }

  makeResize() {
    this.gridResizeColumnsFunctions.resize(this.getNotHiddenColumns());
  }

  resetSettingsToInputData() {
    this.dataSet.resetSettingsToInputData();
    this.resetScroll();
  }

  saveSettingsToLocalStorage() {
    this.dataSet.saveSettingsToLocalStorage();
  }

  // </editor-fold>

  // <editor-fold desc="Select Actions">

  private emitSelectRowByUser(row: Row, onAction: boolean = false) {
    const selectedRows = this.getSelectedRows();
    this.gridEvents.selectedRows.next({
      data: row ? row.getData() : null,
      isSelected: row ? row.getData().system_info_777_isSelected : null,
      selectedRowsData: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
      onAction
    });
  }

  private checkAllForCheckSelected() {
    if (this.source.data.find(d => d.system_info_777_isSelected)) {
      this.isAllSelected.next(this.source.data.filter(d => this.settings.canSelectedFunction(d)).length
        === this.source.data.filter(d => d.system_info_777_isSelected).length);
      this.someIsSelected.next(!this.isAllSelected.value);
    } else {
      this.someIsSelected.next(false);
      this.isAllSelected.next(false);
    }
  }

  reverseRowSelectedFlag(row: Row) {
    this.dataSet.reverseRowSelectedFlag(row);
    this.checkAllForCheckSelected();
    this.emitSelectRowByUser(row, false);
  }

  reverseRowSelectedFlagOnMultiple(row: Row) {
    this.dataSet.reverseRowSelectedFlagOnMultiple(row);
    this.checkAllForCheckSelected();
    this.emitSelectRowByUser(row, false);
  }

  allRowReverseSelectFlag() {
    this.isAllSelected.next(!this.isAllSelected.value);
    this.dataSet.selectAllRows(this.isAllSelected.value, this.settings.canSelectedFunction);
    this.checkAllForCheckSelected();
    this.emitSelectRowByUser(null, false);
  }

  // </editor-fold>

  resetScroll() {
    if (this.pagingSource?.viewport?.value) {
      const scrollingElement = this.pagingSource.viewport.value.element.nativeElement as HTMLElement;
      let x = null;
      let y = null;
      Array.from(scrollingElement.children).forEach(el => {
        if (el.className.includes('ps__rail-x')) {
          x = el;
        } else if (el.className.includes('ps__rail-y')) {
          y = el;
        }
      });
      if (x) {
        x.remove();
      }
      if (y) {
        y.remove();
      }
      this.pagingSource.perfectScrollbar.update();
    }
  }

  getActionColumnElementWidth(actionShowDetailsEl: HTMLElement[], widthSubject: BehaviorSubject<number>) {
    if (actionShowDetailsEl) {
      const maxElem = Math.max(...actionShowDetailsEl.map(e => e.clientWidth));
      if (widthSubject.value < maxElem) {
        widthSubject.next(maxElem);
      }
    }
  }

  anchor(value: boolean, columnId: string) {
    const column = this.getAllColumns().find(c => c.id === columnId);
    if (value && column) {
      const columns = this.getAllColumns();
      columns.forEach((col) => {
        if (column !== col) {
          col.anchor = false;
        }
      });
      const previousIndex = columns.indexOf(column);
      moveItemInArray(this.getAllColumns(), previousIndex, 0);
      this.refreshGrid();
    }
  }

}

export class ParentRowData {
  private rowData: any[];

  constructor(public parentRowData?: ParentRowData) {}

  addData(data: any[]) {this.rowData = data; }

  getData(): any[] {return this.rowData; }
}
