import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenDTO, UserCreateDTO, UserResponseDTO } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://10.243.96.175:8080/vibebooks/api/auth';

  login(credentials: any): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.apiUrl}/login`, credentials);
  }
  signup(userData: UserCreateDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, userData);
  }
}

