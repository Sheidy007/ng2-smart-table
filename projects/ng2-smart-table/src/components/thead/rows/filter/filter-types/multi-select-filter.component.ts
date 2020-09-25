import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { DefaultFilterComponent } from '../filter-base/default-filter.component';
import { FormControl } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, timer } from 'rxjs';
import { VirtualScrollerComponent } from '../../../../../grid-libs/sys/virtual-scroller';

@Component({
  selector: 'multi-select-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<div class="ngx-rt-multi-select">
			<button (click)="showMultiSelectFlagReverse()"
			        #clickBlockElement
			        class="ngx-rt-multi-select-main-block">
				<div [innerHTML]="selectText + (selected.length) | sanitizeHtml"
				     class="ngx-rt-multi-select-text"></div>
				<div class="ngx-rt-multi-select-arrow"></div>
			</button>
			<div *ngIf="showMultiSelect"
			     #insideElement
			     [ngStyle]="{visibility: scrollableContentProcess?'hidden':''}"
			     class="ngx-rt-multi-select-select-block">
				<div class="ngx-rt-multi-select-selector">
					<input (ngModelChange)="selectAll($event)"
					       [(ngModel)]="allSelected"
					       [indeterminate]="someIsSelected"
					       class="ngx-rt-multi-select-selector-checkbox"
					       type="checkbox"/>
					<div (click)="selectAll(!allSelected)"
					     [innerHTML]="resetText"
					     class="ngx-rt-multi-select-selector-text"></div>
				</div>
				<input #multiSelectSearch
				       [formControl]="inputControl"
				       class="ngx-rt-multi-select-search"
				       placeholder="{{ column.title }}"
				       type="text"/>
				<virtual-scroller #virtualScroller
				                  [bufferAmount]="6"
				                  [childrenClass]="'ngx-rt-multi-select-selector'"
				                  [items]="multiQuerySubject | async"
				                  [ngStyle]="{maxHeight: column.filterMaxHeight+'px',
                                      height: (scrollableContentHeight<column.filterMaxHeight?scrollableContentHeight:column.filterMaxHeight)+'px',
                                      width: scrollableContentWidth + 'px',
                                      minWidth: '100%'}"
				                  [perfectScrollbar]="{
                                wheelSpeed: 0.2,
                                wheelPropagation: false
                              }"
				                  [scrollDebounceTime]="100"
				                  [scrollThrottlingTime]="100"
				                  [useMarginInsteadOfTranslate]="true"
				                  (vsEnd)="vsEnd()"
				                  class="ps ngx-rt-multi-select-selectors">
					<ng-container *ngFor="let option of virtualScroller.viewPortItems">
						<div *ngIf="!option.hidden"
						     class="ngx-rt-multi-select-selector">
							<input (ngModelChange)="changeModel($event, option)"
							       [(ngModel)]="option.checked"
							       class="ngx-rt-multi-select-selector-checkbox"
							       type="checkbox"/>
							<div (click)="changeModel(!option.checked, option)"
							     [innerHTML]="option.title  | sanitizeHtml"
							     class="ngx-rt-multi-select-selector-text"></div>
						</div>
					</ng-container>
				</virtual-scroller>
			</div>
		</div>
  `
})
export class MultiSelectFilterComponent extends DefaultFilterComponent implements OnChanges, OnDestroy {
  @ViewChild('insideElement') insideElement: ElementRef;
  @ViewChild('clickBlockElement') clickBlockElement: ElementRef;
  @ViewChild('virtualScroller') virtualScroller: VirtualScrollerComponent;
  @ViewChild('multiSelectSearch') multiSelectSearch: ElementRef;
  inputControl = new FormControl();

  selectText: string;
  resetText: string;

  multiQuery: { value: string | number, title: string, checked?: boolean, hidden?: boolean }[] = [];
  multiQuerySubject: BehaviorSubject<{ value: string | number, title: string, checked?: boolean, hidden?: boolean }[]>
    = new BehaviorSubject<{ value: string | number; title: string; checked?: boolean; hidden?: boolean }[]>([]);
  showMultiSelect: boolean;

  allSelected: boolean;
  someIsSelected: boolean;

  scrollableContentHeight: number;
  scrollableContentWidth: number;
  scrollableContentProcess = true;

  init = false;

  get selected() {
    return this.multiQuery.filter(m => m.checked === true);
  }

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.init) {
      this.init = true;
      this.reInitFilter(true);
      this.inputControl.valueChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(this.delay),
          takeUntil(this.destroy)
        )
        .subscribe((value: string) => {
          this.multiQuery.forEach(m => m.hidden = !m.title.toLowerCase().includes(value.toLowerCase()));
          this.multiQuerySubject.next(this.multiQuery.filter(m => !m.hidden));
        });
    }
    this.changeFilter(changes.query.currentValue);
  }

  changeFilter(query) {
    if (this.multiQuery.filter(m => m.checked === true).map(m => m.value).join('|') !== query) {
      this.multiQuery.forEach(m =>
        m.checked = !!( query as string ).split('|').find(s => s === m.value.toString())
      );
      this.someIsSelected = !!this.multiQuery.find(m => m.checked);
    }
  }

  reInitFilter(propagate: boolean) {
    if (!this.column.columnFunctions.getFilterConfig().completer) {
      const listSettings = this.column.columnFunctions.getFilterConfig().listSettings;
      this.multiQuery = this.column.columnFunctions.getFilterConfig().listSettings.listMembers;
      this.selectText = listSettings.selectText ? listSettings.selectText : 'Select...';
      this.resetText = listSettings.resetText ? listSettings.resetText : '(Select all)';
    } else {
      const completer = this.column.columnFunctions.getFilterConfig().completer;
      this.multiQuery = this.grid.source.data.map(d =>
        ( {
          value: d[completer.valueField] ? d[completer.valueField] : this.column.defaultValue,
          title: d[completer.valueField] ? d[completer.titleField] : this.column.defaultValue
        } ));
      this.selectText = completer.selectText ? completer.selectText : 'Select...';
      this.resetText = completer.selectAllText ? completer.selectAllText : '(Select all)';
    }
    this.multiQuery = this.multiQuery.filter((value, index, self) =>
      self.findIndex(s => s.value === value.value) === index);
    this.multiQuery.forEach(m => m.checked = false);
    this.multiQuerySubject.next(this.multiQuery.filter(m => !m.hidden));
    this.someIsSelected = !!this.multiQuery.find(m => m.checked);
    super.reInitFilter(propagate);
  }

  refreshFilter() {
    this.reInitFilter(false);
    this.changeFilter(this.query);
  }

  @HostListener('document:click', ['$event.target'])
  docClick(targetElement) {
    if (this.showMultiSelect && this.insideElement && this.clickBlockElement) {
      const clickedInside =
        this.insideElement.nativeElement === targetElement || this.insideElement.nativeElement.contains(targetElement) ||
        this.clickBlockElement.nativeElement === targetElement || this.clickBlockElement.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.showMultiSelect = !this.showMultiSelect;
        this.inputControl.setValue('');
      }
    }

  }

  vsEnd() {
    if (this.scrollableContentHeight !== this.virtualScroller.scrollLength) {
      this.scrollableContentHeight = !!this.virtualScroller.scrollLength ? this.virtualScroller.scrollLength : 1;
    }
    if (this.scrollableContentHeight < ( this.insideElement.nativeElement as HTMLElement ).getElementsByClassName('ngx-rt-scrollable-content')[0].clientHeight) {
      this.scrollableContentHeight = ( this.insideElement.nativeElement as HTMLElement ).getElementsByClassName('ngx-rt-scrollable-content')[0].clientHeight;
    }
    this.scrollableContentWidth = ( this.insideElement.nativeElement as HTMLElement )
      .getElementsByClassName('ngx-rt-scrollable-content')[0].clientWidth;
    this.scrollableContentProcess = false;
    this.cdr.detectChanges();
  }

  showMultiSelectFlagReverse() {
    timer()
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.showMultiSelect = !this.showMultiSelect;
        if (this.showMultiSelect) {
          setTimeout(() => {
            if (this.multiSelectSearch) {
              ( this.multiSelectSearch.nativeElement as HTMLInputElement ).focus();
            }
            this.cdr.detectChanges();
          }, 100);
          this.scrollableContentProcess = true;
        }
        this.cdr.detectChanges();
      });
  }

  changeModel(value, option) {
    option.checked = value;
    this.someIsSelected = !!this.multiQuery.find(m => m.checked)
      && this.multiQuery.filter(m => m.checked).length !== this.multiQuery.length;
    this.allSelected = !!this.multiQuery.find(m => m.checked)
      && this.multiQuery.filter(m => m.checked).length === this.multiQuery.length;
    this.cdr.detectChanges();
    this.setFilter(this.multiQuery.filter(m => m.checked === true).map(m => m.value).join('|'));
  }

  selectAll(value) {
    this.allSelected = value;
    if (this.allSelected) {
      this.multiQuery.forEach(m => m.checked = true);
    } else {
      this.multiQuery.forEach(m => m.checked = false);
    }
    this.someIsSelected = false;
    this.cdr.detectChanges();
    this.setFilter(this.multiQuery.filter(m => m.checked === true).map(m => m.value).join('|'));
  }

  ngOnDestroy() {
    this.cdr.detach();
    super.ngOnDestroy();
  }
}
