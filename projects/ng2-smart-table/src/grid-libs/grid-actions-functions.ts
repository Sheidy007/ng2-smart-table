import { ActionResultClass, BaseActionClass, Grid, Row } from 'ng2-smart-table';
import { Deferred } from './sys/helpers';
import { ComponentRef, Type, ViewContainerRef } from '@angular/core';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

export class GridActionsFunctions {

  tableWithDetailWidthPc ? = 100;

  dynamicDetailOrQuickViewTarget: ViewContainerRef;
  generateDetailOrQuickViewComponent: ComponentRef<any>[] = [];
  checkCurrentIsLastQuickViewComponent: BehaviorSubject<ComponentRef<any>> = new BehaviorSubject<ComponentRef<any>>(null);

  dynamicExpandRowTarget: ViewContainerRef;
  generateExpandRowComponent: ComponentRef<any>[] = [];
  checkCurrentIsLastExpandRowComponent: BehaviorSubject<ComponentRef<any>> = new BehaviorSubject<ComponentRef<any>>(null);

  dynamicModalTarget: ViewContainerRef;
  generateModalComponent: ComponentRef<any>[] = [];
  checkCurrentIsLastModalComponent: BehaviorSubject<ComponentRef<any>> = new BehaviorSubject<ComponentRef<any>>(null);

  lastIsDetailView = false;
  resizingCardHeight = false;
  resizingCardWidth = false;

  actionInProcess: Subject<boolean> = new Subject<boolean>();
  onAction: Subject<void> = new Subject<void>();
  emitAction: Subject<{ actionId: string, data: any }> = new Subject<{ actionId: string, data: any }>();

  tableComponent: Type<any>;
  tableEditComponent: Type<any>;

  constructor(private grid: Grid) { }

  private showFunction(row: Row) {
    this.grid.settings.actions.show.data = row.getData();
    if (!this.grid.showMultiSelectColumn()) {
      this.grid.reverseRowSelectedFlag(row);
    }
  }

  showMakeAction(row: Row) {
    if (row.getData() !== this.grid.settings.actions.show.data) {
      if (this.grid.settings.actions.show.viewType !== 'inline') {
        this.openRowActionOnViewType(row, this.grid.settings.actions.show, () => this.showFunction(row)
          , this.grid.settings.actions.show.positionAsOverAction === 'none');
      } else {
        this.showFunction(row);
      }
      this.grid.gridEvents.selectAndView.next(row.getData());
    } else {
      this.hideMakeAction();
    }
  }

  hideMakeAction() {
    this.grid.settings.actions.show.data = null;
    this.destroyLastComponentOfViewType(this.grid.settings.actions.show.viewType);
    this.grid.gridEvents.selectAndView.next(null);
  }

  private createFunction() {
    this.grid.settings.actions.add.data = this.grid.getNewRow().getData();
  }

  createMakeAction() {
    this.grid.dataSet.createNewRow();
    if (this.grid.settings.actions.add.viewType !== 'inline') {
      this.openRowActionOnViewType(this.grid.getNewRow(), this.grid.settings.actions.add, () => this.createFunction()
        , this.grid.settings.actions.add.positionAsOverAction === 'none');
    } else {
      this.createFunction();
    }
    this.grid.gridEvents.create.next(this.grid.getNewRow().getData());
  }

  cancelCreate() {
    this.grid.settings.actions.add.data = null;
    this.grid.gridEvents.finishRowCreating.next(null);
  }

  applyCreate(row: Row) {
    this.actionInProcess.next(true);
    const deferred = new Deferred();
    deferred.promise.then(() => {
      this.grid.source.prepend(row.saveNewDataAndReturn()).then(() => {
        this.grid.settings.actions.add.data = null;
        this.destroyLastComponentOfViewType(this.grid.settings.actions.add.viewType);
      });
    }).catch(() => console.error('Create Error'))
      .finally(() => this.actionInProcess.next(false));

    if (this.grid.settings.actions.add.confirm) {
      this.grid.settings.actions.add.confirm.emit({
        newRowData: row.getNewData(),
        confirm: deferred,
        grid: this.grid,
        action: this.grid.settings.actions.add
      } as ActionResultClass);
    } else {
      this.grid.gridEvents.finishRowCreating.next(row.getNewData());
      deferred.resolve();
    }
  }

  private editFunction(row: Row) {
    this.grid.settings.actions.edit.data = row.getData();
    if (!this.grid.showMultiSelectColumn()) {
      this.grid.reverseRowSelectedFlag(row);
    }
  }

  editMakeAction(row: Row) {
    row.resetNewDataAndReturn();
    if (this.grid.settings.actions.edit.viewType !== 'inline') {
      this.openRowActionOnViewType(row, this.grid.settings.actions.edit, () => this.editFunction(row)
        , this.grid.settings.actions.edit.positionAsOverAction === 'none');
    } else {
      this.editFunction(row);
    }
    this.grid.gridEvents.selectAndEdit.next(row.getData());
  }

