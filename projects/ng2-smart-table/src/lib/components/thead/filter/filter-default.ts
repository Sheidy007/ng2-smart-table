import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Column } from '../../../lib/data-set/column';
import { FilterClass } from '../../../lib/data-source/data-source.class';
import { LocalDataSource } from '../../../lib/data-source/local.data-source';
import { SettingsClass } from '../../../lib/settings.class';

@Component({
  template: ''
})
export class FilterDefault {

  @Input() column: Column;
  @Input() source: LocalDataSource;
  @Input() settings: SettingsClass;
  @Input() inputClass = '';

  @Output() filter = new EventEmitter<any>();

  query = '';

  onFilter(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction()
    } as FilterClass, this.settings.andOperator);
  }
}
