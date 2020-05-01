import { Output, EventEmitter, Input, Component } from '@angular/core';

import { Column } from '../../lib/data-set/column';
import { DataSource } from '../../lib/data-source/data-source';
import {FilterClass} from '../../lib/data-source/data-source.class';

@Component({
  template: '',
})
export class FilterDefault {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() inputClass = '';

  @Output() filter = new EventEmitter<any>();

  query = '';

  onFilter(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
    } as FilterClass);
  }
}
