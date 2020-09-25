import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entriesMap.has(entry.target)) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback(entry);
    }
  }
});

@Directive({ selector: '[resizeShowMinimizeCellObserver]' })
export class ResizedShowMinimizeCellDirective implements OnDestroy {

  @Output() showHref = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {
    const target = this.el.nativeElement;
    entriesMap.set(target, this);
    ro.observe(target);
  }

  _resizeCallback(entry) {
    const e = ( this.el.nativeElement as HTMLElement );
    if (e.offsetWidth < e.scrollWidth) {
      this.showHref.emit(true);
    } else {
      this.showHref.emit(false);
    }
  }

  ngOnDestroy() {
    const target = this.el.nativeElement;
    ro.unobserve(target);
    entriesMap.delete(target);
  }
}
