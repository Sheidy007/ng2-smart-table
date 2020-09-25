import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DefaultEditorComponent } from 'ng2-smart-table';

@Component({
  template: `
	  Name: <input #name
	               class="short-input"
	               [name]="cell.getId()"
	               [disabled]="!cell.isEditable()"
	               [placeholder]="cell.getTitle()"
	               (click)="editClick.emit($event)"
	               (keyup)="updateValue()"
	               (keydown.enter)="edited.emit($event)"
	               (keydown.esc)="stopEditing.emit()"><br>
	  Url: <input #url
	              class="short-input"
	              [name]="cell.getId()"
	              [disabled]="!cell.isEditable()"
	              [placeholder]="cell.getTitle()"
	              (click)="editClick.emit($event)"
	              (keyup)="updateValue()"
	              (keydown.enter)="edited.emit($event)"
	              (keydown.esc)="stopEditing.emit()">
	  <div [hidden]="true" [innerHTML]="cell.cellValue.computedValue | async | sanitizeHtml" #htmlValue></div>
  `,
})
export class CustomEditorComponent extends DefaultEditorComponent implements AfterViewInit {

  @ViewChild('name') name: ElementRef;
  @ViewChild('url') url: ElementRef;
  @ViewChild('htmlValue') htmlValue: ElementRef;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.cell.cellValue.editedValue !== '') {
      this.name.nativeElement.value = this.getUrlName();
      this.url.nativeElement.value = this.getUrlHref();
    }
  }

  updateValue() {
    const href = this.url.nativeElement.value;
    const name = this.name.nativeElement.value;
    this.cell.cellValue.editedValue = `<a href='${href}'>${name}</a>`;
  }

  getUrlName(): string {
    return this.htmlValue.nativeElement.innerText;
  }

  getUrlHref(): string {
    return this.htmlValue.nativeElement.querySelector('a').getAttribute('href');
  }
}
