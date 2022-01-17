import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { GetRespProducts, ProductService } from 'src/app/services/product.service';
import { ALL_ITEMS } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
import { ID_PARAM, KEYWORD_PARAM, NAME_PARAM } from 'src/app/app.module'
import { Pagination } from 'src/app/common/pagination';
import { AppConstants } from 'src/app/common/constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];     // list of products
  currentCategoryId: number = ALL_ITEMS;   // current caetgory id
  previousCategoryId: number = ALL_ITEMS;  // previous category id
  previousKeyword: string = "";               // previous keyword
  searchMode: boolean = false;  // search mode flag
  currentMode!: string;         // current mode; category or search
  currentModeParam!: string;    // current mode param; caetgory name or search keyword
  pagination: Pagination = new Pagination();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  /**
   * Get a list of products
   */
   listProducts() {
    // check if 'keyword' param is available, i.e. in search mode
    this.searchMode = this.route.snapshot.paramMap.has(KEYWORD_PARAM);
    if (this.searchMode) {
      this.handleSearch();
      this.currentMode = "Search"
    } else {
      this.handleProducts();
      this.currentMode = "Category"
    }
  }

  /**
   * Get a list of products
   */
   handleProducts() {
    // check if 'id' param is available
    let hasId: boolean = this.route.snapshot.paramMap.has(ID_PARAM);
    if (hasId) {
      // get 'id' and convert to number
      let idParam = this.route.snapshot.paramMap.get(ID_PARAM);
      if (idParam != null) {
        this.currentCategoryId = +idParam;
        this.currentModeParam = this.route.snapshot.paramMap.get(NAME_PARAM) ?? "";
      } else {
        hasId = false;
      }
    } 
    if (!hasId) {
      this.currentCategoryId = ALL_ITEMS; // default
      this.currentModeParam = "All";
    }

    // Check if the category id has changed and if so reset pagination
    if (this.currentCategoryId != this.previousCategoryId) {
      this.pagination.reset();
      this.previousCategoryId = this.currentCategoryId;
    }

    console.log(`current category ${this.currentCategoryId}, page ${this.pagination.page}`);

    // get the products for the given category id
    this.productService.getProductListPaginate(
      this.pagination.page, this.pagination.size, this.currentCategoryId).subscribe(
        this.processResult()
    )
  }

  /**
   * Search products
   */
   handleSearch() {
    const keyword: string = this.route.snapshot.paramMap.get(KEYWORD_PARAM) ?? "";

    this.currentModeParam = keyword;

    // Check if the keyword has changed and if so reset pagination
    if (keyword != this.previousKeyword) {
      this.pagination.reset();
      this.previousKeyword = keyword;
    }

    console.log(`keyword ${keyword}, page ${this.pagination.page}`);

    // get the products for the given category id
    this.productService.searchProductsPaginate(
      this.pagination.page, this.pagination.size, keyword).subscribe(
        this.processResult()
    )
  }

  /**
   * Process a products response
   * @returns 
   */
  private processResult() {
    return (data: GetRespProducts) => {
      this.products = data._embedded.products;
      this.pagination.setFrom(data.page);
    }
  }

  /**
   * Add a product to the cart
   * @param product Product to add
   */
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  /**
   * Update the pagination page size
   * @param pageSize  Page size to set
   */
  updatePageSize(pageSize: number) {
    this.pagination.size = pageSize;
    this.pagination.page = Pagination.FIRST_PAGE;
    this.listProducts();
  }

  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }

}

