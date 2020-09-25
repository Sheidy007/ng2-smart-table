import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { BaseSeparateGrid } from '../base-separate-grid/base-separate-grid';

@Component({
  selector: 'ngx-rt-row-view-separate',
  styleUrls: ['./show-separate.component.scss', '../../../../ng2-smart-table.component.scss'],
  templateUrl: './show-separate.component.html'
})
export class ShowSeparateComponent extends BaseSeparateGrid implements OnDestroy, OnInit {
  constructor(public element: ElementRef) {
    super('showSeparate', element);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    this.grid.gridActionsFunctions.hideMakeAction();
    super.ngOnDestroy();
  }
}
