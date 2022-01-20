import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'l2cecommercefe';

  constructor() {

    console.log('host %s  production %o', environment.apiUrl, environment.production);
  }
}
