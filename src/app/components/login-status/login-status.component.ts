import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticationStatus } from 'src/app/common/authentication-status';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  authStatus: AuthenticationStatus = AuthenticationStatus.LOGGED_OUT_STATUS;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authenticationService.status.subscribe(
      data => this.authStatus = data
    );
  }

  logout() {
    this.authenticationService.logout();
  }
}
