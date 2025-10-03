import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  logout(): void {
    this.authService.logout();
  }

  openUpdateProfileDialog(): void {
    this.dialog.open(UpdateProfileComponent, {
      width: '500px'
    });
  }
}
