import { ApplicationInitStatus, Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { OktaAuthStateService } from '@okta/okta-angular';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationStatus } from '../common/authentication-status';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  status: BehaviorSubject<AuthenticationStatus>;
  wipStatus: AuthenticationStatus;

  constructor(
    private authStateService: OktaAuthStateService,
    private oktaAuthService: OktaAuth,
    private appInit: ApplicationInitStatus
  ) {
    this.wipStatus = AuthenticationStatus.LOGGED_OUT_STATUS;
    this.status = new BehaviorSubject<AuthenticationStatus>(this.wipStatus);

    appInit.donePromise.then(() => this.onInit());
  }

  /* Services are not part of the component lifecycle so have no ngOnInit()
    functionality.
    https://github.com/angular/angular/issues/23235#issuecomment-855790872
    */
  onInit(): void {

    this.authStateService.authState$.subscribe(
      (result) => {
        this.wipStatus.reset();
        this.wipStatus.isAuthenticated = result?.isAuthenticated;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if (this.wipStatus.isAuthenticated) {
      this.oktaAuthService.getUser().then(
        res => {
          this.wipStatus.setFromUserClaims(res)
          this.publishStatus(this.wipStatus);
        }
      )
    } else {
      this.publishStatus(this.wipStatus);
    }
  }

  logout() {
    this.oktaAuthService.signOut();
  }

  /**
   * Publish authentication status to all subscribers
   * @param status
   */
   publishStatus(status: AuthenticationStatus) {
    this.status.next(status);

    console.log(`AuthenticationStatus ${status.isAuthenticated}`)
  }

}
