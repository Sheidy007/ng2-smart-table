import { Component, ComponentFactoryResolver, ComponentRef, OnChanges, OnDestroy, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { DefaultEditorComponent } from './default-editor.component';

@Component({
  selector: 'cell-custom-editor',
  template: `
		<ng-template #dynamicTarget></ng-template>
  `
})
export class CustomEditComponent extends DefaultEditorComponent implements OnChanges, OnDestroy {

  customComponent: ComponentRef<any>;
  @ViewChild('dynamicTarget', { read: ViewContainerRef, static: true }) dynamicTarget: any;

  constructor(private resolver: ComponentFactoryResolver) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.cell && !this.customComponent) {
      this.createCustomComponent();
      Object.assign(this.customComponent.instance, this.getPatch());
    }
    if (this.customComponent && this.customComponent.instance.ngOnChanges) {
      Object.assign(this.customComponent.instance, this.getPatch());
      this.customComponent.instance.ngOnChanges(changes);
      this.customComponent.changeDetectorRef.markForCheck();
    }
  }

  protected createCustomComponent() {
    const componentFactory = this.resolver.resolveComponentFactory(this.cell.getColumn().editor.component as Type<any>);
    this.customComponent = this.dynamicTarget.createComponent(componentFactory);
  }

  protected getPatch(): DefaultEditorComponent {
    this.cell.getRow().getDataSet().grid.parentRowData.addData(this.rowData);
    return {
      cell: this.cell,
      parentRowData: this.cell.getRow().getDataSet().grid.parentRowData,
      stopEditing: this.stopEditing,
      edited: this.edited,
      editClick: this.editClick
    } as DefaultEditorComponent;
  }

  ngOnDestroy() {
    if (this.customComponent) {
      this.customComponent.destroy();
    }
    super.ngOnDestroy();
  }
}
