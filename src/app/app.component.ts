import { Component, OnInit } from '@angular/core';

import { environment } from '../environments/environment';
import appConfig from "./config/app-config";
import { HelloService } from './services/hello.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'l2cecommercefe';

  constructor(private helloService: HelloService) {

    console.log('host %s  production %o', appConfig.app.apiUrl, environment.production);
  }

  ngOnInit(): void {
    // send hello to improve host responsiveness when running on heroku
    this.helloService.sayHello().subscribe((message: String) => {
      console.log('host response: %s', message);
    });
  }
}
