import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FeedService } from '../../services/feed';
import { CommentService } from '../../services/comment';
import { BookService } from '../../services/book';
import { BookFeedDTO, CommentDetailsDTO, BookLikeResponseDTO, CommentCreationDTO, BookStatus, BookSentiment, BookStatusSentimentDTO } from '../../interfaces/api-dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UUID } from 'crypto';
import {AuthService} from '../../services/auth';

interface CommentPaginationState {
  currentPage: number;
  totalPages: number;
  loadingMore: boolean;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, NgOptimizedImage],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class FeedComponent implements OnInit {
  private feedService = inject(FeedService);
  private commentService = inject(CommentService);
  private bookService = inject(BookService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

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

  feedItems = signal<BookFeedDTO[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  commentsVisibility = signal(new Map<UUID, boolean>());
  commentsMap = signal(new Map<UUID, CommentDetailsDTO[]>());
  commentsLoading = signal(new Map<UUID, boolean>());
  commentForms = new Map<UUID, FormGroup>();
  commentPaginationState = signal(new Map<UUID, CommentPaginationState>());

  getCommunitySentiments(counts: Record<BookSentiment, number> | undefined) {
    if (!counts) {
      return [];
    }

    return this.sentimentOptions
      .map(option => ({
        label: option.label,
        count: counts[option.key] || 0
      }))
      .filter(sentiment => sentiment.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  currentUser = this.authService.currentUser();

  private readonly COMMENTS_PAGE_SIZE = 5;

  ngOnInit(): void {
    this.isLoading.set(true);
    this.loadFeed();
  }

  loadFeed(page = 0): void {
    this.feedService.getFeed(page, 10).subscribe({
      next: (response) => {
        const currentItems = page === 0 ? [] : this.feedItems();
        const newItems: BookFeedDTO[] = response.content;
        const newVisibility = new Map(this.commentsVisibility());
        const newLoading = new Map(this.commentsLoading());
        const newCommentData = new Map(this.commentsMap());
        const newPagination = new Map(this.commentPaginationState());

        newItems.forEach((book: BookFeedDTO) => {
          if (!this.commentForms.has(book.id)) {
            this.commentForms.set(book.id, this.fb.group({
              text: ['', [Validators.required, Validators.maxLength(255)]]
            }));
          }
          newVisibility.set(book.id, false);
          newLoading.set(book.id, false);
          newCommentData.set(book.id, []);
          newPagination.set(book.id, { currentPage: -1, totalPages: 0, loadingMore: false });
        });
        this.commentsVisibility.set(newVisibility);
        this.commentsLoading.set(newLoading);
        this.commentsMap.set(newCommentData);
        this.commentPaginationState.set(newPagination);

        this.feedItems.set([...currentItems, ...newItems]);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load feed', err);
        this.isLoading.set(false);
        this.snackBar.open('Erro ao carregar o feed.', 'Fechar', { duration: 3000 });
      }
    });
  }

  toggleComments(bookId: UUID) : void {
    const currentVisibility = this.commentsVisibility();
    const isVisible = currentVisibility.get(bookId);
    const newVisibility = new Map(currentVisibility);

    if (isVisible) {
      newVisibility.set(bookId, false);
      this.commentsVisibility.set(newVisibility);
      return;
    }

    newVisibility.set(bookId, true);
    this.commentsVisibility.set(newVisibility);
    this.commentsLoading.update(currentMap => new Map(currentMap).set(bookId, true));

    this.commentService.findCommentsByBookId(bookId, 0, this.COMMENTS_PAGE_SIZE).subscribe({
      next: (response) => {
        this.commentsMap.update(currentMap => new Map(currentMap).set(bookId, response.content));
        this.commentPaginationState.update(currentMap => new Map(currentMap).set(bookId, {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          loadingMore: false
        }));
        this.commentsLoading.update(currentMap => new Map(currentMap).set(bookId, false));
      },
      error: () => {
        this.commentsLoading.update(currentMap => new Map(currentMap).set(bookId, false));
        this.snackBar.open('Erro ao carregar comentários.', 'Fechar', { duration: 3000 });
      }
    });
  }

  private loadCommentsPage(bookId: UUID, page: number): void {
    this.commentsLoading.update(currentMap => new Map(currentMap).set(bookId, true));
    this.commentPaginationState.update(currentMap => {
      const newState = new Map(currentMap);
      const currentState = newState.get(bookId) ?? { currentPage: -1, totalPages: 0, loadingMore: false };
      newState.set(bookId, { ...currentState, loadingMore: page > 0 });
      return newState;
    });

    this.commentService.findCommentsByBookId(bookId, page, this.COMMENTS_PAGE_SIZE).subscribe({
      next: (response) => {
        this.commentsMap.update(currentMap => {
          const newMap = new Map(currentMap);
          const existingComments = page === 0 ? [] : (newMap.get(bookId) || []);
          newMap.set(bookId, [...existingComments, ...response.content]);
          return newMap;
        });
        this.commentPaginationState.update(map => map.set(bookId, {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          loadingMore: false
        }));
        this.commentsLoading.update(map => map.set(bookId, false));
      },
      error: () => {
        this.commentsLoading.update(currentMap => new Map(currentMap).set(bookId, false));
        this.commentPaginationState.update(currentMap => {
          const newState = new Map(currentMap);
          const currentState = newState.get(bookId) ?? { currentPage: -1, totalPages: 0, loadingMore: false };
          newState.set(bookId, { ...currentState, loadingMore: false });
          return newState;
        });
        this.snackBar.open('Erro ao carregar comentários.', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadMoreComments(bookId: UUID): void {
    const state = this.commentPaginationState().get(bookId);
    if (state && !state.loadingMore && (state.currentPage + 1 < state.totalPages)) {
      this.loadCommentsPage(bookId, state.currentPage + 1);
    }
  }

  postComment(bookId: UUID): void {
    const form = this.commentForms.get(bookId);
    if (!form || form.invalid || !this.currentUser)
      return;
    const commentData: CommentCreationDTO = { bookId, text: form.value.text };

    this.commentService.createComment(commentData).subscribe({
      next: (newComment: CommentDetailsDTO) => {
        this.commentsMap.update(currentMap => {
          const newMap = new Map(currentMap);
          const currentComments = newMap.get(bookId) || [];
          newMap.set(bookId, [...currentComments, newComment]);
          return newMap;
        });
        form.reset();
        this.snackBar.open('Comentário postado!', 'Fechar', { duration: 3000});
      },
      error: () => this.snackBar.open('Erro ao postar comentário.', 'Fechar', { duration: 3000 })
    });
  }

  likeComment(commentId: UUID, bookId: UUID): void {
    this.commentService.likeComment(commentId).subscribe({
      next: (updatedCommentDTO) => {
        this.commentsMap.update(currentMap => {
          const newMap = new Map(currentMap);
          const currentComments = newMap.get(bookId) || [];
          const updatedComments = currentComments.map(comment =>
            comment.id === commentId ? updatedCommentDTO : comment
          );
          newMap.set(bookId, updatedComments);
          return newMap;
        });
      },
      error: () => this.snackBar.open('Erro ao curtir comentário.', 'Fechar', { duration: 3000 })
    });
  }

  deleteComment(commentId: UUID, bookId: UUID): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.commentsMap.update(currentMap => {
          const newMap = new Map(currentMap);
          const updatedComments = (newMap.get(bookId) || []).filter((c: CommentDetailsDTO) => c.id !== commentId);
          newMap.set(bookId, updatedComments);
          return newMap;
        });
        this.snackBar.open('Comentário excluído.', 'Fechar', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erro ao excluir comentário.', 'Fechar', { duration: 3000 })
    });
  }

  likeBook(bookId: UUID): void {
    this.bookService.likeBook(bookId).subscribe({
      next: (response: BookLikeResponseDTO) => {
        this.feedItems.update(items =>
          items.map(book =>
            book.id === bookId
              ? { ...book, likedByCurrentUser: response.liked, likesCount: response.totalLikes }
              : book
          )
        );
      },
      error: () => this.snackBar.open('Erro ao curtir o livro.', 'Fechar', { duration: 3000 })
    });
  }

  handleStatusClick(book: BookFeedDTO, newStatus: BookStatus): void {
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
        this.feedItems.update(items =>
          items.map(item =>
            item.id === book.id
              ? { ...item, status: response.status, sentiment: response.sentiment }
              : item
          )
        );
        this.snackBar.open('Status atualizado!', 'Fechar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Erro ao atualizar status.', 'Fechar', { duration: 3000 })
    });
  }

  handleSentimentClick(book: BookFeedDTO, newSentiment: BookSentiment): void {
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
        this.feedItems.update(items =>
          items.map(item =>
            item.id === book.id
              ? { ...item, status: response.status, sentiment: response.sentiment }
              : item
          )
        );
        this.snackBar.open('Sentimento atualizado!', 'Fechar', { duration: 2000 });
      },
      error: () => this.snackBar.open('Erro ao atualizar sentimento.', 'Fechar', { duration: 3000 })
    });
  }
}
