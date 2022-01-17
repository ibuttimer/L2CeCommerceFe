import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartSummary } from 'src/app/common/cart-summary';
import { Constants, AppConstants } from 'src/app/common/constants';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit, Constants {

  cartItems: CartItem[] = [];
  cartSummary: CartSummary = CartSummary.EMPTY_CART;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  /**
   * List the cart details
   */
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.summary.subscribe(
      data => this.cartSummary = data
    );
    this.cartService.computeCartTotals();
  }

  /**
   * Increment the quantity of a product to the cart
   * @param selItem cart item to update
   */
  incrementQuantity(selItem: CartItem) {
    this.cartService.incrementQuantity(selItem.id);
  }

  /**
   * Decrement the quantity of a product to the cart
   * @param selItem cart item to update
   */
  decrementQuantity(selItem: CartItem) {
    this.cartService.decrementQuantity(selItem.id);
  }

  /**
   * Remove a product from the cart
   * @param selItem cart item to update
   */
  removeFromCart(selItem: CartItem) {
    this.cartService.removeIdFromCart(selItem.id);
  }

  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }
}
