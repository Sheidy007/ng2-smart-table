import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Grid } from '../../../../grid-libs/grid';
import { Row } from '../../../../grid-libs/data-set/row/row';
import { BaseActionClass } from '../../../../grid-libs/settings/settings';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ng2-smart-row-custom-separate',
  styleUrls: ['./custom-separate.component.scss', '../../../../ng2-smart-table.component.scss'],
  templateUrl: './custom-separate.component.html'
})
export class CustomSeparateComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() row: Row;
  @Input() grid: Grid;
  @Input() type: 'inline' | 'expandRow' | 'quickView' | 'details' | 'modal';
  @Input() resultOfPreInit: any;

  @Input() action: BaseActionClass;
  @Input() inputCustomComponent: Type<any>;
  inputCustomComponentRef: ComponentRef<any>;
  private destroy = new Subject<void>();

  @ViewChild('dynamicInnerComponent', { read: ViewContainerRef }) dynamicInnerComponent: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver, public element: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const componentFactory = this.resolver.resolveComponentFactory(this.inputCustomComponent);
    this.inputCustomComponentRef = this.dynamicInnerComponent.createComponent(componentFactory);
    this.action.preInitResultData = this.resultOfPreInit;
    Object.assign(this.inputCustomComponentRef.instance,
      {
        row: this.row.getData(),
        grid: this.grid,
        type: this.type,
        action: this.action
      });
    this.inputCustomComponentRef.changeDetectorRef.markForCheck();
    this.cdr.detectChanges();

    switch (this.type) {
      case 'details':
      case 'quickView': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastQuickViewComponent);
        break;
      }
      case 'expandRow': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastExpandRowComponent);
        break;
      }
      case 'modal': {
        this.checkIsThisComponentOpenLast(this.grid.gridActionsFunctions.checkCurrentIsLastModalComponent);
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.inputCustomComponentRef?.instance.ngOnChanges) {
      Object.assign(this.inputCustomComponentRef.instance,
        {
          row: this.row.getData(),
          grid: this.grid,
          type: this.type,
          action: this.action
        });
      this.inputCustomComponentRef.instance.ngOnChanges(changes);
      this.inputCustomComponentRef.changeDetectorRef.markForCheck();
      this.cdr.detectChanges();
    }
  }

  checkIsThisComponentOpenLast(subj: BehaviorSubject<ComponentRef<any>>) {
    subj.pipe(takeUntil(this.destroy))
      .subscribe((component) => {
        if (this as any !== component.instance) {
          ( this.element.nativeElement as HTMLElement ).style.display = 'none';
        } else {
          ( this.element.nativeElement as HTMLElement ).style.display = 'block';
        }
      });
  }

  ngOnDestroy() {
    this.cdr.detach();
    if (this.inputCustomComponentRef) {
      this.inputCustomComponentRef.destroy();
    }
    this.grid.gridActionsFunctions.closeCustomAction(this.action);
    this.grid.gridActionsFunctions.onAction.next();
    this.destroy.next();
  }
}
