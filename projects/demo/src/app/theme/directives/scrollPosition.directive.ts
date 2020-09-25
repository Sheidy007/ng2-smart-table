import { Directive, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[scrollPosition]'
})
export class ScrollPositionDirective implements OnInit {

  @Input() maxHeight: number;

  @Output() scrollChange = new EventEmitter<{
    scrolled: boolean,
    offset: number,
  }>();

  private isScrolled: boolean;

  ngOnInit() {
    this.onWindowScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const isScrolled = window.scrollY > this.maxHeight;
    if (isScrolled !== this.isScrolled) {
      this.isScrolled = isScrolled;
      this.scrollChange.emit({
        scrolled: isScrolled,
        offset: window.scrollY
      });
    }
  }

}
