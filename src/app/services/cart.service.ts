import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { CartSummary } from '../common/cart-summary';
import { Product } from '../common/product';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  static ITEMS_KEY: string = 'cartItems';

  cartItems: CartItem[] = [];

  storage: Storage;

  summary: BehaviorSubject<CartSummary> = new BehaviorSubject<CartSummary>(new CartSummary(0, 0));

  constructor(
    storageService: StorageService
  ) {
    this.storage = storageService.storage;

    let stored = this.storage.getItem(CartService.ITEMS_KEY);
    if (stored != null) {
      let data = JSON.parse(stored, (key: string, value: any) => {
        // return CartItem objects so have access to the methods in the class
        let result = value;
        // keys for array items are numeric
        const parsed = parseInt(key, 10);
        if (!isNaN(parsed)) {
          result = CartItem.fromObj(value);
        }
        return result;
      });
      this.cartItems = data;

      this.computeCartTotals();
    }
  }

  /**
   * Add a product to the cart
   * @param product Product to add
   */
   addToCart(product: Product) {
    console.log(`Adding '${product.name}' @ ${product.unitPrice} to cart`);

    let cartItem: CartItem | undefined = this.findItem(product);

    if (cartItem != undefined) {
      // increment existing cart item
      cartItem.quantity++;
    } else {
      cartItem = CartItem.ofProduct(product);
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  /**
   * Remove a product from the cart
   * @param product Product to remove
   */
   removeFromCart(product: Product) {
    console.log(`Removing '${product.name}' from cart`);

    this.removeIdFromCart(product.id);
  }

  /**
   * Remove a product from the cart
   * @param id Id of product to remove
   */
   removeIdFromCart(id: number) {
    console.log(`Removing product id '${id}' from cart`);

    this.cartItems.forEach((element, index)=>{
      if(element.id == id) {
        this.cartItems.splice(index, 1);
      }
    });

    this.computeCartTotals();
  }

  /**
   * Change the quantity of a product to the cart
   * @param id     Id of product to increment
   * @param count  Number to modify the quantity by
   */
   modifyQuantity(id: number, count: number) {
    let cartItem: CartItem | undefined = this.findItem(id);

    if (cartItem != undefined) {
      cartItem!.quantity += count;
    }

    this.computeCartTotals();
  }

  /**
   * Increment the quantity of a product to the cart
   * @param id Id of product to increment
   */
   incrementQuantity(id: number) {
    this.modifyQuantity(id, 1);
  }

  /**
   * Decrement the quantity of a product to the cart
   * @param id Id of product to increment
   */
   decrementQuantity(id: number) {
    this.modifyQuantity(id, -1);
  }

  /**
   * Compute the cart totals
   */
  computeCartTotals() {
    let price: number = 0;
    let quantity: number = 0;

    this.cartItems.forEach(item => {
      price += item.totalPrice;
      quantity += item.quantity;
    });

    // publish new data
    this.publishTotals(price, quantity);

    this.persistCartItems();
  }

  /**
   * Publish cart totals to all subscribers
   * @param price     total price
   * @param quantity  total quantity
   */
  publishTotals(price: number, quantity: number) {
    this.summary.next(new CartSummary(price, quantity));

    console.log(`cart total ${price}, ${quantity} items`)
    this.cartItems.forEach(item => {
      console.log(`> ${item.quantity} '${item.name}' @ ${item.unitPrice} = ${item.totalPrice}`)
    });
  }

  /**
   * Empty the cart
   */
  emptyCart() {
    this.cartItems.length = 0;
    this.computeCartTotals();
  }

  /**
   * Check if cart is empty
   * @returns 
   */
  isEmpty(): boolean {
    return this.cartItems.length == 0;
  }

  /**
   * Find an item in cart items
   * @param toFind Product to add
   */
  findItem(toFind: Product | number): CartItem | undefined {

    let cartItem: CartItem | undefined = undefined;

    if (Product.isProduct(toFind)) {
      cartItem = this.cartItems.find(item => item.id === (toFind as Product).id);
    } else if ((toFind as number).toExponential !== undefined) {
      cartItem = this.cartItems.find(item => item.id === (toFind as number));
    }

    return cartItem;
  }
  
  /**
   * Persist the cart items to storage
   */
   persistCartItems() {
    this.storage.setItem(CartService.ITEMS_KEY, JSON.stringify(this.cartItems));
  }
  
}
