import { Directive, ElementRef, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Output() scrollEnd = new EventEmitter<void>();

  private scrollSubscription?: Subscription;
  private threshold = 200; // Distance from bottom to trigger loading

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.scrollSubscription = fromEvent(this.elementRef.nativeElement, 'scroll')
      .pipe(throttleTime(200)) // Throttle to avoid too many events
      .subscribe(() => this.onScroll());
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private onScroll() {
    const element = this.elementRef.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // Check if user has scrolled near the bottom
    if (scrollTop + clientHeight >= scrollHeight - this.threshold) {
      this.scrollEnd.emit();
    }
  }
}