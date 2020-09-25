import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PagingClass } from '../../grid-libs/source/data-source';
import { Grid } from '../../grid-libs/grid';
import { LocalDataSource } from '../../grid-libs/source/local.data-source';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: '[ngx-rt-pager]',
  styleUrls: ['./pager.component.scss'],
  template: `
			<nav *ngIf="shouldShow()"
			     class="ng2-smart-pagination-nav">
				<ul class="ng2-smart-pagination pagination">
					<li class="ng2-smart-page-item page-item"
					    [ngClass]="{disabled: getPage() === 1}">
						<button (click)="prev()"
						        [disabled]="getPage() === 1"
						        aria-label="Prev"
						        class="ng2-smart-page-link page-link page-link-prev">
							&lt;
						</button>
					</li>
					<li *ngIf="getPages()[0] !== 1"
					    class="ng2-smart-page-item page-item">
						<button (click)="paginate(1)"
						        aria-label="First"
						        class="ng2-smart-page-link page-link">
							1
						</button>
					</li>
					<li *ngFor="let page of getPages()"
					    [ngClass]="{active: getPage() === page}"
					    class="ng2-smart-page-item page-item">
          <span *ngIf="getPage() === page"
                class="ng2-smart-page-link page-link">
            {{ page }}
          </span>
						<button (click)="paginate(page)" *ngIf="getPage() !== page"
						        class="ng2-smart-page-link page-link">
							{{ page }}
						</button>
					</li>
					<li class="ng2-smart-page-item page-item"
					    *ngIf="getPages()[getPages().length-1] !== getLast()">
						<button class="ng2-smart-page-link page-link"
						        (click)="paginate(getLast())" aria-label="Last">
							{{this.getLast()}}
						</button>
					</li>
					<li class="ng2-smart-page-item page-item"
					    [ngClass]="{disabled: getPage() === getLast()}">
						<button (click)="next()"
						        [disabled]="getPage() === getLast()"
						        aria-label="Next"
						        class="ng2-smart-page-link page-link page-link-next">
							&gt;
						</button>
					</li>
				</ul>
			</nav>
  `
})
export class PagerComponent implements OnInit {
  @Input() source: LocalDataSource;
  @Input() grid: Grid;

  @Output() changePage = new EventEmitter<any>();

  pageConf: PagingClass;
  protected pages: number[];

  private destroy = new Subject<void>();

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.pageConf = this.grid.pagingSource.getPaging();
    this.grid.pagingSource.onChanged.pipe(takeUntil(this.destroy)).subscribe((info) => {
      this.initPages();
    });
    this.source.onChanged.pipe(takeUntil(this.destroy)).subscribe((dataChanges) => {
      if (this.isPageOutOfBounce()) {
        this.grid.pagingSource.setPageByUser(--this.pageConf.page);
      }
      if (['prepend', 'append'].includes(dataChanges.action)) {
        this.grid.pagingSource.setPageByUser(dataChanges.action === 'prepend' ? 1 : this.getLast());
      }
      this.initPages();
    });
  }

  paginate(page: number): boolean {
    if (page === this.pageConf.page) { return false; }
    this.grid.pagingSource.setPageByUser(page);
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
    return this.pages ? this.pages : [];
  }

  getLast(): number {
    const perPage = this.pageConf.perPage as number;
    return Math.ceil(this.source.count() / perPage);
  }

  isPageOutOfBounce(): boolean {
    const perPage = this.pageConf.perPage as number;
    return (this.pageConf.page * perPage) >= (this.source.count() + perPage) && this.pageConf.page > 1;
  }

  initPages() {
    const pagesCount = this.getLast();
    let showPagesCount = 4;
    showPagesCount = pagesCount < showPagesCount ? pagesCount : showPagesCount;
    this.pages = [];

    if (this.shouldShow()) {

      let middleOne = Math.ceil(showPagesCount / 2);
      middleOne = this.pageConf.page >= middleOne ? this.pageConf.page : middleOne;

      let lastOne = middleOne + Math.round(showPagesCount / 2);
      lastOne = lastOne >= pagesCount ? pagesCount : lastOne;

      const firstOne = lastOne - showPagesCount + 1;

      for (let i = firstOne; i <= lastOne; i++) {
        this.pages.push(i);
      }
    }

    this.ref.detectChanges();
  }

  shouldShow(): boolean {
    if (!this.grid.pagingSource.getPaging()) { return false; }
    return this.grid.source.countAll() > this.grid.pagingSource.getPaging().perPage;
  }
}
