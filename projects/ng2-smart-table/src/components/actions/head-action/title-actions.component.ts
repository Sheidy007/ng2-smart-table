import { Component, ElementRef, Input } from '@angular/core';
import { Grid } from '../../../grid-libs/grid';

@Component({
  selector: '[ngx-rt-actions-title]',
  template: `
		{{ position === 'left' ? grid.settings.actions.titleLeft : grid.settings.actions.titleRight }}
  `
})
export class TitleActionsComponent {

  constructor(public element: ElementRef) {}
  @Input() grid: Grid;
  @Input() position: 'left' | 'right' | 'top' | 'bottom';
}
