import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  imports: [CommonModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent implements OnInit, OnDestroy {
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
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
