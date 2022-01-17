import { Component, OnInit } from '@angular/core';
import { AuthenticationStatus } from 'src/app/common/authentication-status';
import { CartSummary } from 'src/app/common/cart-summary';
import { Constants, AppConstants } from 'src/app/common/constants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit, Constants {

  cartSummary: CartSummary = CartSummary.EMPTY_CART;
  authStatus: AuthenticationStatus = AuthenticationStatus.LOGGED_OUT_STATUS;

  constructor(
    private cartService: CartService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.updateCartStatus();
    this.updateAuthStatus();
  }

  updateCartStatus() {
    this.cartService.summary.subscribe(
      data => this.cartSummary = data
    );
  }

  updateAuthStatus() {
    this.authenticationService.status.subscribe(
      data => this.authStatus = data
    );
  }

  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }
}
