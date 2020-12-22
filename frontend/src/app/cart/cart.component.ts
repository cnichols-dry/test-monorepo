import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksService } from '../books/books.service';
import { Subscription } from 'rxjs';
import { async } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  isLoading = false
  cart: any[];
  totalPrice: number = 0;
  private cartObs: Subscription;
  constructor(private booksService: BooksService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.booksService.getCart();
    this.isLoading = true;
    this.cartObs = this.booksService.getCartUpdateListener().subscribe(cartData => {
      this.isLoading = false;
      this.cart = cartData.cart;
      this.getCartPrice();
    })
  }

  onRemoveItem(bookId: string) {
    this.openSnackBar();
    this.booksService.removeFromCart(bookId).subscribe(() => {
      this.booksService.getCart();
      this.getCartPrice();
    }, () => this.isLoading = false);
  }

  onOrder() {
    this.booksService.clearCart().subscribe(() => {
      this.cart = null;
      this.totalPrice = 0;
      alert('thanks for buying with us');
    });
  }

  private getCartPrice() {
    this.totalPrice = 0;
    this.cart.forEach(item => {
      this.totalPrice += (item.price * item.quantity);
    });
  }

  private openSnackBar() {
    this.snackBar.open('book removed from cart','close', {
      duration: 1000,
    });
  }

  ngOnDestroy() {
    this.cartObs.unsubscribe();
  }
}
