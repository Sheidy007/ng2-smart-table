import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grid } from '../../lib/grid';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ng2-smart-table-column-show',
  styleUrls: ['./column-show.component.scss', '../../ng2-smart-table.component.scss'],
  templateUrl: './column-show.component.html'
})
export class ColumnShowComponent implements OnInit {
  @Input() grid: Grid;

  @Output() changeColumnShow = new EventEmitter<any>();

  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
  }

  resetTable() {
    const columns = this.grid.getNoHideColumns();
    let widthSum = 0;
    columns.forEach((col) => {
      widthSum += parseInt(col.width, 10);
    });
    columns.forEach((col) => {
      const w = Math.round(1000 / widthSum * parseInt(col.width, 10));
      col.width = w + '%';
    });
    this.grid.getRows().forEach(row => row.process());
    this.grid.getDataSet().setSettings();
  }

  getAnotherWidth(width: string): string {
    return (1000 - parseInt(width, 10)) + '%';
  }

  drop(event: CdkDragDrop<string[]>) {
    this.grid.doDrgDrop = false;
    moveItemInArray(this.grid.getColumns(), event.previousIndex, event.currentIndex);
    const columns = this.grid.getNoHideColumns();
    let widthSum = 0;
    columns.forEach((col) => {
      widthSum += parseInt(col.width, 10);
    });
    columns.forEach((col) => {
      const w = Math.round(1000 / widthSum * parseInt(col.width, 10));
      col.width = w + '%';
    });
    this.grid.getRows().forEach(row => row.process());
    this.grid.getDataSet().setSettings();
  }
}
