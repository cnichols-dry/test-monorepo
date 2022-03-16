import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../book.model';
import { Subscription } from 'rxjs';
import { BooksService } from '../books.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;
  userId: string;

  isLoading = false;
  books: Book[] = [];

  totalBooks = 0;
  booksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private booksSub: Subscription;
  private authStatusSub: Subscription;
  constructor(private booksService: BooksService, private authservice: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
    this.userId = this.authservice.getUserId();
    this.booksSub = this.booksService.getBooksupdateListener().pipe(
      map(bookData => {
          bookData.books.map(book => {
          book.description = book.description.slice(0,150);
        })
        return bookData;
      })
    ).subscribe(booksData => {
      this.isLoading = false;
      this.totalBooks = booksData.bookCount;
      this.books = booksData.books;
    });
    this.isUserAuthenticated = this.authservice.getIsAuth
    ();
    this.authStatusSub = this.authservice.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    })
  }

  onDelete(bookId: string) {
    this.isLoading = true;
    this.booksService.deleteBook(bookId).subscribe(() => {
      this.booksService.getBooks(this.booksPerPage, this.currentPage);
    }, () => this.isLoading = false);
  }
  
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.booksPerPage = pageData.pageSize;
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
