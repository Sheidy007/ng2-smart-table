import { Input, Output, EventEmitter, OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Column } from '../../../lib/data-set/column';

@Component({
  template: '',
})
export class DefaultFilter implements Filter, OnDestroy {

  changesSubscription: Subscription;
  @Input() delay = 300;
  @Input() query: string | boolean | number;
  @Input() inputClass: string;
  @Input() column: Column;
  @Output() filter = new EventEmitter<string | boolean | number>();

  ngOnDestroy() {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }

  setFilter() {
    this.filter.emit();
  }
}

export interface Filter {

  delay?: number;
  changesSubscription?: Subscription;
  query: string | boolean | number;
  inputClass: string;
  column: Column;
  filter: EventEmitter< string | boolean | number>;
}
