import {Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../services/user';
import { UserResponseDTO } from '../../../interfaces/api-dtos';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
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
  private dialogRef = inject(MatDialogRef<UpdateProfileComponent>);

  constructor() {
    this.updateForm = this.fb.group({
      username: ['', [Validators.minLength(3)]],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe((user: UserResponseDTO) => {
      this.currentUser.set(user);
      this.updateForm.patchValue({
        username: user.username,
        email: user.email
      });
      this.isLoading.set(false);
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.currentUser()) {
      return;
    }

    const userId = this.currentUser()!.id;
    const formData = this.updateForm.value;

    this.userService.updateUser(userId, formData).subscribe({
      next: (updatedUser) => {
        console.log('Perfil atualizado com sucesso!', updatedUser);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Falha ao atualizar o perfil', err);
      }
    });
  }
}
