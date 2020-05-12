import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { FilterDefault } from './filter-default';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'custom-table-filter',
  template: `
		<ng-template #dynamicTarget></ng-template>`
})
export class CustomFilterComponent extends FilterDefault implements OnChanges, OnDestroy {
  @Input() query: string;
  customComponent: any;
  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;
  private destroy = new Subject<void>();

  constructor(private resolver: ComponentFactoryResolver) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.column && !this.customComponent) {
      const componentFactory = this.resolver.resolveComponentFactory(this.column.filter.component);
      this.customComponent = this.dynamicTarget.createComponent(componentFactory);
      this.customComponent.instance.query = this.query;
      this.customComponent.instance.column = this.column;
      this.customComponent.instance.source = this.source;
      this.customComponent.instance.inputClass = this.inputClass;
      this.customComponent.instance.filter.pipe(takeUntil(this.destroy))
        .subscribe((event: any) => this.onFilter(event));
    }
    if (this.customComponent) {
      this.customComponent.instance.ngOnChanges(changes);
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    if (this.customComponent) {
      this.customComponent.destroy();
    }
  }
}
