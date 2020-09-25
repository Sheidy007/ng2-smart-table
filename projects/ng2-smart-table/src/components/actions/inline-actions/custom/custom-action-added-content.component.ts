import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { BaseActionClass } from '../../../../grid-libs/settings/settings';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rt-custom-added',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
	  <ng-container *ngIf="action.data===row.getData()">
		  <a *ngFor="let cnt of addedContent"
		     (click)="onCustomContent($event, cnt.id, cnt.closeAfterAction)"
		     [innerHTML]="cnt.content | sanitizeHtml"
		     [ngClass]="['ngx-rt-action'+ cnt.id]"
		     class="ngx-rt-action"
		     href="#"></a>
	  </ng-container>
  `
})
export class CustomActionAddedContentComponent implements OnChanges, OnDestroy, OnInit {

  @Input() grid: Grid;
  @Input() row: Row;
  @Input() action: BaseActionClass;
  @Input() position?: 'top' | 'bottom';

  addedContent: { id: string, content: string, closeAfterAction: boolean }[] = [];

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
    this.addedContent = [];
    if (this.action.innerActions) {
      Object.keys(this.action.innerActions).forEach(key => {
        if (( this.position === this.action.innerActions[key].position
          || this.position === 'bottom' && !this.action.innerActions[key].position )
          && ( !this.position || !this.action.innerActions[key].hideInSeparate )) {
          this.addedContent.push({ id: key, content: this.action.innerActions[key].content, closeAfterAction: this.action.innerActions[key].closeAfterAction });
        }
      });
    }
  }

  onCustomContent(event: Event, innerActionId: string, closeAfterAction: boolean) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.customActionAddedContentMakeAction(this.row, this.action, innerActionId, closeAfterAction);
    this.grid.gridActionsFunctions.onAction.next();
  }
}
