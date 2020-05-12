import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grid } from '../../lib/grid';
import { Row } from '../../lib/data-set/row/row';
import { Cell } from '../../lib/data-set/row/cell/cell';

@Component({
  selector: 'ng2-smart-row-edit-separate',
  styleUrls: ['./row-edit-separate.component.scss', '../../ng2-smart-table.component.scss'],
  templateUrl: './row-edit-separate.component.html'
})
export class RowEditSeparateComponent implements OnInit {
  @Input() grid: Grid;
  @Input() editingRow: Row;
  @Output() saveUpdateConfirm = new EventEmitter<any>();
  @Output() changeColumnShow = new EventEmitter<any>();
  @Output() finishEditRowSelect = new EventEmitter<any>();

  inputClass: string;

  get sortedCells(): Cell[] {
    return this.editingRow.allCells.filter(cell => cell.getColumn().editable).sort((cellA, cellB) =>
      cellA.getColumn().editSeparateGrid.index.toString().localeCompare(cellB.getColumn().editSeparateGrid.index.toString()));
  }
  constructor() {

  }

  ngOnInit() {

  }

  onFinishEditRowSelect() {
    this.finishEditRowSelect.emit();
  }
}
