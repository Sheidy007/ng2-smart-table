import { Component, Input, OnDestroy } from '@angular/core';
import { Cell } from 'projects/ng2-smart-table/src/grid-libs/data-set/row/cell/cell';
import { Subject } from 'rxjs';
import { Row } from '../../../../../../grid-libs/data-set/row/row';
import { ParentRowData } from '../../../../../../grid-libs/grid';

@Component({
  template: ''
})
export class DefaultViewCellComponent implements OnDestroy {

  protected destroy = new Subject<void>();

  @Input() parentRowData: ParentRowData;
  @Input() rowData: any;
  @Input() cell: Cell;
  @Input() value: string | number | boolean | [];

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
