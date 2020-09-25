import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onEdit($event)"
		   *ngIf="!!grid.settings.actions.edit
	            && !(grid.settings.actions.edit.data && grid.settings.actions.edit.position.includes('inline'))"
		   [innerHTML]="grid.settings.actions.edit.content | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-edit"
		   href="#"></a>
  `
})
export class TbodyEditComponent implements OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;

  private destroy = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.grid.gridActionsFunctions.onAction.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.grid.gridActionsFunctions.emitAction.pipe(takeUntil(this.destroy)).subscribe((emitAction) => {
      if (this.grid.settings.actions.edit.id === emitAction.actionId && this.row.getData() === emitAction.data) {
        this.onEdit();
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.destroy.next();
  }

  onEdit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.grid.gridActionsFunctions.editMakeAction(this.row);
    this.grid.gridActionsFunctions.onAction.next();
  }
}
