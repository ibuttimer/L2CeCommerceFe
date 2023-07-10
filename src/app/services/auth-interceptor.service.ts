import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { from, lastValueFrom, Observable} from 'rxjs'
import { OrderHistoryService } from './order-history.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private orderHistoryService: OrderHistoryService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const securedEndpoints = this.orderHistoryService.securedEndpoints;

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    return lastValueFrom(next.handle(req));
  }


}
