import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Column } from '../../../../lib/data-set/column/column';
import { SettingsClass } from '../../../../lib/settings.class';
import { LocalDataSource } from '../../../../lib/data-source/local.data-source';

@Component({
  selector: 'ng2-st-column-title',
  template: `
		<div class="ng2-smart-title">
			<ng2-smart-table-title
					(sort)="sort.emit($event)"
					[column]="column"
					[source]="source"
					[settings]="settings"></ng2-smart-table-title>
		</div>
  `
})
export class ColumnTitleComponent {

  @Input() column: Column;
  @Input() source: LocalDataSource;
  @Input() settings: SettingsClass;
  @Output() sort = new EventEmitter<any>();

}