  cancelEdit(row: Row) {
    row.resetNewDataAndReturn();
    this.grid.settings.actions.edit.data = null;
    this.grid.gridEvents.finishRowEdit.next(row.getData());
  }

  applyEdit(row: Row) {
    this.actionInProcess.next(true);
    const deferred = new Deferred();
    deferred.promise.then(() => {
      this.grid.source.update(row.getData(), row.saveNewDataAndReturn()).then(() => {
        this.grid.settings.actions.edit.data = null;
        this.destroyLastComponentOfViewType(this.grid.settings.actions.edit.viewType);
      });
    }).catch(() => console.error('Edit Error'))
      .finally(() => this.actionInProcess.next(false));

    if (this.grid.settings.actions.edit.confirm) {
      this.grid.settings.actions.edit.confirm.emit({
        rowData: row.getData(),
        newRowData: row.getNewData(),
        confirm: deferred,
        grid: this.grid,
        action: this.grid.settings.actions.edit
      } as ActionResultClass);
    } else {
      this.grid.gridEvents.finishRowEdit.next(row.getNewData());
      deferred.resolve();
    }
  }

  private customActionFunction(row: Row, action: BaseActionClass, resultComponentRef?: ComponentRef<any>) {
    action.data = row.getData();
    if (!this.grid.showMultiSelectColumn()) {
      this.grid.reverseRowSelectedFlag(row);
    }
    if (resultComponentRef) {
      resultComponentRef.instance.inputCustomComponent = action.customComponent;
    }
  }

  customActionMakeAction(row: Row, action: BaseActionClass, customComponent: Type<any>) {
    this.grid.settings.actions.custom.filter(a => a.viewType === action.viewType).forEach((act) => {
      act.data = null;
    });
    if (action.customComponent && action.viewType !== 'inline') {
      this.openRowActionOnViewType(row, action, (resultComponentRef) =>
        this.customActionFunction(row, action, resultComponentRef), action.positionAsOverAction === 'none', customComponent);
    } else {
      if (action.innerActions) {
        this.customActionFunction(row, action, null);
      } else {
        this.customActionAddedContentMakeAction(row, action, '', true);
      }
    }
    if (action.actionEvent) {
      action.actionEvent.next({
        action,
        rowData: row.getData(),
        grid: this.grid
      } as ActionResultClass);
    }
  }

  closeCustomAction(action: BaseActionClass) {
    action.data = null;
    if (action.actionEvent) {
      action.actionEvent.next({
        action: action.title,
        grid: this.grid
      } as ActionResultClass);
    }
  }

  customActionAddedContentMakeAction(row: Row, action: BaseActionClass, innerActionId: string, closeAfterAction: boolean) {
    this.actionInProcess.next(true);
    const deferred = new Deferred();
    deferred.promise.then(() => {
        if (closeAfterAction) {
          action.data = null;
          this.destroyLastComponentOfViewType(action.viewType);
        }
      })
      .catch(() => console.error(action.id + ' ' + innerActionId + ' Error'))
      .finally(() => this.actionInProcess.next(false));

    if (action.confirm) {
      action.confirm.emit({
        action,
        innerActionId,
        rowData: row.getData(),
        confirm: deferred,
        grid: this.grid
      } as ActionResultClass);
    } else {
      if (action.actionEvent) {
        action.actionEvent.next({
          action,
          innerActionId,
          rowData: row.getData(),
          grid: this.grid
        } as ActionResultClass);
      }
      deferred.resolve();
    }
  }

  openRowActionOnViewType(row: Row, action: BaseActionClass, afterCall: (resultComponentRef) => void, replace = true, customComponent?: Type<any>) {
    if (['details', 'quickView'].includes(action.viewType)) {
      this.lastIsDetailView = action.viewType === 'details';
      this.tableWithDetailWidthPc = ( 100 /
        ( 100 - ( this.lastIsDetailView ? this.grid.settings.detailsWidth : this.grid.settings.quickViewWidth ) ) ) * this.grid.settings.innerTableWidthPc;
    }

    const inputData = { row, action, grid: this.grid, type: action.viewType };
    const targetComponent = ['details', 'quickView'].includes(action.viewType) ? this.dynamicDetailOrQuickViewTarget :
      action.viewType === 'expandRow' ? this.dynamicExpandRowTarget : this.dynamicModalTarget;
    const generateComponent = ['details', 'quickView'].includes(action.viewType) ? this.generateDetailOrQuickViewComponent :
      action.viewType === 'expandRow' ? this.generateExpandRowComponent : this.generateModalComponent;
    customComponent = ( customComponent ? customComponent : action.customComponent ) as Type<any>;

    if (row) {
      this.actionInProcess.next(true);
      this.generateViewTypeActionComponent(
        targetComponent,
        generateComponent,
        customComponent,
        inputData,
        action.onComponentInitObservable,
        replace)
        .pipe(takeUntil(this.grid.destroy), finalize(() => this.actionInProcess.next(false)))
        .subscribe((result: ComponentRef<any>) => {
          afterCall(result);
          switch (action.viewType) {
            case 'details':
            case 'quickView': {
              this.generateDetailOrQuickViewComponent.push(result);
              this.checkCurrentIsLastQuickViewComponent.next(result);
              break;
            }
            case 'expandRow': {
              this.generateExpandRowComponent.push(result);
              this.checkCurrentIsLastExpandRowComponent.next(result);
              break;
            }
            case 'modal': {
              this.generateModalComponent.push(result);
              this.checkCurrentIsLastModalComponent.next(result);
              break;
            }
          }
        });
    } else {
      this.destroyLastComponentOfViewType(action.viewType);
    }
  }

