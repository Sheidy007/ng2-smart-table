import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DefaultFilterComponent } from '../filter-base/default-filter.component';

@Component({
  selector: 'input-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<input
				#inputControl
				[ngModel]="query"
				[placeholder]="column.title"
				type="text"/>
  `
})
export class InputFilterComponent extends DefaultFilterComponent implements OnInit {
  @ViewChild('inputControl', { read: NgControl, static: true }) inputControl: NgControl;

  constructor() {
    super();
  }

  ngOnInit() {
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
        takeUntil(this.destroy)
      )
      .subscribe((value) => {
        this.setFilter(value);
      });
    super.ngOnInit();
  }
}
