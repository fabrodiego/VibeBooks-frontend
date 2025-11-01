import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { UserService } from '../../../services/user';
import { UserResponseDTO } from '../../../interfaces/api-dtos';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
    MatSnackBarModule, RouterLink
  ],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.scss'
})
export class UpdateProfileComponent implements OnInit {
  updateForm: FormGroup;
  currentUser = signal<UserResponseDTO | null>(null);
  isLoading = signal(true);

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.updateForm = this.fb.group({
      username: ['', [Validators.minLength(3)]],
      email: ['', [Validators.email]],
      bio: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user: UserResponseDTO) => {
        this.currentUser.set(user);
        this.updateForm.patchValue({
          username: user.username,
          email: user.email,
          bio: user.bio
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Failed to load user data for profile form", err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.currentUser()) {
      return;
    }
    const userId = this.currentUser()!.id;
    const changedData = this.getChangedFields();

    if (Object.keys(changedData).length === 0) {
      void this.router.navigate(['/profile']);
      return;
    }

    this.userService.updateUser(userId, changedData).subscribe({
      next: () => {
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
        void this.router.navigate(['/profile']);
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar o perfil.', 'Fechar', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    void this.router.navigate(['/profile']);
  }

  private getChangedFields(): any {
    const changedFields: any = {};
    const controls = this.updateForm.controls;

    for (const key in controls) {
      if (controls.hasOwnProperty(key) && controls[key].dirty) {
        changedFields[key] = controls[key].value;
      }
    }
    return changedFields;
  }
}