  generateViewTypeActionComponent(target: ViewContainerRef, generatedComponent: ComponentRef<any>[], customComponent: Type<any>, object: any,
                                  preInit: (...attr) => Observable<any>, replace: boolean): Observable<ComponentRef<any>> {
    return ( preInit ? preInit(object.row.data) : of({}) ).pipe(takeUntil(this.grid.destroy), map((resultOfPreInit) => {
      if (replace && generatedComponent?.length) {
        generatedComponent.forEach(c => c.destroy());
        while (generatedComponent.pop()) {}
      }
      ( object.row as Row ).initCells();
      if (resultOfPreInit) {
        object.resultOfPreInit = resultOfPreInit;
      }
      const componentFactory = this.grid.resolver.resolveComponentFactory(customComponent);
      const newGeneratedComponent = target.createComponent(componentFactory);
      Object.assign(newGeneratedComponent.instance, object);
      return newGeneratedComponent;
    }));
  }

  destroyLastComponentOfViewType(viewType: 'inline' | 'expandRow' | 'quickView' | 'details' | 'modal') {
    switch (viewType) {
      case 'details':
      case 'quickView': {
        if (this.generateDetailOrQuickViewComponent?.length) {
          this.generateDetailOrQuickViewComponent[this.generateDetailOrQuickViewComponent.length - 1].destroy();
          this.generateDetailOrQuickViewComponent.pop();
          if (this.generateDetailOrQuickViewComponent?.length) {
            this.checkCurrentIsLastQuickViewComponent
              .next(this.generateDetailOrQuickViewComponent[this.generateDetailOrQuickViewComponent.length - 1]);
          }
        }
        break;
      }
      case 'expandRow': {
        if (this.generateExpandRowComponent?.length) {
          this.generateExpandRowComponent[this.generateExpandRowComponent.length - 1].destroy();
          this.generateExpandRowComponent.pop();
          if (this.generateExpandRowComponent?.length) {
            this.checkCurrentIsLastExpandRowComponent
              .next(this.generateExpandRowComponent[this.generateExpandRowComponent.length - 1]);
          }
        }
        break;
      }
      case 'modal': {
        if (this.generateModalComponent?.length) {
          this.generateModalComponent[this.generateModalComponent.length - 1].destroy();
          this.generateModalComponent.pop();
          if (this.generateModalComponent?.length) {
            this.checkCurrentIsLastModalComponent
              .next(this.generateModalComponent[this.generateModalComponent.length - 1]);
          }
        }
      }
    }
  }

  destroyAllComponentOfViewType() {
    if (this.generateDetailOrQuickViewComponent?.length) {
      this.generateDetailOrQuickViewComponent.forEach(g => g.destroy());
    }
    this.generateDetailOrQuickViewComponent = [];
    if (this.generateExpandRowComponent?.length) {
      this.generateExpandRowComponent.forEach(g => g.destroy());
    }
    this.generateExpandRowComponent = [];
    if (this.generateModalComponent?.length) {
      this.generateModalComponent.forEach(g => g.destroy());
    }
    this.generateModalComponent = [];
  }

  delete(row: Row) {
    this.actionInProcess.next(true);
    const deferred = new Deferred();
    deferred.promise.then(() => {
      if (this.grid.settings.actions.add && this.grid.settings.actions.add.data === row.getData()) {
        this.grid.settings.actions.add.data = null;
      }
      if (this.grid.settings.actions.edit && this.grid.settings.actions.edit.data === row.getData()) {
        this.grid.settings.actions.edit.data = null;
      }
      if (this.grid.settings.actions.show && this.grid.settings.actions.show.data === row.getData()) {
        this.grid.settings.actions.show.data = null;
      }
      this.grid.settings.actions.custom.forEach(action => {
        if (action.data === row.getData()) {
          action.data = null;
        }
      });

      this.grid.source.remove(row.getData()).then();
    }).catch(() => console.error('Delete Error'))
      .finally(() => this.actionInProcess.next(false));

    if (this.grid.settings.actions.delete.confirm) {
      this.grid.settings.actions.delete.confirm.emit({
        rowData: row.getData(),
        confirm: deferred,
        grid: this.grid,
        action: this.grid.settings.actions.delete
      } as ActionResultClass);
    } else {
      this.grid.gridEvents.delete.next(row.getData());
      deferred.resolve();
    }
  }

  callDblClick(row: Row) {
    this.grid.cellMinHtml = '';
    if (this.grid.settings.actions.show && this.grid.settings.actions.show.dblclickOnRow) {
      this.showMakeAction(row);
      this.onAction.next();
    }
  }
}
