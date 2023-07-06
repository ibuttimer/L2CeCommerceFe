import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { ServiceInterface } from './service-interface';

import appConfig from "../config/app-config";

export const ALL_ITEMS: number = 0;
export const MAX_ITEMS: number = 2_147_483_647;

export const NO_PAGE = -1;
export const NO_SIZE = 0;
export const NO_QUERY = "";
export const NO_KEYWORD = "";

@Injectable({
  providedIn: 'root'
})
export class BaseService implements ServiceInterface {

  protected apiUrl = appConfig.app.apiUrl;

  constructor(protected httpClient: HttpClient) { }

  /**
   * Get an entity
   * @param {string} baseUrl  base url
   * @param {number} id   Id of entity to get
   * @return {Observable<Product>}
   */
  getEntity<Type>(baseUrl: string, id: number): Observable<Type> {
    const url = `${baseUrl}/${id}`;
    return this.httpClient.get<Type>(url);
  }

  /**
   * Get a entity list response
   * @param {string} searchUrl   Url to call
   * @return {Observable<Type>}
   */
   getEntitiesResponse<Type>(searchUrl: string): Observable<Type> {
    return this.httpClient.get<Type>(searchUrl);
  }

  /**
   * Get a paginated list of entities
   * @param {string} url            base request url
   * @param {number} page           page number to retrieve
   * @param {number} pageSize       page size
   * @param {string} query          query name
   * @param {number | string} param query parameter
   * @return {Observable<Type>}
   */
   getPaginatedEntityList<Type>(url: string, page: number, pageSize: number,
                                  query: string, param: number | string): Observable<Type> {
    let requestUrl;
    let conjunction = '&';
    if (param === ALL_ITEMS || param === NO_KEYWORD) {
      requestUrl = url;
      if (!requestUrl.includes("?")) {
        conjunction = '?';
      }
    } else {
      // build URL
      requestUrl = `${url}?${query}=${param}`;
      conjunction = '&';
    }
    if (page != NO_PAGE) {
      requestUrl = `${requestUrl}${conjunction}page=${page}&size=${pageSize}`;
    }

    return this.getEntitiesResponse(requestUrl);
  }

  get securedEndpoints(): string[] {
    return [];
  }

}


