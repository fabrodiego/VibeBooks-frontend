import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentCreationDTO, CommentDetailsDTO, PageResponseDTO } from '../interfaces/api-dtos';
import {UUID} from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-vibebooks.fabrodiego.com/vibebooks/api';


  findCommentsByBookId(bookId: UUID, page: number, size: number): Observable<PageResponseDTO<CommentDetailsDTO>> {
    const params = new HttpParams()
      .set('bookId', bookId.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');

    return this.http.get<PageResponseDTO<CommentDetailsDTO>>(`${this.apiUrl}/comments`, { params });
  }

  createComment(data: CommentCreationDTO): Observable<CommentDetailsDTO> {
    return this.http.post<CommentDetailsDTO>(`${this.apiUrl}/comments`, data);
  }

  likeComment(commentId: string | UUID): Observable<CommentDetailsDTO> {
    return this.http.post<CommentDetailsDTO>(`${this.apiUrl}/comments/${commentId}/like`, {});
  }

  deleteComment(commentId: string | UUID): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }
}
