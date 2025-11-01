import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  router = inject(Router);

  showNavbar = signal(true);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkUrlVisibility(event.urlAfterRedirects);
    });

    this.checkUrlVisibility(this.router.url)
  }

  private checkUrlVisibility(url: string): void {
    if (url.startsWith('/login') || url.startsWith('/signup')) {
      this.showNavbar.set(false);
    } else {
      this.showNavbar.set(true);
    }
  }

}
