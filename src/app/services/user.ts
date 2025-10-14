import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO, UserUpdateDTO, PasswordChangeDTO } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.tlgdnao.fun/vibebooks/api';

  getMe(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/users/me`);
  }

  updateUser(userId: string, data: UserUpdateDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/users/${userId}`, data);
  }

  changePassword(userId: string, data: PasswordChangeDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/password`, data);
  }
}
