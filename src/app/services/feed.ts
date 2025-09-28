import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookFeedDTO, PageResponseDTO } from '../interfaces/api-dtos';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private http = inject(HttpClient);
  private apiUrl = 'http://10.243.96.175:8080/vibebooks/api';

  getFeed(page: number, size: number): Observable<PageResponseDTO<BookFeedDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');

    return this.http.get<PageResponseDTO<BookFeedDTO>>(`${this.apiUrl}/feed`, { params });
  }
}
