import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable()
export class ScrollTopService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    readonly viewportScroller: ViewportScroller) {
  }

  setScrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
          filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // window.scroll(0, 0);
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }
}
