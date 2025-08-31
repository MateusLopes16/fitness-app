import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('front');
}
