import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';

@Component({
  selector: '[ngx-rt-close-separate-component]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<a (click)="onClick($event)"
		   [innerHTML]="grid.settings.actions.closeContent | sanitizeHtml"
		   class="ngx-rt-close-separate-component-action"
		   href="#"></a>
		<ng-content></ng-content>
  `
})
export class CloseActionComponent {

  @Input() grid: Grid;
  @Input() viewType: 'inline' | 'expandRow' | 'quickView' | 'details' | 'modal';

  onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.grid.gridActionsFunctions.destroyLastComponentOfViewType(this.viewType);
  }

}
