import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BaseSeparateGrid } from '../base-separate-grid/base-separate-grid';

@Component({
  selector: 'ng2-smart-row-create-separate',
  styleUrls: ['./create-separate.component.scss', '../../../../ng2-smart-table.component.scss'],
  templateUrl: './create-separate.component.html'
})
export class CreateSeparateComponent extends BaseSeparateGrid implements OnDestroy, OnInit {
  constructor(public element: ElementRef) {
    super('createSeparate', element);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this.grid.gridActionsFunctions.cancelCreate();
    super.ngOnDestroy();
  }
}
