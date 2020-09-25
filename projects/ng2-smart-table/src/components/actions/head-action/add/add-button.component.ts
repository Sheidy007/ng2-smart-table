import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Grid } from '../../../../grid-libs/grid';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-rt-add-button',
  template: `
		<a (click)="onCreate($event)"
		   *ngIf="!!grid.settings.actions.add
	            && !(grid.settings.actions.add.data && grid.settings.actions.add.position.includes('inline'))"
		   [innerHTML]="grid.settings.actions.add.content | sanitizeHtml"
		   class="ngx-rt-action ngx-rt-action-add"
		   href="#"></a>
  `
})
export class AddButtonComponent implements OnInit, OnDestroy {

  @Input() grid: Grid;
  private destroy = new Subject<void>();

  ngOnInit() {
    this.grid.gridActionsFunctions.emitAction.pipe(takeUntil(this.destroy)).subscribe((actionId) => {
      if (this.grid.settings.actions.add.id === actionId.actionId) {
        this.onCreate();
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  onCreate(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.grid.gridActionsFunctions.createMakeAction();
  }
}
