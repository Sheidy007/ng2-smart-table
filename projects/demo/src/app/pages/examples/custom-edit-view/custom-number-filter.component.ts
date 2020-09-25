import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DefaultFilterComponent } from 'ng2-smart-table';

@Component({
  template: `
		<input
				#inputControl
				[ngModel]="query"
				[placeholder]="column.title"
				type="number">
  `
})
export class CustomNumberFilterComponent extends DefaultFilterComponent implements OnInit {
  @ViewChild('inputControl', { read: NgControl, static: true }) inputControl: NgControl;

  constructor() {
    super();
  }

  ngOnInit() {
    this.inputControl.valueChanges
      .pipe(
        delay(0),
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
