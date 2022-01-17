# L2CEcommerceFe

This is the frontend of the E-commerce application from the [Full Stack: Angular and Java Spring Boot](https://www.udemy.com/course/full-stack-angular-spring-boot-tutorial/) course on [Udemy](https://www.udemy.com/). The application has been extended beyond the basic functionality outlined in the course.

It is a full stack E-commerce application with:
* login/logout 
* product catalog
* shopping cart
* checkout
* Stripe card payments
* JWT, OAuth2, OpenID Connect and SSL/TLS


The companion backend is available at [L2CEcommerceBe](https://github.com/ibuttimer/L2CEcommerceBe).

## Tech stack
The application consists of:
* [Spring Boot](https://spring.io/projects/spring-boot) application with
  * [Spring Data JPA](https://spring.io/projects/spring-data-jpa) providing REST APIs
  * [Stripe Credit Card Payments](https://stripe.com/) for card payment processing
  * JWT, oauth2, OpenID Connect provided by [okta](https://www.okta.com/)
* Database supported:
  * [MySQL](https://www.mysql.com/)
  * [PostgreSQL](https://www.postgresql.org/)
* [Angular](https://angular.io/) frontend application


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.9.



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
