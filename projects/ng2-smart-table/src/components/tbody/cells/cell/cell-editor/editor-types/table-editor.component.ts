import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DefaultEditorComponent } from '../editor-base/default-editor.component';
import { Settings } from '../../../../../../grid-libs/settings/settings';
import { LocalDataSource } from 'projects/ng2-smart-table/src/grid-libs/source/local.data-source';

@Component({
  selector: 'table-editor',
  template: `
		<<ng2-smart-table [componentLoader]="cell.getRow().getDataSet().grid.componentLoader"
		                  [parentRowData]="parentRowData"
		                  [settings]="settings"
		                  [source]="source">
		</ng2-smart-table>
  `
})
export class TableEditorComponent extends DefaultEditorComponent implements OnInit {
  baseSettings: Settings;
  settings: Settings;
  source: LocalDataSource = new LocalDataSource();

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    const column = this.cell.getColumn();

    if (!this.baseSettings || this.baseSettings !== this.cell.getColumn().tableSettings) {
      this.baseSettings = column.tableSettings;
      this.settings = new Settings(column.tableSettings);
    }
    if (!this.source || this.source.data !== this.cell.cellValue.editedValue) {
      this.source = new LocalDataSource(this.cell.cellValue.editedValue as []);
    }
    this.cdr.detectChanges();
  }
}
