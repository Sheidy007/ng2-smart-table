import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';

import { Grid } from '../../grid-libs/grid';
import { BehaviorSubject, fromEvent, of, Subject, timer } from 'rxjs';
import { debounceTime, delay, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Row } from '../../grid-libs/data-set/row/row';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { VirtualScrollerComponent } from '../../grid-libs/sys/virtual-scroller';
import { CheckboxSelectComponent } from '../actions/inline-actions/delete-show-checkbox/checkbox-select.component';
import { InlineActionComponent } from '../actions/inline-actions/inline-actions.component';

@Component({
  selector: '[ngx-rt-tbody]',
  styleUrls: ['./tbody.component.scss'],
  templateUrl: './tbody.component.html'
})
export class Ng2SmartTableTbodyComponent implements DoCheck, AfterViewInit, OnDestroy {

  @Input() grid: Grid;

  showMultiSelectColumnLeft: boolean;
  showMultiSelectColumnRight: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;

  isActionEdit: boolean;
  isActionDelete: boolean;

  noDataMessage: string;
  viewPortRowMiddle: Row;

  mousedownRow: Row;
  mouseDblDownRow: Row;

  pageTop = new BehaviorSubject<number>(1);
  pagesOnScreen: HTMLElement[] = [];

  startIndexWithBuffer = 0;

  @ViewChild('virtualScrollViewport', { static: false }) viewport: VirtualScrollerComponent;
  @ViewChild('perfectScrollbar', { static: false }) perfectScrollbar: PerfectScrollbarDirective;

  @ViewChildren('dynamicExpandRowTarget', { read: ViewContainerRef }) dynamicExpandRowTarget: QueryList<ViewContainerRef>;

  @ViewChildren('multipleSelectCheckBox') multipleSelectCheckBox: QueryList<CheckboxSelectComponent>;
  @ViewChildren('actionsLeft') actionsLeft: QueryList<InlineActionComponent>;
  @ViewChildren('actionsRight') actionsRight: QueryList<InlineActionComponent>;

  @ViewChildren('pages') pages: QueryList<ElementRef>;

  get noHideColumns() {
    return this.grid.getNotHiddenColumns();
  }

  get tableColumnsCount() {
    const actionColumns = this.isActionEdit || this.isActionDelete ? 1 : 0;
    return this.noHideColumns.length + actionColumns;
  }

  private destroy = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  shouldShowPage(): boolean {
    if (!this.grid.pagingSource.getPaging()) { return false; }
    return this.grid.source.countAll() > this.grid.pagingSource.getPaging().perPage;
  }

  ngAfterViewInit() {
    this.grid.pagingSource.viewport.next(this.viewport);
    this.grid.pagingSource.perfectScrollbar = this.perfectScrollbar;
    this.grid.pagingSource.viewport.value.vsEnd.pipe(
      takeUntil(this.destroy)).subscribe((value) => {
      this.viewport.viewPortItems.filter(r => r.toReInit).forEach(r => r.initCells());
      this.grid.dataSet.viewPortItems.next([...this.viewport.viewPortItems]);
      const visibleMiddle = Math.ceil(this.grid.dataSet.viewPortItems.value.length / 3 + this.grid.settings.bufferVirtualScrollCount / 2);
      const row = this.grid.dataSet.viewPortItems.value[visibleMiddle];
      if (row && row !== this.viewPortRowMiddle) {
        this.viewPortRowMiddle = row;
        this.grid.pagingSource.setPageByRow(row.getData());
      }
      this.startIndexWithBuffer = value.startIndexWithBuffer;
      this.cdr.detectChanges();
    });

    this.grid.dataSet.filteredAndSortedRows.pipe(
      takeUntil(this.destroy),
      delay(0)).subscribe(rows => {
      timer(0).pipe(
        takeUntil(this.destroy)).subscribe(() => {
        this.grid.pagingSource.viewport.value.items = rows;
        timer(1).pipe(
          takeUntil(this.destroy)).subscribe(() => {
          this.grid.resetScroll();
        });
      });
    });

    this.pages.changes.pipe(
      takeUntil(this.destroy),
      delay(0))
      .subscribe((data) => {
        this.pagesOnScreen = data.toArray().map(e => e.nativeElement) as HTMLElement[];
        this.updateTopPage();
      });

    if (this.showMultiSelectColumnLeft || this.showMultiSelectColumnRight) {
      this.multipleSelectCheckBox.changes.pipe(
        takeUntil(this.destroy),
        delay(0)).subscribe((data) => {
        const actionShowDetailsEl = ( data.toArray().map((e: CheckboxSelectComponent) => e.element.nativeElement) as HTMLElement[] );
        this.grid.getActionColumnElementWidth(actionShowDetailsEl, this.grid.gridResizeColumnsFunctions.widthMultipleSelectCheckBoxColumn);
      });
    }

    if (this.showActionColumnLeft) {
      this.actionsLeft.changes.pipe(
        takeUntil(this.destroy),
        delay(0)).subscribe((data) => {
        const actionShowDetailsEl = ( data.toArray().map((e: InlineActionComponent) => e.element.nativeElement) as HTMLElement[] );
        this.grid.getActionColumnElementWidth(actionShowDetailsEl, this.grid.gridResizeColumnsFunctions.widthActionsColumnLeft);
      });
    }
    if (this.showActionColumnRight) {
      this.actionsRight.changes.pipe(
        takeUntil(this.destroy),
        delay(0)).subscribe((data) => {
        const actionShowDetailsEl = ( data.toArray().map((e: InlineActionComponent) => e.element.nativeElement) as HTMLElement[] );
        this.grid.getActionColumnElementWidth(actionShowDetailsEl, this.grid.gridResizeColumnsFunctions.widthActionsColumnRight);
      });
    }

    this.dynamicExpandRowTarget.changes.pipe(
      takeUntil(this.destroy),
      delay(0))
      .subscribe((data) => {
        const actionShowDetailsEl = ( data.toArray() as ViewContainerRef[] )[0];
        if (actionShowDetailsEl) {
          this.grid.gridActionsFunctions.dynamicExpandRowTarget = actionShowDetailsEl;
        }
      });

    timer(500).pipe(
      takeUntil(this.destroy)).subscribe(() => {
      this.grid.refreshGrid();
    });
  }

