import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-two-factor-auth-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './two-factor-auth-modal.html',
  styleUrl: './two-factor-auth-modal.scss'
})
export class TwoFactorAuthModalComponent {
  constructor(public dialogRef: MatDialogRef<TwoFactorAuthModalComponent>) {}

  onConfigure(method: 'email' | 'phone'): void {
    console.log(`Configurar 2FA via ${method} selecionado.`);
    this.dialogRef.close();
  }
}
