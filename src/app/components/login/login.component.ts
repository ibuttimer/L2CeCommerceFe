import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

import appConfig from '../../config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuthService: OktaAuth) { 
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      authParams: {
        pkce: true,   // proof key for code exchange
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes
      }
    });
  }

  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget'
    },
    (response: { status: string; }) => {
      if (response.status === 'SUCCESS') {
        this.oktaAuthService.signInWithRedirect();
      }
    },
    (error: any) => {
      throw error;
    }
    );
  }

}
