import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TwoFactorAuthModalComponent } from '../two-factor-auth-modal/two-factor-auth-modal';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  currentUserId = signal<string | null>(null);
  isLoading = signal(true);

  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUserId.set(user.id);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Failed to load user ID", err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar dados do utilizador.', 'Fechar', { duration: 3000 });
      }
    });
  }

  openTwoFactorModal(): void {
    this.dialog.open(TwoFactorAuthModalComponent, {
      width: '450px',
      autoFocus: false
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.currentUserId()) {
      return;
    }

    this.isLoading.set(true);
    const payload = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(this.currentUserId()!, payload).subscribe({
      next: () => {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
        void this.router.navigate(['/profile']);
      },
      error: (err) => {
        let errorMessage = 'Erro ao alterar a senha. Tente novamente.';

        if (err && err.error && err.error.message) {
          if (err.error.message === 'Incorrect old password.') {
            errorMessage = 'Senha antiga incorreta.';
          } else {
            errorMessage = err.error.message;
          }
        }

        this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    void this.router.navigate(['/profile']);
  }
}
