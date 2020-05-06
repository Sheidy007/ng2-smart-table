import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PagingClass } from '../../lib/data-source/data-source.class';
import { Grid } from '../../lib/grid';
import { LocalDataSource } from '../../lib/data-source/local.data-source';

@Component({
  selector: 'ng2-smart-table-pager',
  styleUrls: ['./pager.component.scss'],
  template: `
		<nav *ngIf="shouldShow()"
		     class="ng2-smart-pagination-nav">
			<ul class="ng2-smart-pagination pagination">
				<li [ngClass]="{disabled: getPage() == 1}"
				    class="ng2-smart-page-item page-item">
					<button (click)="paginate(1)"
					        aria-label="First"
					        class="ng2-smart-page-link page-link"
					>
						&laquo;
					</button>
				</li>
				<li class="ng2-smart-page-item page-item" [ngClass]="{disabled: getPage() == 1}">
					<button (click)="prev()"
					        aria-label="Prev"
					        class="ng2-smart-page-link page-link page-link-prev">
						&lt;
					</button>
				</li>
				<li *ngFor="let page of getPages()"
				    [ngClass]="{active: getPage() == page}"
				    class="ng2-smart-page-item page-item">
          <span *ngIf="getPage() == page"
                class="ng2-smart-page-link page-link">
            {{ page }}
          </span>
					<button (click)="paginate(page)" *ngIf="getPage() != page"
					        class="ng2-smart-page-link page-link">
						{{ page }}
					</button>
				</li>
				<li class="ng2-smart-page-item page-item"
				    [ngClass]="{disabled: getPage() == getLast()}">
					<button (click)="next()"
					        aria-label="Next"
					        class="ng2-smart-page-link page-link page-link-next">
						&gt;
					</button>
				</li>
				<li class="ng2-smart-page-item page-item"
				    [ngClass]="{disabled: getPage() == getLast()}">
					<button class="ng2-smart-page-link page-link"
					        (click)="paginate(getLast())" aria-label="Last">
						&raquo;
					</button>
				</li>
			</ul>
		</nav>
		<nav *ngIf="this.pageConf  && perPageSettings && perPageSettings['length']"
		     class="ng2-smart-pagination-per-page">
			<label>
				Per Page:
			</label>
			<select (change)="onChangePerPage()"
			        [(ngModel)]="this.pageConf.perPage">
				<option *ngFor="let item of perPageSettingsArray"
				        [value]="item">
					{{ item }}
				</option>
			</select>
		</nav>
		<button (click)="reSetSettings()">reset settings</button>
		<button (click)="reSetFilters()">reset filters</button>
		<button (click)="reSetSorts()">reset sorts</button>
  `
})
export class PagerComponent implements OnInit {
  @Input() source: LocalDataSource;
  @Input() grid: Grid;
  @Input() perPageSettings: number | number[] = [];

  @Output() changePage = new EventEmitter<any>();

  pageConf: PagingClass;
  protected pages: number[];
  protected count = 0;

  get perPageSettingsArray(): number[] {
    return this.perPageSettings as number[];
  }

  constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.pageConf = this.grid.pagingSource.getPaging();

    this.grid.pagingSource.onChanged.subscribe(() => {
      this.initPages();
    });
    this.source.onChanged.subscribe((dataChanges) => {
      this.count = this.source.count();
      if (this.isPageOutOfBounce()) {
        this.grid.pagingSource.setPageByUser(--this.pageConf.page);
      }
      if (['prepend', 'append'].includes(dataChanges.action)) {
        this.grid.pagingSource
          .setPageByUser(dataChanges.action === 'prepend' ? 1 : this.getLast());
      }
      this.initPages();
    });
  }

  shouldShow(): boolean {
    if (!this.pageConf || !this.perPageSettings) {return false; }
    return this.source.countAll() > this.pageConf.perPage;
  }

  onChangePerPage() {
    if (this.source && this.pageConf) {
      this.grid.pagingSource.setPaging(1, this.pageConf.perPage as number, true);
    }
  }

  paginate(page: number): boolean {
    if (page === this.pageConf.page) { return false; }
    this.grid.pagingSource.setPageByUser(page);
    this.changePage.emit({ page });
    return true;
  }

  next(): boolean {
    if (this.getPage() === this.getLast()) { return false; }
    return this.paginate(this.getPage() + 1);
  }

  prev(): boolean {
    if (this.getPage() === 1) { return false; }
    return this.paginate(this.getPage() - 1);
  }

  getPage(): number {
    return this.pageConf.page;
  }

  getPages(): Array<any> {
    return this.pages;
  }

  getLast(): number {
    const perPage = this.pageConf.perPage as number;
    return Math.ceil(this.count / perPage);
  }

  isPageOutOfBounce(): boolean {
    const perPage = this.pageConf.perPage as number;
    return (this.pageConf.page * perPage) >= (this.count + perPage) && this.pageConf.page > 1;
  }

  initPages() {
    const pagesCount = this.getLast();
    let showPagesCount = 4;
    showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
    this.pages = [];

    if (this.shouldShow()) {

      let middleOne = Math.ceil(showPagesCount / 2);
      middleOne = this.pageConf.page >= middleOne ? this.pageConf.page : middleOne;

      let lastOne = middleOne + Math.floor(showPagesCount / 2);
      lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

      const firstOne = lastOne - showPagesCount + 1;

      for (let i = firstOne; i <= lastOne; i++) {
        this.pages.push(i);
      }
    }

    this.ref.detectChanges();
  }

  reSetSettings() {
    this.grid.getDataSet().resetSettings();
  }
  reSetFilters() {
    this.grid.source.clearFilter();
  }
  reSetSorts() {
    this.grid.source.clearSort();
  }
}
