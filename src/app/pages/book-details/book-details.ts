import { Component, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { BookService } from '../../services/book';
import { CommentService } from '../../services/comment';
import {BookDetailsDTO, CommentDetailsDTO} from '../../interfaces/api-dtos';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatTabsModule
  ],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss'
})
export class BookDetailsComponent implements OnInit {
  private bookService = inject(BookService);
  private commentService = inject(CommentService);
  public data: { bookId: string } = inject(MAT_DIALOG_DATA);

  book = signal<BookDetailsDTO | null>(null);
  comments = signal<CommentDetailsDTO[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadBookDetails();
    this.loadComments();
  }

  loadBookDetails(): void {
    this.bookService.getBookById(this.data.bookId).subscribe({
      next: (bookDetails) => this.book.set(bookDetails),
      error: (err) => console.error('Failed to fetch book details', err)
    });
  }

  loadComments(): void {
    this.commentService.findCommentsByBookId(this.data.bookId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.isLoading.set(false); // Só paramos o loading depois que tudo carregar
      },
      error: (err) => {
        console.error('Failed to fetch comments', err);
        this.isLoading.set(false);
      }
    });
  }
}
