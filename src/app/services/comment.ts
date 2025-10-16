import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDetailsDTO } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-vibebooks.fabrodiego.com/vibebooks/api';


  findCommentsByBookId(bookId: string): Observable<CommentDetailsDTO[]> {
    const params = new HttpParams().set('bookId', bookId);

    return this.http.get<CommentDetailsDTO[]>(`${this.apiUrl}/comments`, { params });
  }

}
