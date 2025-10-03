import { UUID } from "crypto";

export interface CommentDetailsDTO {
  id: UUID;
  text: string;
  username: string;
  creationDate: string;
  bookId: UUID;
  bookTitle: string;
}

export interface BookDetailsDTO {
  id: UUID;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImageUrl: string;
}

export interface BookFeedDTO {
  id: UUID;
  title: string;
  author: string;
  publicationYear: number;
  coverImageUrl: string;
  comments: CommentDetailsDTO[];
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
}

export interface BookIsbnDTO {
  isbn: string;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
}
