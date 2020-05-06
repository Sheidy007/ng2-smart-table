import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { Grid } from '../../lib/grid';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fromEvent, Subscription, timer } from 'rxjs';
import { LocalDataSource } from '../../lib/data-source/local.data-source';

@Component({
  selector: '[ng2-st-tbody]',
  styleUrls: ['./tbody.component.scss'],
  templateUrl: './tbody.component.html'
})
export class Ng2SmartTableTbodyComponent implements OnChanges, AfterViewInit {

  @Input() grid: Grid;
  @Input() source: LocalDataSource;
  @Input() deleteConfirm: EventEmitter<any>;
  @Input() editConfirm: EventEmitter<any>;
  @Input() rowClassFunction: (...arg) => string;
  @Input() rowHeight: number;
  @Input() minTableHeight: string;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() custom = new EventEmitter<any>();
  @Output() edited = new EventEmitter<any>();
  @Output() userSelectRow = new EventEmitter<any>();
  @Output() editRowSelect = new EventEmitter<any>();
  @Output() multipleSelectRow = new EventEmitter<any>();
  @Output() rowHover = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  mode: 'inline' | 'external' | 'click-to-edit';
  editInputClass: string;
  isActionAdd: boolean;
  isActionEdit: boolean;
  isActionDelete: boolean;
  noDataMessage: string;
  timer: Subscription;
  elements: { element: HTMLElement, row: any, visible: boolean }[] = [];

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
  @ViewChildren('rowElements') rowElements: QueryList<ElementRef>;
  @ViewChildren('multipleSelectCheckBox') multipleSelectCheckBox: QueryList<ElementRef>;
  @ViewChildren('actionsLeft') actionsLeft: QueryList<ElementRef>;
  @ViewChildren('actionsRight') actionsRight: QueryList<ElementRef>;
  @ViewChildren('actionsUpdate') actionsUpdate: QueryList<ElementRef>;

  get noHideColumns() {
    return this.grid.getNoHideColumns();
  }

  get tableColumnsCount() {
    const actionColumns = this.isActionAdd || this.isActionEdit || this.isActionDelete ? 1 : 0;
    return this.noHideColumns.length + actionColumns;
  }

  ngAfterViewInit() {
    this.grid.pagingSource.viewport = this.viewport;

    this.rowElements.changes.subscribe((data) => {
      this.checkElementsIsVisible(data.toArray().map(e => e.nativeElement) as HTMLElement[]);
    });

    this.multipleSelectCheckBox.changes.subscribe((data) => {
      const multipleSelectCheckBoxEl = (data.toArray().map(e => e.nativeElement) as HTMLElement[]);
      if (multipleSelectCheckBoxEl && multipleSelectCheckBoxEl.length) {
        const el = multipleSelectCheckBoxEl[0];
        const style = window.getComputedStyle(el);
        const width = el.offsetWidth;
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        if (parseInt(this.grid.widthMultipleSelectCheckBox, 10) < width + margin - padding + border + 5) {
          setTimeout(() => {
              this.grid.widthMultipleSelectCheckBox = width + margin - padding + border + 5 + 'px';
            }
            , 10);
        }
      }
    });

    if (this.showActionColumnLeft || this.showActionColumnRight) {
      [this.actionsUpdate, this.actionsLeft, this.actionsRight].forEach(
        actions => {
          actions.changes.subscribe((data) => {
            const showActionEl = (data.toArray().map(e => e.nativeElement) as HTMLElement[]);
            if (showActionEl && showActionEl.length) {
              const el = showActionEl[0];
              const style = window.getComputedStyle(el);
              const width = el.offsetWidth;
              const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
              const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
              const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
              if (parseInt(this.grid.widthActions, 10) < width + margin - padding + border + 5) {
                setTimeout(() => {
                    this.grid.widthActions = width + margin - padding + border + 5 + 'px';
                  }
                  , 10);
              }
            }
          });
        });
    }

    fromEvent(window, 'resize').subscribe(() => {
      this.viewport.checkViewportSize();
    });
  }

  onScroll() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = timer(100).subscribe(() => {
      this.checkElementsIsVisible();
      const el = this.elements.filter(f => f.visible).slice(-1)[0];
      if (el) {
        this.grid.pagingSource.setPageByRow(el.row);
      }
    });
  }

  checkElementsIsVisible(data?: HTMLElement[]) {
    const listRange = this.viewport.getRenderedRange();
    this.grid.pagingSource.virtualData = this.source.filteredAndSorted.slice(listRange.start, listRange.end);

    if (this.grid.pagingSource.virtualData) {
      data = data ? data : this.elements.map(e => e.element);
      this.elements = [];
      const viewportNative = this.viewport.elementRef.nativeElement as HTMLElement;
      for (let i = 0; i < data.length; i++) {
        this.elements.push({
          element: data[i], row: this.grid.pagingSource.virtualData[i], visible: this.isVisible(data[i], viewportNative)
        });
      }
    }
  }

  isVisible(target: Element, parent: Element) {
    const targetPosition = {
      top: target.getBoundingClientRect().top,
      bottom: target.getBoundingClientRect().bottom
    };
    const parentPosition = {
      top: parent.getBoundingClientRect().top,
      bottom: parent.getBoundingClientRect().bottom
    };

    return (targetPosition.top + targetPosition.bottom) / 2 <= parentPosition.bottom &&
      (targetPosition.top + targetPosition.bottom) / 2 >= parentPosition.top;
  }

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.mode = this.grid.getSetting().mode;
    this.editInputClass = this.grid.getSetting().edit ? this.grid.getSetting().edit.inputClass : '';
    this.isActionAdd = this.grid.getSetting().actions ? this.grid.getSetting().actions.add : false;
    this.isActionEdit = this.grid.getSetting().actions ? this.grid.getSetting().actions.edit : false;
    this.isActionDelete = this.grid.getSetting().actions ? this.grid.getSetting().actions.delete : false;
    this.noDataMessage = this.grid.getSetting().noDataMessage;
  }
}
