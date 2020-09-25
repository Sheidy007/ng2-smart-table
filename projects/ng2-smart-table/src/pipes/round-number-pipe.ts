import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'roundNumber'
})
export class RoundNumberPipe implements PipeTransform {

  constructor() {
  }

  transform(v: number): SafeHtml {
    return Math.ceil(v);
  }
}
