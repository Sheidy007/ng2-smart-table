import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-update-cancel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onSave($event)"
		   [innerHTML]="saveButtonContent | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-edit-save"
		   href="#"></a>
		<a (click)="onCancel($event)"
		   [innerHTML]="cancelButtonContent | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-edit-cancel"
		   href="#"></a>
  `
})
export class TbodyCreateCancelComponent implements OnChanges, OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;

  cancelButtonContent: string;
  saveButtonContent: string;

  private destroy = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.grid.gridActionsFunctions.onAction.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.destroy.next();
  }

  ngOnChanges() {
    this.saveButtonContent = this.grid.settings.actions.edit.innerActions['update'].content;
    this.cancelButtonContent = this.grid.settings.actions.edit.innerActions['cancel'].content;
  }

  onSave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.onAction.next();
    this.grid.gridActionsFunctions.applyEdit(this.row);
  }

  onCancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.cancelEdit(this.row);
    this.grid.gridActionsFunctions.onAction.next();
  }
}
