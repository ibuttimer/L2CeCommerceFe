import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderHistory } from '../common/order-history';
import { Pagination } from '../common/pagination';

import { ALL_ITEMS, BaseService, MAX_ITEMS, NO_PAGE, NO_QUERY, NO_SIZE } from './base.service';


@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService extends BaseService {

  private baseUrl = `${this.apiUrl}/orders`

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }


  /**
   * Get a list of order history
   * @param {Observable<GetRespOrderHistory>} response   Response
   * @return {Observable<OrderHistory[]>}
   */
   private getOrderHistoryFromResponse(response: Observable<GetRespOrderHistory | GetRespOrderHistoryPaginated>): Observable<OrderHistory[]> {
    return response.pipe(
      map(response => response._embedded.orders)
    );
  }

  /**
   * Get a list of order history
   * @param {string} url            base request url
   * @param {number} page           page number to retrieve
   * @param {number} pageSize       page size
   * @param {string} query          query name
   * @param {number | string} param query parameter
   * @return {Observable<GetRespOrderHistoryPaginated>}
   */
   private getPaginatedOrderHistoryList(url: string, page: number, pageSize: number,
                                  query: string, param: number | string): Observable<GetRespOrderHistoryPaginated> {

    return this.getPaginatedEntityList<GetRespOrderHistoryPaginated>(url, page, pageSize, query, param);
  }

  /**
   * Get a order history list response
   * @param {string} searchUrl   Url to call
   * @return {Observable<GetRespOrderHistory>}
   */
   private getOrderHistoryResponse(searchUrl: string): Observable<GetRespOrderHistory> {
    return this.getEntitiesResponse<GetRespOrderHistory>(searchUrl);
  }

  /**
   * Get order history for a country
   * @param {string} email   email to get order history for
   * @return {Observable<OrderHistory[]>}
   */
   getEmailOrderHistory(email: string): Observable<OrderHistory[]> {
    return this.getOrderHistoryFromResponse(
      this.getOrderHistoryResponse(`${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`)
    );
  }


  /**
   * Get an order
   * @param {number} id   Id of order to get
   * @return {Observable<OrderHistory>}
   */
   getOrderHistory(id: number): Observable<OrderHistory> {
    return this.getEntity<OrderHistory>(this.baseUrl, id);
  }


  override get securedEndpoints(): string[] {
    return super.securedEndpoints.concat([
      this.baseUrl
    ]);
  }

}

/**
 * Interface to unwrap order history response
 */
export interface GetRespOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}

/**
 * Interface to unwrap order history response
 */
 export interface GetRespOrderHistoryPaginated extends GetRespOrderHistory {
  page: Pagination,
}
