import {Injectable, signal, effect, Renderer2, RendererFactory2, PLATFORM_ID, inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private platformId = inject(PLATFORM_ID);

  theme = signal<'light' | 'dark' | null>(null);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();

      effect(() => {
        const newTheme = this.theme();

        if (newTheme === null) {
          return;
        }

        const oldTheme = newTheme === 'light' ? 'dark' : 'light';

        localStorage.setItem('vibebooks-theme', newTheme);
        this.renderer.removeClass(document.body, `${oldTheme}-theme`);
        this.renderer.addClass(document.body, `${newTheme}-theme`);
      });
    }
  }

  private loadTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTheme = localStorage.getItem('vibebooks-theme') as 'light' | 'dark' | null;
    if(savedTheme) {
      this.theme.set(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  setTheme(newTheme: 'light' | 'dark'): void {
    this.theme.set(newTheme);
  }
}
