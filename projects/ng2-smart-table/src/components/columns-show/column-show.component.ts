import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Grid } from '../../grid-libs/grid';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ngx-rt-column-show',
  styleUrls: ['./column-show.component.scss', '../../ng2-smart-table.component.scss'],
  templateUrl: './column-show.component.html'
})
export class ColumnShowComponent {
  @Input() grid: Grid;
  @Output() changeColumnShow = new EventEmitter<any>();

  constructor() {
  }

  getAnotherWidth(width: string): string {
    return ( 1000 - parseInt(width, 10) ) + '%';
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.grid.getNotHiddenColumns()[event.currentIndex] && !this.grid.getAllColumns()[event.currentIndex].anchor) {
      this.grid.gridResizeColumnsFunctions.doDrgDrop.next(false);
      moveItemInArray(this.grid.getAllColumns(), event.previousIndex, event.currentIndex);
      this.grid.refreshGrid();
    }
  }
}
