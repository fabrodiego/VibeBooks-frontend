import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './theme-settings.html',
  styleUrl: './theme-settings.scss'
})
export class ThemeSettingsComponent {
  private themeService = inject(ThemeService);

  currentTheme = this.themeService.theme;

  changeTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
  }
}
