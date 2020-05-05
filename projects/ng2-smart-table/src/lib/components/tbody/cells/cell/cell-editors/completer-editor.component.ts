import { Component, OnInit } from '@angular/core';
import { CompleterService } from '@akveo/ng2-completer';

import { DefaultEditor } from './default-editor';
import { CompleterData } from '@akveo/ng2-completer/src/services/completer-data';

@Component({
  selector: 'completer-editor',
  template: `
		<ng2-completer [(ngModel)]="this.cell.newValue "
		               [dataService]="dataService"
		               [minSearchLength]="minSearchLength"
		               [pause]="debounce"
		               [placeholder]="config.placeholder || 'Start typing...'"
		>
		</ng2-completer>
  `
})
export class CompleterEditorComponent extends DefaultEditor implements OnInit {

  config: any;
  debounce = 200;
  minSearchLength = 1;
  dataService: CompleterData;
  constructor(private completerService: CompleterService) {
    super();
  }

  ngOnInit() {
    if (this.cell.getColumn().editor && this.cell.getColumn().editor.type === 'completer') {
      this.config = this.cell.getColumn().getConfig().completer;
      const uniqData = this.config.data
        .map(d => {
          const result = {};
          result[this.config.searchFields] = d[this.config.searchFields];
          return result;
        }).filter((v, i, a) => {
          return a
            .findIndex(ap => ap[this.config.searchFields]
              === v[this.config.searchFields]) === i;
        });
      this.config.dataService = this.completerService
        .local(uniqData, this.config.searchFields, this.config.titleField);
      this.config.dataService.descriptionField(this.config.descriptionField);
      this.dataService = this.config.dataService;
      this.minSearchLength = this.config.minSearchLength as number || this.minSearchLength;
      this.debounce = this.config.pause as number || this.debounce;
    }
  }
}
