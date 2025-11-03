import { UUID } from "crypto";

export interface CommentDetailsDTO {
  id: UUID;
  text: string;
  userId: UUID;
  username: string;
  creationDate: string;
  bookId: UUID;
  bookTitle: string;
  likesCount: number;
  likedByCurrentUser: boolean;
}

export interface CommentCreationDTO {
  text: string;
  bookId: UUID;
}

export interface BookLikeResponseDTO {
  liked: boolean;
  totalLikes: number;
}

export interface BookDetailsDTO {
  id: UUID;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImageUrl: string;
  likesCount: number;
  likedByCurrentUser: boolean;
}

export interface BookFeedDTO {
  id: UUID;
  title: string;
  author: string;
  publicationYear: number;
  coverImageUrl: string;
  comments: CommentDetailsDTO[];
  likesCount: number;
  likedByCurrentUser: boolean;
  status?: BookStatus | null;
  sentiment?: BookSentiment | null;
}

export interface PageResponseDTO<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface TokenDTO {
  token: string;
}

export interface UserCreateDTO {
  username: string;
  email: string;
  rawPassword: string;
}

export interface UserResponseDTO {
  id: UUID;
  username: string;
  email: string;
  bio?: string;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  bio?: string;
}

export interface BookIsbnDTO {
  isbn: string;
}

export interface PasswordChangeDTO {
  oldPassword: string;
  newPassword: string;
}

export type BookStatus = 'WANT_TO_READ' | 'READING' | 'READ';

export type BookSentiment =
  | 'INSPIRING'
  | 'FUN'
  | 'EMOTIONAL'
  | 'TENSE'
  | 'INFORMATIVE'
  | 'BORING'
  | 'CONFUSING'
  | 'MOTIVATIONAL';

export interface BookStatusSentimentDTO {
  status: BookStatus | null;
  sentiment?: BookSentiment | null;
}

export interface BookStatusSentimentResponseDTO {
  bookId: UUID;
  status: BookStatus | null;
  sentiment?: BookSentiment | null;
}
