import { Component, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { BookService } from '../../services/book';
import { CommentService } from '../../services/comment';
import { UserService } from '../../services/user';
import { BookDetailsDTO, CommentDetailsDTO, UserResponseDTO, BookStatus, BookSentiment, BookStatusSentimentDTO } from '../../interfaces/api-dtos';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UUID } from 'crypto';

interface CommentPaginationState {
  currentPage: number;
  totalPages: number;
  loadingMore: boolean;
}

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgOptimizedImage,
    MatSnackBarModule
  ],
  templateUrl: './book-details.html',
  styleUrl: './book-details.scss'
})
export class BookDetailsComponent implements OnInit {
  private bookService = inject(BookService);
  private commentService = inject(CommentService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  public data: { bookId: UUID } = inject(MAT_DIALOG_DATA);

  statusOptions: { key: BookStatus; label: string }[] = [
    { key: 'WANT_TO_READ', label: 'Quero Ler' },
    { key: 'READING', label: 'Lendo' },
    { key: 'READ', label: 'Lido' },
  ];

  sentimentOptions: { key: BookSentiment; label: string }[] = [
    { key: 'INSPIRING', label: 'Inspirador' },
    { key: 'FUN', label: 'Divertido' },
    { key: 'EMOTIONAL', label: 'Emocional' },
    { key: 'TENSE', label: 'Tenso' },
    { key: 'INFORMATIVE', label: 'Informativo' },
    { key: 'BORING', label: 'Chato' },
    { key: 'CONFUSING', label: 'Confuso' },
    { key: 'MOTIVATIONAL', label: 'Motivacional' },
  ];

  book = signal<BookDetailsDTO | null>(null);
  comments = signal<CommentDetailsDTO[]>([]);
  isLoadingBook = signal(true);
  isLoadingComments = signal(true);
  isCommentsVisible = signal(true);
  commentPagination = signal<CommentPaginationState>({ currentPage: -1, totalPages: 0, loadingMore: false });

  currentUser: UserResponseDTO | null = null;

  private readonly COMMENTS_PAGE_SIZE = 5;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadBookDetails();
    this.loadInitialComments();
  }

  loadCurrentUser(): void {
    this.userService.getMe().subscribe(user => this.currentUser = user);
  }

  loadBookDetails(): void {
    this.isLoadingBook.set(true);
    this.bookService.getBookById(this.data.bookId).subscribe({
      next: (bookDetails) => {
        this.book.set(bookDetails);
        this.isLoadingBook.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch book details', err);
        this.isLoadingBook.set(false);
      }
    });
  }

  loadInitialComments(): void {
    this.loadCommentsPage(0);
  }

  private loadCommentsPage(page: number): void {
    this.isLoadingComments.set(page === 0); // Loading inicial
    this.commentPagination.update(state => ({ ...state, loadingMore: page > 0 })); // Loading "mais"

    this.commentService.findCommentsByBookId(this.data.bookId, page, this.COMMENTS_PAGE_SIZE).subscribe({
      next: (response) => {
        this.comments.update(existingComments =>
          page === 0 ? response.content : [...existingComments, ...response.content]
        );
        this.commentPagination.set({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          loadingMore: false
        });
        this.isLoadingComments.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch comments', err);
        this.isLoadingComments.set(false);
        this.commentPagination.update(state => ({ ...state, loadingMore: false }));
        this.snackBar.open('Erro ao carregar comentários.', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadMoreComments(): void {
    const state = this.commentPagination();
    if (!state.loadingMore && (state.currentPage + 1 < state.totalPages)) {
      this.loadCommentsPage(state.currentPage + 1);
    }
  }

  likeComment(commentId: UUID): void {
    this.commentService.likeComment(commentId).subscribe({
      next: (updatedCommentDTO) => {
        this.comments.update(currentComments =>
          currentComments.map(comment =>
            comment.id === commentId ? updatedCommentDTO : comment
          )
        );
      },
      error: () => this.snackBar.open('Erro ao curtir comentário.', 'Fechar', { duration: 3000 })
    });
  }

  deleteComment(commentId: UUID): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(currentComments =>
          currentComments.filter(comment => comment.id !== commentId)
        );
        this.snackBar.open('Comentário excluído.', 'Fechar', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erro ao excluir comentário.', 'Fechar', { duration: 3000 })
    });
  }

  likeBook(book: BookDetailsDTO): void {
    this.bookService.likeBook(book.id).subscribe({
      next: (response) => {
        this.book.update(currentBook => ({
          ...currentBook!,
          likedByCurrentUser: response.liked,
          likesCount: response.totalLikes
        }));
      },
      error: () => this.snackBar.open('Erro ao curtir o livro.', 'Fechar', { duration: 3000 })
    });
  }

  handleStatusClick(book: BookDetailsDTO, newStatus: BookStatus): void {
    const statusToSend = (book.status === newStatus) ? null : newStatus;
    const sentimentToSend = (statusToSend === 'READING' || statusToSend === 'READ')
      ? book.sentiment
      : null;

    const dto: BookStatusSentimentDTO = {
      status: statusToSend,
      sentiment: sentimentToSend
    };

    this.bookService.updateBookStatus(book.id, dto).subscribe({
      next: (response) => {
        this.book.update(currentBook => ({
          ...currentBook!,
          status: response.status,
          sentiment: response.sentiment
        }));
        this.snackBar.open('Status atualizado!', 'Fechar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 })
    });
  }

  handleSentimentClick(book: BookDetailsDTO, newSentiment: BookSentiment): void {
    if (!book.status || (book.status !== 'READING' && book.status !== 'READ')) {
      this.snackBar.open('Você precisa marcar como "Lendo" ou "Lido" para adicionar um sentimento.', 'Fechar', { duration: 4000 });
      return;
    }

    const sentimentToSend = (book.sentiment === newSentiment) ? null : newSentiment;

    const dto: BookStatusSentimentDTO = {
      status: book.status!,
      sentiment: sentimentToSend
    };

    this.bookService.updateBookStatus(book.id, dto).subscribe({
      next: (response) => {
        this.book.update(currentBook => ({
          ...currentBook!,
          status: response.status,
          sentiment: response.sentiment
        }));
        this.snackBar.open('Sentimento atualizado!', 'Fechar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Erro ao atualizar sentimento.', 'Fechar', { duration: 3000 })
    });
  }

  toggleCommentsVisibility(): void {
    this.isCommentsVisible.update(v => !v);
  }
}
