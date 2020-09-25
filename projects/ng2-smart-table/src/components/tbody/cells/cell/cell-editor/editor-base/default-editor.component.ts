import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Cell } from '../../../../../../grid-libs/data-set/row/cell/cell';
import { Subject } from 'rxjs';
import { Row } from '../../../../../../grid-libs/data-set/row/row';
import { ParentRowData } from '../../../../../../grid-libs/grid';

@Component({
  template: ''
})
export class DefaultEditorComponent implements OnDestroy {

  protected destroy = new Subject<void>();

  @Input() parentRowData: ParentRowData;
  @Input() rowData: any;
  @Input() cell: Cell;

  @Output() editClick = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();
  @Output() stopEditing = new EventEmitter<any>();

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
