import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  theme = signal<'light' | 'dark'>('dark');

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();

    effect(() => {
      const newTheme = this.theme();
      const oldTheme = newTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('vibebooks-theme', newTheme);
      this.renderer.removeClass(document.body, `${oldTheme}-theme`);
      this.renderer.addClass(document.body, `${newTheme}-theme`);
    });
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('vibebooks-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
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
