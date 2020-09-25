import { Column } from '../../../settings/column/column';
import { Row } from '../row';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep, isEqual } from 'lodash';

export class Cell {

  cellValue: ValueWithDefault<any>;

  constructor(protected row: Row, protected column: Column, cellInputValue: any, defaultValue: any) {
    this.cellValue = new ValueWithDefault<any>(cellInputValue, defaultValue, this.row.getData(), this.column.columnFunctions.getValuePrepareFunction());
  }

  getColumn(): Column {
    return this.column;
  }

  getRow(): Row {
    return this.row;
  }

  getId(): string {
    return this.column.id;
  }

  getTitle(): string {
    return this.column.title;
  }

  isEditable(): boolean {
    if (this.getRow().getData().system_info_777_uuid === -1) {
      return this.getColumn().addable;
    } else {
      return this.getColumn().editable;
    }
  }
}

export class ValueWithDefault<T> {
  public realValue: T;
  public defaultValue: T;
  public editedValue: T;
  public computedValue: BehaviorSubject<T> = new BehaviorSubject<T>(null);
  public showMinimize = false;

  constructor(value: T, defaultValue: T, public data: any, public computedFn: () => any) {
    this.realValue = value;
    this.editedValue = cloneDeep(value);
    this.defaultValue = cloneDeep(defaultValue);
    this.setComputedValue();
  }

  saveToRealValue() {
    [this.editedValue, this.realValue] = [this.realValue, this.editedValue];
    this.resetEditedValue();
    this.setComputedValue();
  }

  resetEditedValue() {
    this.editedValue = cloneDeep(this.realValue);
  }

  updateIfNotEq(value) {
    if (!isEqual(value, this.realValue)) {
      this.editedValue = value;
      this.saveToRealValue();
    }
  }

  private setComputedValue() {
    const valid = this.computedFn instanceof Function;
    const prepare = valid ? this.computedFn : (v: any) => v;
    const compVal = prepare.call(null, this.realValue, this.data, this);
    this.computedValue.next(compVal ?? this.defaultValue);
  }

  isEq(): boolean {
    return ( isEqual(this.editedValue, this.realValue) );
  }

  isEmpty(): boolean {
    return !this.editedValue;
  }

  isEmptyOrNotEq(): boolean {
    return this.isEmpty() || !this.isEq();
  }
}
