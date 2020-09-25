import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-show',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onShow($event)"
		   *ngIf="!!grid.settings.actions.show"
		   [innerHTML]="(grid.settings.actions.show.data===row.getData()?clickHtmlObjectHide:clickHtmlObjectShow) | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-show"
		   href="#"></a>
  `
})
export class ShowComponent implements OnChanges, OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;

  clickHtmlObjectHide: string;
  clickHtmlObjectShow: string;

  private destroy = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.grid.gridActionsFunctions.onAction.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.grid.gridActionsFunctions.emitAction.pipe(takeUntil(this.destroy)).subscribe(emitAction => {
      if (this.grid.settings.actions.show.id === emitAction.actionId && this.row.getData() === emitAction.data) {
        this.onShow();
      }
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.destroy.next();
  }

  ngOnChanges() {
    this.clickHtmlObjectHide = this.grid.settings.actions.show.innerActions['hide'].content;
    this.clickHtmlObjectShow = this.grid.settings.actions.show.innerActions['show'].content;
  }

  onShow(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.grid.gridActionsFunctions.showMakeAction(this.row);
    this.grid.gridActionsFunctions.onAction.next();
  }
}
