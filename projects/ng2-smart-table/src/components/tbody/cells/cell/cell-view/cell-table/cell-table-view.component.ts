import { ChangeDetectorRef, Component, OnChanges } from '@angular/core';
import { DefaultViewCellComponent } from '../view-base/default-view-cell.component';
import { Settings } from 'projects/ng2-smart-table/src/grid-libs/settings/settings';
import { LocalDataSource } from 'projects/ng2-smart-table/src/grid-libs/source/local.data-source';

@Component({
  selector: 'cell-table-view',
  template: `
		<ng2-smart-table [componentLoader]="cell.getRow().getDataSet().grid.componentLoader"
		                 [parentRowData]="parentRowData"
		                 [settings]="settings"
		                 [source]="source">
    </ng2-smart-table>
  `
})
export class CellTableViewComponent extends DefaultViewCellComponent implements OnChanges {
  baseSettings: Settings;
  settings: Settings;
  source: LocalDataSource = new LocalDataSource();

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnChanges() {
    if (!this.baseSettings || this.baseSettings !== this.cell.getColumn().tableSettings) {
      this.baseSettings = this.cell.getColumn().tableSettings;
      this.settings = new Settings(this.cell.getColumn().tableSettings);
    }
    if (!this.source || this.source.data !== this.value) {
      this.source = new LocalDataSource(this.value as []);
    }
    this.cdr.detectChanges();
  }
}
