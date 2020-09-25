import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BaseSeparateGrid } from '../base-separate-grid/base-separate-grid';

@Component({
  selector: 'ng2-smart-row-edit-separate',
  styleUrls: ['./edit-separate.component.scss', '../../../../ng2-smart-table.component.scss'],
  templateUrl: './edit-separate.component.html'
})
export class EditSeparateComponent extends BaseSeparateGrid implements OnDestroy, OnInit {
  constructor(public element: ElementRef) {
    super('editSeparate', element);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this.grid.gridActionsFunctions.cancelEdit(this.row);
    super.ngOnDestroy();
  }
}
