import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChange, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Grid, ParentRowData } from './grid-libs/grid';
import { LocalDataSource } from './grid-libs/source/local.data-source';
import { BaseActionClass, ComponentLoader, Settings } from './grid-libs/settings/settings';
import { fromEvent, of, Subject, timer } from 'rxjs';
import { debounceTime, delay, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { SelectedRowsI } from './grid-libs/grid-events';
import { CellTableViewComponent } from './components/tbody/cells/cell/cell-view/cell-table/cell-table-view.component';
import { TableEditorComponent } from './components/tbody/cells/cell/cell-editor/editor-types/table-editor.component';
import { isEqual } from 'lodash';
import { EditSeparateComponent } from './components/actions/separate-actions/edit-separate/edit-separate.component';
import { CreateSeparateComponent } from './components/actions/separate-actions/create-separate/create-separate.component';
import { ShowSeparateComponent } from './components/actions/separate-actions/show-separate/show-separate.component';

@Component({
  selector: 'ng2-smart-table',
  styleUrls: ['./ng2-smart-table.component.scss'],
  templateUrl: './ng2-smart-table.component.html'
})
export class Ng2SmartTableComponent implements OnChanges, AfterViewInit, OnDestroy, DoCheck {

  @Input() parentRowData: ParentRowData;
  @Input() source: LocalDataSource;
  @Input() settings: Settings;
  @Input() componentLoader: ComponentLoader;

  @Output() gridGenerated = new EventEmitter<Grid>();

  @Output() create = new EventEmitter<void>();
  @Output() finishRowCreating = new EventEmitter<any>();
  @Output() selectAndEdit = new EventEmitter<any>();
  @Output() finishRowEdit = new EventEmitter<any>();
  @Output() selectAndView = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @Output() rowHover = new EventEmitter<any>();
  @Output() selectedRows = new EventEmitter<SelectedRowsI>();

  @Output() sort = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();

  @Output() changePage = new EventEmitter<any>();

  @ViewChildren('detailPanel') detailPanel: QueryList<ElementRef>;
  @ViewChildren('dynamicDetailOrQuickViewTarget', { read: ViewContainerRef }) dynamicDetailOrQuickViewTarget: QueryList<ViewContainerRef>;
  @ViewChildren('dynamicModalTarget', { read: ViewContainerRef }) dynamicModalTarget: QueryList<ViewContainerRef>;
  @ViewChild('mainTable', { static: false }) mainTableElementRef: ElementRef;

  private detailPanelElementRef: ElementRef;

  get CountEl() {
    return document.getElementsByTagName('*').length;
  }

  grid: Grid;
  customTop: BaseActionClass[] = [];
  customBottom: BaseActionClass[] = [];
  private destroy = new Subject<void>();

  constructor(private resolver: ComponentFactoryResolver, public cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    if (document.getElementsByClassName('stop-paren-scroll').length) {
      this.freezeScroll();
    } else {
      this.unfreezeScroll();
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (!this.grid) { return; }
    const isSettingsUpdated = changes['settings'] && !isEqual(changes['settings'].previousValue, changes['settings'].currentValue);
    const isComponentLoaderUpdated = changes['componentLoader'] && !isEqual(changes['componentLoader'].previousValue, changes['componentLoader'].currentValue);
    const isSourceUpdated = changes['source'] && !isEqual(changes['source'].previousValue, changes['source'].currentValue);
    if (( isSettingsUpdated || isComponentLoaderUpdated ) && isSourceUpdated) {
      this.settings = this.prepareSettings();
      this.source = this.prepareSource();
      this.prepareComponentLoader();
      this.grid.componentLoader = this.componentLoader;
      this.grid.onUpdateSourceAndSettings(this.source, this.settings);
    } else if (isSettingsUpdated || isComponentLoaderUpdated) {
      this.settings = this.prepareSettings();
      this.prepareComponentLoader();
      this.grid.onUpdateSettings(this.settings);
    } else if (isSourceUpdated) {
      this.source = this.prepareSource();
      this.grid.onUpdateSource(this.source);
    }
  }

  ngAfterViewInit() {
    this.source = this.prepareSource();
    this.settings = this.prepareSettings();
    this.prepareComponentLoader();
    timer(0).pipe(
      takeUntil(this.destroy)).subscribe(() => {
      this.grid = new Grid(this.settings, this.source, this.resolver, this.mainTableElementRef);
      this.grid.componentLoader = this.componentLoader;
      this.customTop = this.grid.settings.actions.custom.filter(action => action.position === 'top');
      this.customBottom = this.grid.settings.actions.custom.filter(action => action.position === 'bottom');
      this.grid.parentRowData = new ParentRowData(this.parentRowData);
      this.grid.tableCdr = this.cdr;
      this.grid.gridActionsFunctions.tableComponent = CellTableViewComponent;
      this.grid.gridActionsFunctions.tableEditComponent = TableEditorComponent;

      this.source.connectGrid(this.settings.settingsName, this.grid);
      this.gridGenerated.emit(this.grid);

      this.grid.gridEvents.rowHover.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.rowHover.next(row));
      this.grid.gridEvents.selectedRows.pipe(takeUntil(this.destroy))
        .subscribe(data => this.selectedRows.next(data));

      this.grid.gridEvents.filter.pipe(takeUntil(this.destroy))
        .subscribe(() => this.filter.emit());
      this.grid.gridEvents.sort.pipe(takeUntil(this.destroy))
        .subscribe(() => this.sort.emit());

      this.grid.gridEvents.create.pipe(takeUntil(this.destroy))
        .subscribe(() => this.create.next());
      this.grid.gridEvents.finishRowCreating.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.finishRowCreating.next(row));
      this.grid.gridEvents.selectAndEdit.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.selectAndEdit.emit(row));
      this.grid.gridEvents.finishRowEdit.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.finishRowEdit.emit(row));
      this.grid.gridEvents.selectAndView.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.selectAndView.emit(row));
      this.grid.gridEvents.delete.pipe(takeUntil(this.destroy))
        .subscribe((row) => this.delete.emit(row));

      this.dynamicModalTarget.changes.pipe(
        takeUntil(this.destroy),
        delay(0))
        .subscribe((data) => {
          const actionShowDetailsEl = ( data.toArray() as ViewContainerRef[] )[0];
          if (actionShowDetailsEl) {
            this.grid.gridActionsFunctions.dynamicModalTarget = actionShowDetailsEl;
          }
        });
      this.dynamicDetailOrQuickViewTarget.changes.pipe(
        takeUntil(this.destroy),
        delay(0))
        .subscribe((data) => {
          const actionShowDetailsEl = ( data.toArray() as ViewContainerRef[] )[0];
          if (actionShowDetailsEl) {
            this.grid.gridActionsFunctions.dynamicDetailOrQuickViewTarget = actionShowDetailsEl;
          }
        });
      this.detailPanel.changes.pipe(
        takeUntil(this.destroy),
        delay(0))
        .subscribe((data) => {
          const actionShowDetailsEl = data.toArray()[0];
          if (actionShowDetailsEl) {
            this.detailPanelElementRef = actionShowDetailsEl;
          }
        });
      this.cdr.detectChanges();
    });
  }

  private prepareSource(): LocalDataSource {
    if (this.source instanceof LocalDataSource) {
      return this.source;
    } else if (this.source['length']) {
      return new LocalDataSource(this.source);
    }
    return new LocalDataSource();
  }

  private prepareSettings(): Settings {
    if (this.settings instanceof Settings) {
      return this.settings;
    } else if (this.settings) {
      return new Settings(this.settings);
    }
    return new Settings();
  }

  private prepareComponentLoader() {
    if (this.settings.actions.add) {
      this.settings.actions.add.customComponent = CreateSeparateComponent;
    }
    if (this.settings.actions.edit) {
      this.settings.actions.edit.customComponent = EditSeparateComponent;
    }
    if (this.settings.actions.show) {
      this.settings.actions.show.customComponent = ShowSeparateComponent;
    }
    if (this.componentLoader) {
      if (this.settings.actions.add && this.settings.actions.add.customComponent && typeof this.settings.actions.add.customComponent === 'string') {
        this.settings.actions.add.customComponent = this.componentLoader[this.settings.actions.add.customComponent as string];
      }
      if (this.settings.actions.edit && this.settings.actions.edit.customComponent && typeof this.settings.actions.edit.customComponent === 'string') {
        this.settings.actions.edit.customComponent = this.componentLoader[this.settings.actions.edit.customComponent as string];
      }
      if (this.settings.actions.show && this.settings.actions.show.customComponent && typeof this.settings.actions.show.customComponent === 'string') {
        this.settings.actions.show.customComponent = this.componentLoader[this.settings.actions.show.customComponent as string];
      }
      this.settings.actions.custom.forEach(action => {
        if (action.customComponent && typeof action.customComponent === 'string') {
          action.customComponent = this.componentLoader[action.customComponent as string];
        }
      });
      Object.keys(this.settings.columns).forEach(key => {
        if (this.settings.columns[key].renderComponent && typeof this.settings.columns[key].renderComponent === 'string') {
          this.settings.columns[key].renderComponent = this.componentLoader[this.settings.columns[key].renderComponent as string];
        }
        if (this.settings.columns[key].filter && typeof this.settings.columns[key].filter.component === 'string') {
          this.settings.columns[key].filter.component = this.componentLoader[this.settings.columns[key].filter.component as string];
        }
        if (this.settings.columns[key].editor && typeof this.settings.columns[key].editor.component === 'string') {
          this.settings.columns[key].editor.component = this.componentLoader[this.settings.columns[key].editor.component as string];
        }
      });
    }
  }

  resizeTable(value) {
    this.grid.gridActionsFunctions.tableWithDetailWidthPc = ( 100 / ( 100 - ( this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.detailsWidth : this.settings.quickViewWidth ) ) ) * value;
    this.grid.resetScroll();
    this.grid.saveSettingsToLocalStorage();
  }

  resizeCardWidth(event: MouseEvent) {
    this.grid.gridActionsFunctions.resizingCardWidth = true;
    let startPosX = event.screenX;
    const oldWidth = this.detailPanelElementRef.nativeElement.clientWidth;
    const oldPercent = this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.detailsWidth : this.settings.quickViewWidth;
    fromEvent(window, 'mousemove')
      .pipe(switchMap((e: MouseEvent) => {
        if (!this.grid.gridActionsFunctions.resizingCardWidth) {
          this.grid.gridActionsFunctions.resizingCardWidth = true;
        }
        return of(e);
      }), debounceTime(10), finalize(() => {
        this.grid.gridActionsFunctions.resizingCardWidth = false;
        this.grid.resetScroll();
      }), takeUntil(fromEvent(window, 'mouseup')), takeUntil(this.destroy))
      .subscribe((e: MouseEvent) => {
        if (!this.grid.gridActionsFunctions.resizingCardWidth) {
          startPosX = e.screenX;
        }

        const newWidth = oldWidth + ( startPosX - e.screenX );
        let newWidthPercent = ( !oldPercent ? 1 : oldPercent ) * newWidth / ( !oldWidth ? 1 : oldWidth );

        if (newWidthPercent < ( this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.minDetailsWidth : this.settings.minQuickViewWidth )) {
          newWidthPercent = this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.minDetailsWidth : this.settings.minQuickViewWidth;
        }
        if (newWidthPercent > ( this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.maxDetailsWidth : this.settings.maxQuickViewWidth )) {
          newWidthPercent = this.grid.gridActionsFunctions.lastIsDetailView ? this.settings.maxDetailsWidth : this.settings.maxQuickViewWidth;
        }
        if (this.grid.gridActionsFunctions.lastIsDetailView) {
          this.settings.detailsWidth = newWidthPercent;
        } else {
          this.settings.quickViewWidth = newWidthPercent;
        }
        this.grid.gridActionsFunctions.tableWithDetailWidthPc = ( 100 / ( 100 - newWidthPercent ) ) * this.settings.innerTableWidthPc;

        this.grid.resetScroll();
        this.grid.saveSettingsToLocalStorage();
      });
  }

  freezeScroll() {
    const top = window.scrollY;
    document.body.style.overflow = 'hidden';
    window.onscroll = () => {
      window.scroll(0, top);
    };
  }

  unfreezeScroll() {
    document.body.style.overflow = '';
    window.onscroll = null;
  }

  ngOnDestroy(): void {
    this.grid?.gridActionsFunctions.destroyAllComponentOfViewType();
    this.cdr.detach();
    this.destroy.next();
    this.destroy.complete();
  }
}
