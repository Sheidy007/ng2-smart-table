import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseActionClass, Grid } from 'ng2-smart-table';

@Component({
  selector: 'app-test-custom-action',
  templateUrl: './test-custom-action.component.html',
  styleUrls: ['./test-custom-action.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TestCustomActionComponent implements OnInit {
  @Input() row: any;
  @Input() grid: Grid;
  @Input() action: BaseActionClass;

  ngOnInit() {
  }
}
