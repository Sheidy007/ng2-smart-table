import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilter } from './default-filter';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'checkbox-filter',
  template: `
		<input type="checkbox"
		       [indeterminate]="prevData === null"
		       [formControl]="inputControl"
		       [ngClass]="inputClass"
		       class="form-control">
  `
})
export class CheckboxFilterComponent extends DefaultFilter implements OnInit, OnChanges {

  inputControl = new FormControl();
  prevData: boolean = null;

  constructor() {
    super();
  }

  ngOnInit() {
    this.changesSubscription = this.inputControl.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((checked: boolean) => {
        if (this.prevData === null) {
          this.prevData = true;
        } else if (this.prevData) {
          this.prevData = false;
        } else {
          this.prevData = null;
          this.resetFilter();
        }
        if (this.prevData !== null) {
          const trueVal = (this.column.getFilterConfig() && this.column.getFilterConfig().true) || true;
          const falseVal = (this.column.getFilterConfig() && this.column.getFilterConfig().false) || false;
          this.query = checked ? trueVal : falseVal;
          this.setFilter();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.inputControl.setValue(this.query);
    }
  }

  resetFilter() {
    this.query = '';
    this.inputControl.setValue(false, { emitEvent: false });
    this.setFilter();
  }
}
