import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../services/theme'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './theme-settings.html',
  styleUrl: './theme-settings.scss'
})
export class ThemeSettingsComponent {
  // Injeta o serviço de tema para ter acesso à lógica
  private themeService = inject(ThemeService);

  // Expõe o signal do tema atual para o template
  currentTheme = this.themeService.theme;

  /**
   * Chamado quando o usuário clica em uma opção de tema.
   * @param theme O tema a ser aplicado ('light' or 'dark').
   */
  changeTheme(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
  }
}
