import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CompleterService } from '@akveo/ng2-completer';

import { DefaultFilter } from './default-filter';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'completer-filter',
  template: `
		<ng2-completer [(ngModel)]="query"
		               (ngModelChange)="inputTextChanged($event); completerContent.next($event)"
		               [dataService]="column.getFilterConfig().completer.dataService"
		               [minSearchLength]="column.getFilterConfig().completer.minSearchLength || 0"
		               [pause]="column.getFilterConfig().completer.pause || 0"
		               [placeholder]="column.getFilterConfig().completer.placeholder || 'Start typing...'">
		</ng2-completer>
  `
})
export class CompleterFilterComponent extends DefaultFilter implements OnInit {

  completerContent = new Subject<any>();

  constructor(private completerService: CompleterService) {
    super();
  }

  ngOnInit() {
    const config = this.column.getFilterConfig().completer;
    let result = config.data
      .map(d => ({ search: d[config.searchFields], title: d[config.titleField], desc: config.descriptionField }));
    result = result.filter((r) => {
      return r.search in result ? false : (result[r.search] = 1);
    });
    config.dataService = this.completerService.local(result, 'search', 'title');
    config.dataService.descriptionField('desc');

    this.changesSubscription = this.completerContent
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
        takeUntil(this.destroy)
      )
      .subscribe((search: string) => {
        this.query = search;
        this.setFilter();
      });
  }

  inputTextChanged(event: string) {
    if (event === '') {
      this.completerContent.next(event);
    }
  }
}
