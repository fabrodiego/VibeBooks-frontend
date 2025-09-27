import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TokenDTO {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://10.243.96.175:8080';

  login(credentials: any): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.apiUrl}/login`, credentials);
  }
}

