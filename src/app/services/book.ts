import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDetailsDTO, PageResponseDTO, BookIsbnDTO  } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-vibebooks.fabrodiego.com/vibebooks/api';


  searchBooks(query: string, page: number, size: number): Observable<PageResponseDTO<BookDetailsDTO>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponseDTO<BookDetailsDTO>>(`${this.apiUrl}/books/search`, { params });
  }

  getBookById(bookId: string): Observable<BookDetailsDTO> {
    return this.http.get<BookDetailsDTO>(`${this.apiUrl}/books/${bookId}`);
  }

  createBookByIsbn(isbn: string): Observable<BookDetailsDTO> {
    const dto: BookIsbnDTO = { isbn: isbn };
    return this.http.post<BookDetailsDTO>(`${this.apiUrl}/books`, dto);
  }
}
