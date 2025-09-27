import { UUID } from "crypto";

export interface CommentDetailsDTO {
  id: UUID;
  text: string;
  username: string;
  creationDate: string;
  bookId: UUID;
  bookTitle: string;
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
