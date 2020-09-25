import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';
import { DefaultFilterComponent } from '../filter-base/default-filter.component';

@Component({
  selector: 'select-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<select #inputControl
		        [ngModel]="query">
			<option value="">{{ selectText}}</option>
			<option *ngFor="let option of column.columnFunctions.getFilterConfig().listSettings.listMembers" [value]="option.value">
				{{ option.title }}
			</option>
		</select>
  `
})
export class SelectFilterComponent extends DefaultFilterComponent implements OnInit {
  selectText: string;
  @ViewChild('inputControl', { read: NgControl, static: true }) inputControl: NgControl;

  constructor() {
    super();
  }

  ngOnInit() {
    const listSettings = this.column.columnFunctions.getFilterConfig().listSettings;
    this.selectText = listSettings.selectText ? listSettings.selectText : 'Select...';
    this.inputControl.valueChanges
      .pipe(
        skip(1),
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
