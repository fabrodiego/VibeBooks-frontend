import { Component, OnInit, inject, signal } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BookDetailsDTO } from '../../interfaces/api-dtos';
import { BookService } from '../../services/book';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent implements OnInit {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  searchInput = new FormControl('');
  searchResults = signal<BookDetailsDTO[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(500),

      distinctUntilChanged(),

      tap(() => {
        this.isLoading.set(true);
        this.hasSearched.set(true);
      }),

      switchMap(query => this.bookService.searchBooks(query || '', 0, 10))

    ).subscribe({
      next: (response) => {
        this.searchResults.set(response.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching books:', err);
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }

  openBookDetails(bookId: string): void {
    this.dialog.open(BookDetailsComponent, {
      width: '600px',
      data: { bookId: bookId }
    });
  }
}
