import { Component } from '@angular/core';
import { inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  imports: [],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss'
})
export class BottomNav {
  private router = inject(Router);
  private routerSubscription?: Subscription;

  currentRoute = signal('home');

  ngOnInit() {
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentRoute(event.url);
      });

    // Set initial route
    this.updateCurrentRoute(this.router.url);
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private updateCurrentRoute(url: string) {
    if (url === '/' || url === '/home') {
      this.currentRoute.set('home');
    } else if (url.includes('/dashboard')) {
      this.currentRoute.set('dashboard');
    } else if (url.includes('/nutrition')) {
      this.currentRoute.set('nutrition');
    } else if (url.includes('/workouts')) {
      this.currentRoute.set('workouts');
    } else if (url.includes('/login') || url.includes('/register')) {
      // Deselect all items on auth pages
      this.currentRoute.set('');
    } else {
      // For any other route, deselect all items
      this.currentRoute.set('');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
