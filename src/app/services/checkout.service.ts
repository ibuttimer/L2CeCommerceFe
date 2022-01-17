import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentInfo } from '../common/payment-info';
import { Purchase } from '../common/purchase';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService  extends BaseService {

  private baseUrl = `${this.apiUrl}/checkout`
  private purchaseUrl = `${this.baseUrl}/purchase`
  private paymentIntentUrl = `${this.baseUrl}/payment-intent`

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
