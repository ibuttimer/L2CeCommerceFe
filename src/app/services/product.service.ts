import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../common/pagination';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { ALL_ITEMS, BaseService, NO_PAGE, NO_SIZE } from './base.service';



@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  private baseUrl = `${this.apiUrl}/products`
  private categoryUrl = `${this.apiUrl}/product-category`

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get a list of products
   * @param {number} categoryId   Id of category of products to retrieve
   * @return {Observable<Product[]>} 
   */
   getProductList(categoryId: number): Observable<Product[]> {
    return this.getProductsFromResponse(
        this.getProductListPaginate(NO_PAGE, NO_SIZE, categoryId)
      );
  }

  /**
   * Get a list of products
   * @param {Observable<GetRespProducts>} response   Response
   * @return {Observable<Product[]>} 
   */
   private getProductsFromResponse(response: Observable<GetRespProducts>): Observable<Product[]> {
    return response.pipe(
        map(response => response._embedded.products)
      );
  }

  /**
   * Get a list of products
   * @param {number} page         page number to retrieve
   * @param {number} pageSize     page size
   * @param {number} categoryId   Id of category of products to retrieve
   * @return {Observable<GetRespProducts>} 
   */
   getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetRespProducts> {

    let url;
    if (categoryId === ALL_ITEMS) {
      url = this.baseUrl;
    } else {
      // build URL
      url = `${this.baseUrl}/search/findByCategoryId`;
    }

    return this.getPaginatedProductList(url, page, pageSize, "id", categoryId);
  }

  /**
   * Get a list of products
   * @param {string} url            base request url
   * @param {number} page           page number to retrieve
   * @param {number} pageSize       page size
   * @param {string} query          query name
   * @param {number | string} param query parameter
   * @return {Observable<GetRespProducts>} 
   */
   private getPaginatedProductList(url: string, page: number, pageSize: number, 
                                  query: string, param: number | string): Observable<GetRespProducts> {

    return this.getPaginatedEntityList<GetRespProducts>(url, page, pageSize, query, param);
  }

  /**
   * Get a list of product categories
   * @return {Observable<ProductCategory[]>} 
   */
   getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetRespProductCategories>(this.categoryUrl)
      .pipe(
        map(response => response._embedded.productCategory)
      );
  }

  /**
   * Search products
   * @param {string} keyword   keyword from title of products to retrieve
   * @return {Observable<Product[]>} 
   */
   searchProducts(keyword: string): Observable<Product[]> {
    return this.getProductsFromResponse(
      this.searchProductsPaginate(NO_PAGE, NO_SIZE, keyword)
    );
  }

  /**
   * Search products
   * @param {number} page         page number to retrieve
   * @param {number} pageSize     page size
   * @param {string} keyword   keyword from title of products to retrieve
   * @return {Observable<GetRespProducts>} 
   */
   searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<GetRespProducts> {
    let searchUrl;
    if (keyword === "") {
      searchUrl = this.baseUrl;
    } else {
      // build URL
      searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase`;
    }
    return this.getPaginatedProductList(searchUrl, page, pageSize, "name", keyword);
  }

  /**
   * Get a products list response
   * @param {string} searchUrl   Url to call
   * @return {Observable<GetRespProducts>} 
   */
  private getProductsResponse(searchUrl: string): Observable<GetRespProducts> {
    return this.getEntitiesResponse<GetRespProducts>(searchUrl);
  }


  /**
   * Get a product
   * @param {number} id   Id of product to get
   * @return {Observable<Product>} 
   */
   getProduct(id: number): Observable<Product> {
    return this.getEntity<Product>(this.baseUrl, id);
  }
}

/**
 * Interface to unwrap products response
 */
export interface GetRespProducts {
  _embedded: {
    products: Product[];
  },
  page: Pagination
}

/**
 * Interface to unwrap product categories response
 */
 interface GetRespProductCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
