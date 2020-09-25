import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFilterComponent } from '../filter-base/default-filter.component';
import { delay, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'checkbox-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<input type="checkbox"
		       [indeterminate]="indeterminate"
		       [formControl]="inputControl">
  `
})
export class CheckboxFilterComponent extends DefaultFilterComponent implements OnChanges {

  inputControl = new FormControl();
  indeterminate = true;
  init = false;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.init) {
      this.init = true;
      this.inputControl.valueChanges
        .pipe(
          takeUntil(this.destroy))
        .subscribe((checked: boolean) => {
          const filterConfig = this.column.columnFunctions.getFilterConfig();
          if (checked == null) {
            this.indeterminate = true;
            this.query = '';
          } else {
            if (checked) {
              if (this.indeterminate) {
                this.indeterminate = false;
                this.query = ( filterConfig && filterConfig.checkboxSettings.true ) || true;
              } else {
                this.indeterminate = true;
                this.query = '';
                this.inputControl.setValue(null, { emitEvent: false });
              }
            } else {
              this.indeterminate = false;
              this.query = ( filterConfig && filterConfig.checkboxSettings.false ) || false;
            }
          }
          this.setFilter(this.query);
        });
    }
    if (changes.query) {
      this.initChanges(changes.query.currentValue);
    }
  }

  initChanges(query) {
    const filterConfig = this.column.columnFunctions.getFilterConfig();
    if (filterConfig) {
      if (filterConfig.checkboxSettings.true === query && this.inputControl.value !== true) {
        this.inputControl.setValue(true);
      } else if (filterConfig.checkboxSettings.false === query && this.inputControl.value !== false) {
        this.inputControl.setValue(false);
      } else if ('' === query && this.inputControl.value != null) {
        this.inputControl.setValue(null);
      }
    }
  }
}
