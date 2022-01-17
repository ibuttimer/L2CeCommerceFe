import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../common/pagination';
import { Country } from '../common/country';
import { ALL_ITEMS, BaseService, MAX_ITEMS, NO_PAGE, NO_QUERY, NO_SIZE } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService {

  private baseUrl = `${this.apiUrl}/countries`

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get a list of countries
   * @return {Observable<Country[]>} 
   */
   getCountriesList(): Observable<Country[]> {
    return this.getCountriesFromResponse(
      this.getPaginatedCountryList(`${this.baseUrl}?sort=name,asc`, 0, MAX_ITEMS, NO_QUERY, ALL_ITEMS)
    );
  }

  /**
   * Get a list of countries
   * @param {Observable<GetRespCountries>} response   Response
   * @return {Observable<Country[]>} 
   */
   private getCountriesFromResponse(response: Observable<GetRespCountries>): Observable<Country[]> {
    return response.pipe(
      map(response => response._embedded.countries)
    );
  }

  /**
   * Get a list of countries
   * @param {string} url            base request url
   * @param {number} page           page number to retrieve
   * @param {number} pageSize       page size
   * @param {string} query          query name
   * @param {number | string} param query parameter
   * @return {Observable<GetRespCountriesPaginated>} 
   */
   private getPaginatedCountryList(url: string, page: number, pageSize: number, 
                                  query: string, param: number | string): Observable<GetRespCountriesPaginated> {

    return this.getPaginatedEntityList<GetRespCountriesPaginated>(url, page, pageSize, query, param);
  }

  /**
   * Get a countries list response
   * @param {string} searchUrl   Url to call
   * @return {Observable<GetRespCountries>} 
   */
   private getCountriesResponse(searchUrl: string): Observable<GetRespCountries> {
    return this.getEntitiesResponse<GetRespCountries>(searchUrl);
  }


  /**
   * Get a country
   * @param {number} id   Id of country to get
   * @return {Observable<Country>} 
   */
   getCountry(id: number): Observable<Country> {
    return this.getEntity<Country>(this.baseUrl, id);
  }
}


/**
 * Interface to unwrap countries response
 */
 export interface GetRespCountries {
  _embedded: {
    countries: Country[];
  },
  // page: Pagination
}

/**
 * Interface to unwrap countries response
 */
 export interface GetRespCountriesPaginated extends GetRespCountries {
  page: Pagination
}