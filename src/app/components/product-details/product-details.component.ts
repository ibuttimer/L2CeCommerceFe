import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ID_PARAM } from 'src/app/app.module';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { AppConstants } from 'src/app/common/constants';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = Product.EMPTY_PRODUCT;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProduct();
    });
  }

  /**
   * Get a product's details
   */
  handleProduct() {
    const idParam: any = this.route.snapshot.paramMap.get(ID_PARAM);
    if (idParam != null) {
      // get the product with the given id
      this.productService.getProduct(+idParam).subscribe(
        data => {
          this.product = data;
        }
      )
    }
  }

  /**
   * Add a product to the cart
   * @param product Product to add
   */
   addToCart() {
    this.cartService.addToCart(this.product);
  }


  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }

}
