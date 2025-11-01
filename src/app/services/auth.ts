import { PLATFORM_ID, Injectable, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenDTO, UserCreateDTO, UserResponseDTO } from '../interfaces/api-dtos';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  platformId = inject(PLATFORM_ID);
  private apiUrl = 'https://api-vibebooks.fabrodiego.com/vibebooks/api/auth';
  private tokenKey = 'vibebooks_token';

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<UserResponseDTO | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn.set(this.isTokenValid());
    }
  }

  isTokenValid(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const expirationDate = decodedToken.exp * 1000;
      const isExpired = Date.now() >= expirationDate;
      return !isExpired;
    } catch (error) {
      console.error("Token malformado:", error);
      return false;
    }
  }

  login(credentials: any): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          this.isLoggedIn.set(this.isTokenValid());
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.isLoggedIn.set(false);
    this.currentUser.set(null)
    void this.router.navigate(['/login']);
  }

  signup(userData: UserCreateDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, userData);
  }
}
