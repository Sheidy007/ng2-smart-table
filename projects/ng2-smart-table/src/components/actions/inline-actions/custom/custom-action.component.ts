import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { Grid } from '../../../../grid-libs/grid';
import { BaseActionClass } from '../../../../grid-libs/settings/settings';
import { CustomSeparateComponent } from '../../separate-actions/custom-separate/custom-separate.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-custom-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onCustom($event)"
		   *ngIf="!(action.data === row.getData() && action.position.includes('inline'))"
		   [innerHTML]="action.content | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-custom-action"
		   href="#"></a>
  `
})
export class CustomActionComponent implements OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() action: BaseActionClass;

  private destroy = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.grid.gridActionsFunctions.onAction.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.grid.gridActionsFunctions.emitAction.pipe(takeUntil(this.destroy)).subscribe((emitAction) => {
      if (this.action.id === emitAction.actionId && this.row.getData() === emitAction.data) {
        this.onCustom();
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.destroy.next();
  }

  onCustom(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.grid.gridActionsFunctions.customActionMakeAction(this.row, this.action, CustomSeparateComponent);
    this.grid.gridActionsFunctions.onAction.next();
  }

}
