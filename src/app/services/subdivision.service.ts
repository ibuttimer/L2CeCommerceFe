import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../common/pagination';
import { Subdivision } from '../common/subdivision';
import { ALL_ITEMS, BaseService, MAX_ITEMS, NO_PAGE, NO_QUERY, NO_SIZE } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SubdivisionService extends BaseService {

  private baseUrl = `${this.apiUrl}/subdivisions`;
  private sort = 'sort=name,asc';

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Get a list of subdivisions
   * @return {Observable<Subdivision[]>} 
   */
   getSubdivisionsList(): Observable<Subdivision[]> {
    return this.getSubdivisionsFromResponse(
      this.getPaginatedSubdivisionsList(`${this.baseUrl}?${this.sort}`, 0, MAX_ITEMS, NO_QUERY, ALL_ITEMS)
    );
  }

  /**
   * Get a list of subdivisions
   * @param {Observable<GetRespSubdivisions>} response   Response
   * @return {Observable<Subdivision[]>} 
   */
   private getSubdivisionsFromResponse(response: Observable<GetRespSubdivisions | GetRespSubdivisionsPaginated>): Observable<Subdivision[]> {
    return response.pipe(
      map(response => response._embedded.subdivisions)
    );
  }

  /**
   * Get a list of subdivisions
   * @param {string} url            base request url
   * @param {number} page           page number to retrieve
   * @param {number} pageSize       page size
   * @param {string} query          query name
   * @param {number | string} param query parameter
   * @return {Observable<GetRespSubdivisionsPaginated>} 
   */
   private getPaginatedSubdivisionsList(url: string, page: number, pageSize: number, 
                                  query: string, param: number | string): Observable<GetRespSubdivisionsPaginated> {

    return this.getPaginatedEntityList<GetRespSubdivisionsPaginated>(url, page, pageSize, query, param);
  }

  /**
   * Get a subdivisions list response
   * @param {string} searchUrl   Url to call
   * @return {Observable<GetRespSubdivisions>} 
   */
   private getSubdivisionsResponse(searchUrl: string): Observable<GetRespSubdivisions> {
    return this.getEntitiesResponse<GetRespSubdivisions>(searchUrl);
  }

  /**
   * Get a subdivision
   * @param {number} id   Id of subdivision to get
   * @return {Observable<Subdivision>} 
   */
   getSubdivision(id: number): Observable<Subdivision> {
    return this.getEntity<Subdivision>(this.baseUrl, id);
  }

  /**
   * Get subdivisions for a country
   * @param {string} code   Code of country to get subdivisions for
   * @return {Observable<Subdivision[]>} 
   */
   getCountrySubdivisions(code: string): Observable<Subdivision[]> {
    return this.getSubdivisionsFromResponse(
      this.getSubdivisionsResponse(`${this.baseUrl}/search/findByCountryCode?code=${code}&${this.sort}`)
    );
  }
}


/**
 * Interface to unwrap subdivisions response
 */
 export interface GetRespSubdivisions {
  _embedded: {
    subdivisions: Subdivision[];
  },
}

/**
 * Interface to unwrap subdivisions response
 */
 export interface GetRespSubdivisionsPaginated extends GetRespSubdivisions {
  page: Pagination
}
