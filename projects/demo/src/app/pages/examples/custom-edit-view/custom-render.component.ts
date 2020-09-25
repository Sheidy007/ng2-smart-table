import { Component, Input, OnInit } from '@angular/core';

import { Grid, DefaultViewCellComponent } from 'ng2-smart-table';

@Component({
  template: `
		{{renderValue}}
  `
})
export class CustomRenderComponent extends DefaultViewCellComponent implements OnInit {

  renderValue: string;
  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

}
