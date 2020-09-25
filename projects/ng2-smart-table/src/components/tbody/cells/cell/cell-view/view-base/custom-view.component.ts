import { Component, ComponentFactoryResolver, ComponentRef, OnChanges, OnDestroy, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DefaultViewCellComponent } from './default-view-cell.component';

@Component({
  selector: 'custom-view-component',
  template: `
		<ng-template #dynamicTarget></ng-template>
  `
})
export class CustomViewComponent extends DefaultViewCellComponent implements OnChanges, OnDestroy {

  customComponent: ComponentRef<any>;
  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.customComponent && this.cell) {
      this.createCustomComponent();
      this.callOnComponentInit();
      Object.assign(this.customComponent.instance, this.getPatch());
    }
    if (this.customComponent && this.customComponent.instance.ngOnChanges) {
      Object.assign(this.customComponent.instance, this.getPatch());
      this.customComponent.instance.ngOnChanges(changes);
      this.customComponent.changeDetectorRef.markForCheck();
    }
  }

  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(this.cell.getColumn().renderComponent as Type<any>);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected callOnComponentInit() {
    const onComponentInitFunction = this.cell.getColumn().columnFunctions.getOnComponentInitFunction();
    if (onComponentInitFunction) {
      onComponentInitFunction(this.customComponent.instance);
    }
  }

  protected getPatch(): DefaultViewCellComponent {
    this.cell.getRow().getDataSet().grid.parentRowData.addData(this.rowData);
    return {
      value: this.value,
      rowData: this.rowData,
      cell: this.cell,
      parentRowData: this.cell.getRow().getDataSet().grid.parentRowData
    } as DefaultViewCellComponent;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    super.ngOnDestroy();
  }

}
