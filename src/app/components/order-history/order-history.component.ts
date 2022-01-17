import { Component, OnInit } from '@angular/core';
import { AuthenticationStatus } from 'src/app/common/authentication-status';
import { OrderHistory } from 'src/app/common/order-history';
import { Pagination } from 'src/app/common/pagination';
import { Constants, AppConstants } from 'src/app/common/constants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GetRespOrderHistory, GetRespOrderHistoryPaginated, OrderHistoryService } from 'src/app/services/order-history.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: OrderHistory[] = [];
  pagination: Pagination = new Pagination();

  authStatus: AuthenticationStatus = AuthenticationStatus.LOGGED_OUT_STATUS;

  storage: Storage;

  constructor(
    private orderHistoryService: OrderHistoryService,
    private authenticationService: AuthenticationService,
    storageService: StorageService
  ) { 
    this.storage = storageService.storage;

  }

  ngOnInit(): void {
    this.authenticationService.status.subscribe(
      data => {
        this.authStatus = data;
        this.handleOrderHistory();
      }
    );
  }

  handleOrderHistory() {
    if (this.authStatus.isAuthenticated) {
      this.orderHistoryService.getEmailOrderHistory(this.authStatus.email!).subscribe(
        data => this.orderHistory = data
      )
    }
  }

  /**
   * Process an order history response
   * @returns 
   */
   private processResult() {
    return (data: GetRespOrderHistory | GetRespOrderHistoryPaginated) => {
      this.orderHistory = data._embedded.orders;
      // this.pagination.setFrom(data.page);
    }
  }

  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }
}
