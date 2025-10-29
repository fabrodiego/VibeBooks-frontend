import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { FeedService } from '../../services/feed';
import { CommentService } from '../../services/comment';
import { UserService } from '../../services/user';
import { BookService } from '../../services/book';
import { BookFeedDTO, CommentDetailsDTO, UserResponseDTO, BookLikeResponseDTO, CommentCreationDTO } from '../../interfaces/api-dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UUID } from 'crypto';

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
  private userService = inject(UserService);
  private bookService = inject(BookService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  feedItems = signal<BookFeedDTO[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  commentsVisibility = signal(new Map<UUID, boolean>());
  commentsMap = signal(new Map<UUID, CommentDetailsDTO[]>());
  commentsLoading = signal(new Map<UUID, boolean>());
  commentForms = new Map<UUID, FormGroup>();
  commentPaginationState = signal(new Map<UUID, CommentPaginationState>());
  currentUser: UserResponseDTO | null = null;
  private readonly COMMENTS_PAGE_SIZE = 5;

  ngOnInit(): void {
    this.isLoading.set(true);

    this.userService.getMe().subscribe({
      next: (user: UserResponseDTO) => {
        this.currentUser = user;
        this.loadFeed();
      },
      error: (err) => {
        console.error("Failed to load current user, redirecting to login:", err);
        this.snackBar.open('Sessão inválida ou expirada. Faça login novamente.', 'Fechar', { duration: 5000 });
        this.isLoading.set(false);
        void this.router.navigate(['/login']);
      }
    });
  }

  loadFeed(page = 0): void {
    this.feedService.getFeed(page, 10).subscribe({
      next: (response) => {
        const currentItem = page === 0 ? [] : this.feedItems();
        const newItems = response.content;

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

        this.feedItems.set([...currentItem, ...newItems]);
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
}
