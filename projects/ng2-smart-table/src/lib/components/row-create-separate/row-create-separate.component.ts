import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grid } from '../../lib/grid';
import { Row } from '../../lib/data-set/row/row';
import { Cell } from '../../lib/data-set/row/cell/cell';

@Component({
  selector: 'ng2-smart-row-create-separate',
  styleUrls: ['./row-create-separate.component.scss', '../../ng2-smart-table.component.scss'],
  templateUrl: './row-create-separate.component.html'
})
export class RowCreateSeparateComponent implements OnInit {
  @Input() grid: Grid;
  @Input() creatingRow: Row;
  @Output() createConfirm = new EventEmitter<any>();
  @Output() changeColumnShow = new EventEmitter<any>();
  @Output() finishEditRowCreating = new EventEmitter<any>();

  inputClass: string;

  get sortedCells(): Cell[] {
    return this.creatingRow.allCells.filter(cell => cell.getColumn().addable).sort((cellA, cellB) =>
      cellA.getColumn().createSeparateGrid.index.toString().localeCompare(cellB.getColumn().createSeparateGrid.index.toString()));
  }
  constructor() {

  }

  ngOnInit() {

  }

  onCreate(event: any) {
    event.stopPropagation();
    this.grid.create(this.grid.getNewRow(), this.createConfirm);
  }

  onFinishEditRowCreating() {
    this.finishEditRowCreating.emit();
  }
}
