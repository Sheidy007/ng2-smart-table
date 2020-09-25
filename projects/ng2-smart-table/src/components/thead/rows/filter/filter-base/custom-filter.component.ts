import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnChanges, OnDestroy, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DefaultFilterComponent } from './default-filter.component';

@Component({
  selector: 'custom-table-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
		<ng-template #dynamicTarget></ng-template>`
})
export class CustomFilterComponent extends DefaultFilterComponent implements OnChanges, OnDestroy {
  customComponent: ComponentRef<any>;

  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.column && !this.customComponent) {
      this.createCustomComponent();
      Object.assign(this.customComponent.instance, this.getPatch());
    }
    if (this.customComponent && this.customComponent.instance.ngOnChanges) {
      Object.assign(this.customComponent.instance, this.getPatch());
      this.customComponent.instance.ngOnChanges(changes);
      this.customComponent.changeDetectorRef.markForCheck();
      this.cdr.detectChanges();
    }
  }

  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(this.column.filter.component as Type<any>);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected getPatch(): DefaultFilterComponent {
    return {
      query: this.query,
      column: this.column,
      filter: this.filter,
      grid: this.grid
    } as DefaultFilterComponent;
  }

  ngOnDestroy() {
    this.cdr.detach();
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    super.ngOnDestroy();
  }
}
