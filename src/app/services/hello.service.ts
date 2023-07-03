import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class HelloService extends BaseService {

  private baseUrl = `${this.apiUrl}/hello`

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Say hello to server
   * @return {Observable<Object>}
   */
   sayHello(): Observable<String> {
    return this.httpClient.get<GetRespHello>(this.baseUrl).pipe(
      map(response => response.message)
    );
  }
}

/**
 * Interface to unwrap response
 */
 export interface GetRespHello {
  message: String;
}

