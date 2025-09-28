import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NebulaBackgroundComponent } from './nebula-background/nebula-background';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NebulaBackgroundComponent], // 2. Adicionar
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'vibebooks-frontend';
}
