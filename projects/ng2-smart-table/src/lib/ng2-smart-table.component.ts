import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import { deepExtend } from './lib/helpers';
import { Grid } from './lib/grid';
import { Row } from './lib/data-set/row';
import { LocalDataSource } from './lib/data-source/local.data-source';
import { CustomActionResultClass, SettingsClass } from './lib/settings.class';

@Component({
  selector: 'ng2-smart-table',
  styleUrls: ['./ng2-smart-table.component.scss'],
  templateUrl: './ng2-smart-table.component.html'
})
export class Ng2SmartTableComponent implements OnChanges {

  @Input() source: LocalDataSource | any;
  @Input() settings: SettingsClass;
  @Input() minTableHeight = '300px';
  @Input() rowHeight = 20;
  @Input() minColumnWidth = 5;

  @Output() rowSelect = new EventEmitter<any>();
  @Output() userRowSelect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() custom = new EventEmitter<CustomActionResultClass>();
  @Output() deleteConfirm = new EventEmitter<any>();
  @Output() editConfirm = new EventEmitter<any>();
  @Output() createConfirm = new EventEmitter<any>();
  @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();
  @Output() gridEmitResult = new EventEmitter<Grid>();

  tableClass: string;
  tableId: string;
  perPageSettings: number | number[];
  isHideHeader: boolean;
  isHideSubHeader: boolean;
  isPagerDisplay: boolean;
  rowClassFunction: () => string;
  grid: Grid;
  isAllSelected = false;

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (this.grid) {
      if (changes['settings']) {
        this.grid.setSettings(this.prepareSettings());
      }
      if (changes['source']) {
        this.source = this.prepareSource();
        this.grid.setSource(this.source);
      }
    } else {
      this.initGrid();
    }
    this.tableId = this.grid.getSetting().attr.id;
    this.tableClass = this.grid.getSetting().attr.class;
    this.isHideHeader = this.grid.getSetting().hideHeader;
    this.isHideSubHeader = this.grid.getSetting().hideSubHeader;
    this.isPagerDisplay = this.grid.getSetting().pager.display;
    this.perPageSettings = this.grid.getSetting().pager.perPage;
    this.rowClassFunction = this.grid.getSetting().rowClassFunction;
  }

  editRowSelect(row: Row) {
    if (this.grid.getSetting().selectMode === 'multi') {
      this.onMultipleSelectRow(row);
    } else {
      this.onSelectRow(row);
    }
  }

  onUserSelectRow(row: Row) {
    if (this.grid.getSetting().selectMode !== 'multi') {
      this.grid.selectRow(row);
      this.emitUserSelectRow(row);
      this.emitSelectRow(row);
    }
  }
  multipleSelectRow(row: Row) {
    if (this.grid.getSetting().selectMode === 'multi') {
      this.grid.multipleSelectRow(row);
      this.emitUserSelectRow(row);
      this.emitSelectRow(row);
    }
  }

  onRowHover(row: Row) {
    this.rowHover.emit(row);
  }

  onSelectAllRows($event: any) {
    this.isAllSelected = !this.isAllSelected;
    this.grid.selectAllRows(this.isAllSelected);

    this.emitUserSelectRow(null);
    this.emitSelectRow(null);
  }

  onSelectRow(row: Row) {
    this.grid.selectRow(row);
    this.emitSelectRow(row);
  }

  onMultipleSelectRow(row: Row) {
    this.emitSelectRow(row);
  }

  initGrid() {
    this.source = this.prepareSource();
    this.settings = this.prepareSettings();
    this.grid = new Grid(this.settings, this.source);
    this.grid.onSelectRowSource.subscribe((row) => this.emitSelectRow(row));
    this.source.onGetAllGrid.subscribe(() => {
      this.gridEmitResult.next(this.grid);
    });
  }

  prepareSource(): LocalDataSource {
    if (this.source instanceof LocalDataSource) {
      return this.source;
    } else if (this.source['length']) {
      return new LocalDataSource(this.source);
    }
    return new LocalDataSource();
  }

  prepareSettings(): SettingsClass {
    return deepExtend({}, new SettingsClass(), this.settings);
  }

  changePage($event: any) {
    this.resetAllSelector();
  }

  sort($event: any) {
    this.resetAllSelector();
  }

  filter($event: any) {
    this.resetAllSelector();
  }

  private resetAllSelector() {
    this.isAllSelected = false;
  }

  private emitUserSelectRow(row: Row) {
    const selectedRows = this.grid.getSelectedRows();
    this.userRowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
      selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : []
    });
  }

  private emitSelectRow(row: Row) {
    this.rowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source
    });
  }

}
