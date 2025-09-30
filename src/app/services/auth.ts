import { PLATFORM_ID, Injectable, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenDTO, UserCreateDTO, UserResponseDTO } from '../interfaces/api-dtos';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  platformId = inject(PLATFORM_ID)
  private apiUrl = 'https://api.tlgdnao.fun/vibebooks/api/auth';

  isLoggedIn = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(this.hasToken());
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('vibebooks_token');
  }

  login(credentials: any): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('vibebooks_token', response.token);
          this.isLoggedIn.set(true);
          console.log('[AuthService] Signal isLoggedIn alterado para:', this.isLoggedIn());
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('vibebooks_token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  signup(userData: UserCreateDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, userData);
  }
}

