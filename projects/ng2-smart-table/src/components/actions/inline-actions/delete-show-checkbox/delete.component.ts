import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onDelete($event)"
		   *ngIf="!!grid.settings.actions.delete"
		   [innerHTML]="grid.settings.actions.delete.content | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-delete"
		   href="#"></a>
  `
})
export class DeleteComponent implements OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;

  private destroy = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.grid.gridActionsFunctions.onAction.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.grid.gridActionsFunctions.emitAction.pipe(takeUntil(this.destroy)).subscribe(emitAction => {
      if (this.grid.settings.actions.delete.id === emitAction.actionId && this.row.getData() === emitAction.data) {
        this.onDelete();
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.destroy.next();
  }

  onDelete(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.grid.gridActionsFunctions.delete(this.row);
    this.grid.gridActionsFunctions.onAction.next();
  }
}