  ngDoCheck() {
    this.showMultiSelectColumnLeft = this.grid.showMultiSelectColumnLeft();
    this.showMultiSelectColumnRight = this.grid.showMultiSelectColumnRight();
    this.showActionColumnLeft = this.grid.showActionColumnLeft();
    this.showActionColumnRight = this.grid.showActionColumnRight();
    this.isActionEdit = this.grid.settings.actions ? !!this.grid.settings.actions.edit : false;
    this.isActionDelete = this.grid.settings.actions ? !!this.grid.settings.actions.delete : false;
    this.noDataMessage = this.grid.settings.noDataMessage;
  }

  trackByFn(index, item: Row) {
    return item.getData().system_info_777_uuid; // unique id corresponding to the item
  }

  onScrollHorizontal(e) {
    this.updateTopPage();
    if (e && this.grid.pagingSource.mainTableHead.scrollLeft !== e.target.scrollLeft) {
      this.grid.pagingSource.mainTableHead.scrollLeft = e.target.scrollLeft;
    }
  }

  viewportResize() {
    this.grid.pagingSource.viewportHeight.next(this.grid.pagingSource.viewport.value['element'].nativeElement.clientHeight);
    this.grid.pagingSource.viewportWidth.next(this.grid.pagingSource.viewport.value['element'].nativeElement.clientWidth);
    this.grid.resetScroll();
  }

  resizeCardHeight(event: MouseEvent) {
    this.grid.gridActionsFunctions.resizingCardHeight = true;
    let startPosY = event.screenY;
    const oldWidth = this.grid.settings.expandRowHeight * ( this.grid.pagingSource.viewport.value as any ).element.nativeElement.clientHeight / 100;
    const oldPercent = this.grid.settings.expandRowHeight;
    fromEvent(window, 'mousemove')
      .pipe(switchMap((e: MouseEvent) => {
          this.grid.gridActionsFunctions.resizingCardHeight = true;
          return of(e);
        }),
        debounceTime(10),
        finalize(() => {
          this.grid.gridActionsFunctions.resizingCardHeight = false;
          this.grid.resetScroll();
        }),
        takeUntil(fromEvent(window, 'mouseup')),
        takeUntil(this.destroy))
      .subscribe((e: MouseEvent) => {
        if (!this.grid.gridActionsFunctions.resizingCardHeight) {
          startPosY = e.screenY;
        }

        const newWidth = oldWidth + ( startPosY - e.screenY );
        let newWidthPercent = ( !oldPercent ? 1 : oldPercent ) * newWidth / ( !oldWidth ? 1 : oldWidth );
        if (newWidthPercent < this.grid.settings.minExpandRowHeight) {
          newWidthPercent = this.grid.settings.minExpandRowHeight;
        } else if (newWidthPercent > this.grid.settings.maxExpandRowHeight) {
          newWidthPercent = this.grid.settings.maxExpandRowHeight;
        }
        this.grid.settings.expandRowHeight = newWidthPercent;
        this.grid.resetScroll();
        this.grid.saveSettingsToLocalStorage();
      });
  }

  updateTopPage() {
    timer(0).pipe(debounceTime(10)).subscribe(() => {
      const viewTop = ( this.grid.pagingSource.viewport.value.element.nativeElement as HTMLElement ).getBoundingClientRect().top;
      let minDif = this.grid.settings.innerTableHeightPx;
      let page = null;
      for (const el of this.pagesOnScreen) {
        if (el.getBoundingClientRect().bottom !== 0 && Math.abs(el.getBoundingClientRect().bottom - viewTop) < minDif) {
          minDif = Math.abs(el.getBoundingClientRect().bottom - viewTop);
          page = el;
        }
      }
      if (page) {
        const valuePage = parseInt(( page as Element ).getElementsByTagName('td')[0].innerHTML, 10);
        if (minDif < this.grid.settings.minRowHeightPx / 2 || page.getBoundingClientRect().bottom < viewTop) {
          this.pageTop.next(valuePage);
        } else {
          this.pageTop.next(valuePage - 1);
        }
      }
    });
  }

  resizeAction(event, widthSubject: BehaviorSubject<number>) {
    if (event && event.width) {
      const width = Math.ceil(event.width);
      if (Math.ceil(widthSubject.value) < width) {
        widthSubject.next(Math.ceil(width));
        this.cdr.detectChanges();
      }
    }
  }

  ngOnDestroy(): void {
    this.cdr.detach();
    this.destroy.next();
    this.destroy.complete();
  }
}
