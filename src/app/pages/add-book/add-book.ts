import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../services/book';
import { BookDetailsComponent } from '../book-details/book-details';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss'
})
export class AddBookComponent {
  addBookForm: FormGroup;
  errorMessage = signal('');

  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  constructor() {
    this.addBookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^(?:\d{10}|\d{13})$/)]]
    });
  }

  onSubmit(): void {
    if (this.addBookForm.invalid) {
      return;
    }
    this.errorMessage.set('');

    const isbn = this.addBookForm.value.isbn;

    this.bookService.createBookByIsbn(isbn).subscribe({
      next: (newBook) => {
        this.addBookForm.reset();

        this.dialog.open(BookDetailsComponent, {
          width: '600px',
          data: { bookId: newBook.id }
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage.set('Este livro já existe na nossa base de dados.');
        } else if (err.status === 404) {
          this.errorMessage.set('Nenhum livro encontrado com este ISBN. Verifique o número.');
        } else {
          this.errorMessage.set('Ocorreu um erro ao adicionar o livro. Tente novamente.');
        }
      }
    });
  }
}
