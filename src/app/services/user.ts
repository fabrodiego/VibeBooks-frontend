import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { UserResponseDTO, UserUpdateDTO, PasswordChangeDTO } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-vibebooks.fabrodiego.com/vibebooks/api';
  private platformId = inject(PLATFORM_ID);

  getMe(): Observable<UserResponseDTO> {

    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<UserResponseDTO>(`${this.apiUrl}/users/me`);
    } else {
      return EMPTY;
    }
  }

  updateUser(userId: string, data: UserUpdateDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/users/${userId}`, data);
  }

  changePassword(userId: string, data: PasswordChangeDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/password`, data);
  }
}
