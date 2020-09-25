import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Row } from '../grid-libs/data-set/row/row';
import { VirtualScrollerComponent } from '../grid-libs/sys/virtual-scroller';
import { Grid } from '../grid-libs/grid';

@Directive({ selector: '[rowShow]' })
export class RowShowDirective implements OnDestroy, OnInit {
  @Input() hideTrigger: BehaviorSubject<boolean>;
  @Input() parent: VirtualScrollerComponent;
  @Input() row: Row;
  @Input() grid: Grid;

  private destroy = new Subject<void>();

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    this.hideTrigger.pipe(takeUntil(this.destroy)).subscribe((hide) => {
      if (hide) {
        const viewTopParent = ( this.parent.element.nativeElement as HTMLElement ).getBoundingClientRect().top;
        const viewBottomElement = ( this.element.nativeElement as HTMLElement ).getBoundingClientRect().bottom;

        const viewBottomParent = ( this.parent.element.nativeElement as HTMLElement ).getBoundingClientRect().bottom;
        const viewTopElement = ( this.element.nativeElement as HTMLElement ).getBoundingClientRect().top;

        if (viewTopElement - viewBottomParent > this.grid.settings.minRowHeightPx || viewTopParent - viewBottomElement > this.grid.settings.minRowHeightPx) {
          ( this.element.nativeElement as HTMLElement ).style.height = ( this.element.nativeElement as HTMLElement ).clientHeight + 'px';
          this.row.showContent = false;
        }
      } else {
        this.row.showContent = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
