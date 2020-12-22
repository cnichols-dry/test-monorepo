import { NgModule } from "@angular/core";
import { BookCreateComponent } from './book-create/book-create.component';
import { BookListComponent } from './book-list/book-list.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AppRoutingModule } from '../app-routing.module';
import { BookDetailsComponent } from './book-details/book-details.component';

@NgModule({
  declarations: [
    BookCreateComponent,
    BookListComponent,
    BookDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ]
})
export class BooksModule { }