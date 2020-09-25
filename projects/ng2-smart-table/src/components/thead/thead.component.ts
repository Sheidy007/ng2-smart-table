import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Grid } from '../../grid-libs/grid';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: '[ngx-rt-thead]',
  templateUrl: './thead.component.html'
})
export class Ng2SmartTableTheadComponent implements AfterViewInit {

  @Input() grid: Grid;
  @ViewChild('mainTableHead', { static: false }) mainTableHead: ElementRef;

  headHeight = new BehaviorSubject<string>('0px');

  ngAfterViewInit() {
    this.grid.pagingSource.mainTableHead = this.mainTableHead.nativeElement as HTMLElement;
  }

  resize(event) {
    this.headHeight.next(event.height + 'px');
    this.grid.tableCdr.detectChanges();
  }
}

