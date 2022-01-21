import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { CountryService } from './services/country.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormService } from './services/form.service';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

import appConfig from './config/app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';

export const CATEGORY_ROUTE = 'category';
export const ID_PARAM = 'id';
export const NAME_PARAM = 'name';
export const CATEGORY_ID_ROUTE = `${CATEGORY_ROUTE}/:${ID_PARAM}/:${NAME_PARAM}`;
export const PRODUCTS_ROUTE = 'products';
export const PRODUCT_ID_ROUTE = `${PRODUCTS_ROUTE}/:${ID_PARAM}`;
export const SEARCH_ROUTE = 'search';
export const KEYWORD_PARAM = 'keyword';
export const SEARCH_KEYWORD_ROUTE = `${SEARCH_ROUTE}/:${KEYWORD_PARAM}`;
export const CART_DETAILS_ROUTE = 'cart-details';
export const CHECKOUT_ROUTE = 'checkout';
export const LOGIN_ROUTE = 'login';
export const LOGOUT_ROUTE = 'logout';
export const CALLBACK_ROUTE = `${LOGIN_ROUTE}/callback`;
export const MEMBERS_ROUTE = 'members';
export const ORDERS_ROUTE = 'orders';


export function appRouteUrl(path: string): string {
  return `/${path}`
}


const routes: Routes = [
  {path: CALLBACK_ROUTE, component: OktaCallbackComponent},
  {path: LOGIN_ROUTE, component: LoginComponent},
  {path: MEMBERS_ROUTE, component: MembersPageComponent, canActivate: [OktaAuthGuard]},
  {path: ORDERS_ROUTE, component: OrderHistoryComponent, canActivate: [OktaAuthGuard]},
  {path: SEARCH_KEYWORD_ROUTE, component: ProductListComponent},
  {path: CATEGORY_ID_ROUTE, component: ProductListComponent},
  {path: CATEGORY_ROUTE, component: ProductListComponent},
  {path: PRODUCT_ID_ROUTE, component: ProductDetailsComponent},
  {path: PRODUCTS_ROUTE, component: ProductListComponent},
  {path: CART_DETAILS_ROUTE, component: CartDetailsComponent},
  {path: CHECKOUT_ROUTE, component: CheckoutComponent},
  {path: '', redirectTo: PRODUCTS_ROUTE, pathMatch: 'full'},
  {path: '**', redirectTo: PRODUCTS_ROUTE, pathMatch: 'full'},
];


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [
    ProductService, 
    CountryService, 
    FormService,
    { 
      provide: OKTA_CONFIG, 
      useFactory: () => {
        const oktaAuth = new OktaAuth(appConfig.oidc);
        return { oktaAuth };
      } 
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
