# L2CEcommerceFe

This is the frontend of the E-commerce application from the [Full Stack: Angular and Java Spring Boot](https://www.udemy.com/course/full-stack-angular-spring-boot-tutorial/) course on [Udemy](https://www.udemy.com/). The application has been extended beyond the basic functionality outlined in the course.

It is a full stack E-commerce application with:
* login/logout 
* product catalog
* shopping cart
* checkout
* card payments
* JWT, OAuth2, OpenID Connect and SSL/TLS


The companion backend is available at [L2CEcommerceBe](https://github.com/ibuttimer/L2CEcommerceBe).

## Tech stack
The application consists of:
* [Spring Boot](https://spring.io/projects/spring-boot) application with:
  * [Spring Data JPA](https://spring.io/projects/spring-data-jpa) providing REST APIs
  * [Stripe](https://stripe.com/) for card payment processing
  * JWT, oauth2, OpenID Connect provided by [okta](https://www.okta.com/)
* Database supported:
  * [MySQL](https://www.mysql.com/)
  * [PostgreSQL](https://www.postgresql.org/)
* [Angular](https://angular.io/) frontend application

### Deployment

The application may be deployed in a [Node.js](https://nodejs.org/) environment, and includes a minimalist [Express](https://expressjs.com/) server loosely based on [How to Deploy Angular Application to Heroku](https://itnext.io/how-to-deploy-angular-application-to-heroku-1d56e09c5147)

#### Heroku

See [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true)

#### Render

Render provide a guide to migrate from Heroku [Migrate from Heroku to Render](https://render.com/docs/migrate-from-heroku)


### Demonstration

A demonstration implementation is hosted on Render at https://l2cecommercefe.onrender.com.

> **Note:** This application is not a retail site, *do not enter* valid payment card or personal details. Please use [Stripe test card numbers](https://stripe.com/docs/testing#cards).

## Development

Clone or download this repository.


#### Frontend okta application

Register for an okta developer account if necessary and create an okta application with the following parameters:

- *Sign-in method*

  OIDC - OpenID Connect

- *Application type*

  Single Page App (SPA)

**Note:** Ensure the client domain is added to the list of `Trusted Origins` for the developer account
[Security -> API -> Trusted Origins](https://dev-07906454-admin.okta.com/admin/access/api/trusted_origins).

#### Generate key and self-signed certificate

If enabling HTTPS support, follow the procedure outlined at https://github.com/darbyluv2code/fullstack-angular-and-springboot/blob/master/bonus-content/secure-https-communication/openssl-setup.md#generate-key-and-self-signed-certificate to generate key and self-signed certificate.


#### Environment configuration

##### Local development

Create a copy of [sample-app-config.ts](src/app/config/sample-app-config.ts) and save as `app-config.ts` in [src/app/config](src/app/config).
Update `app-config.ts` as follows:

| Variable       | Description                                                                                                                                                                                                                                                                                                                                                                         | Comment  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| clientId       | *Client ID* from the *Client Credentials* of the [Frontend okta application](#frontend-okta-application) in the okta dashboard.                                                                                                                                                                                                                                                     |          |
| issuer         | Set to the [default authorization server](https://developer.okta.com/docs/reference/api/oidc/#_2-okta-as-the-identity-platform-for-your-app-or-api) for the okta developer account.<br/> Using *Okta domain* from the *General Settings* of the [Frontend okta application](#frontend-okta-application) in the okta dashboard, set to ``https://${yourOktaDomain}/oauth2/default``. |          |
| app            | Set to ``local`` for [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or ``session`` for [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).                                                                                                                                                              |          |
| host           | Address of the host server.                                                                                                                                                                                                                                                                                                                                                         |          |
| port           | Port of the host server.                                                                                                                                                                                                                                                                                                                                                            |          |
| protocol       | Set host protocol to ``http`` or ``https``.                                                                                                                                                                                                                                                                                                                                         |          |
| publishableKey | *Publishable key* from the *API keys* in the Stripe developer dashboard.<br/> E.g. to use the *Test Mode Standard keys* goto https://dashboard.stripe.com/test/apikeys and copy the *Publishable key*.                                                                                                                                                                              |          |


##### Hosted environment

The required configuration file `app-config.ts` will be created by the [heroku-prebuild](https://devcenter.heroku.com/articles/nodejs-support#heroku-specific-build-steps) build step.
Set the following environmental variables:

| Variable        | Description                                                                                                                                                                                                                                                                                                                            | Comment |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| OKTA_CLIENT_ID  | *Client ID* from the *Client Credentials* of the [Frontend okta application](#frontend-okta-application) in the okta dashboard.                                                                                                                                                                                                        |         |
| OKTA_DOMAIN     | Set to *Okta domain* from the *General Settings* of the [Frontend okta application](#frontend-okta-application) in the okta dashboard.<br/> This will use the [default authorization server](https://developer.okta.com/docs/reference/api/oidc/#_2-okta-as-the-identity-platform-for-your-app-or-api) for the okta developer account. |         |
| HOST_ADDR       | Address of the host server.                                                                                                                                                                                                                                                                                                            |         |
| HOST_PORT       | Port of the host server.<br/> **Note:** Use port 443 when the host is running on Heroku; i.e. `https://myapp.herokuapps.com`                                                                                                                                                                                                           |         |
| HOST_PROTOCOL   | Set host protocol to ``http`` or ``https``.                                                                                                                                                                                                                                                                                            |         |
| STRIPE_API_KEY  | *Publishable key* from the *API keys* in the Stripe developer dashboard.<br/> E.g. to use the *Test Mode Standard keys* goto https://dashboard.stripe.com/test/apikeys and copy the *Publishable key*.                                                                                                                                 |         |
|                 |                                                                                                                                                                                                                                                                                                                                        |         |
| DEBUG           | Log output to enable, e.g. `app,express:*` will enable all server related output.<br/> See [Debugging Express](https://expressjs.com/en/guide/debugging.html) and [debug](https://www.npmjs.com/package/debug).                                                                                                                        |         |
| DOMAIN          | Domain application is running in, e.g. `l2cecommercefe.onrender.com` or `localhost`.                                                                                                                                                                                                                                                   |         |
| PORT            | Port to serve application from in Heroku. Default `8080`                                                                                                                                                                                                                                                                               |         |
| ALLOWED_ORIGINS | Allowed origins for CORS configuration. Comma-separated list of domains, e.g. `https://<dev-account>.okta.com,https://<backend>.onrender.com`                                                                                                                                                                                          |         |
| SSL_ENABLED     | Set to ``true`` to enable TLS/SSL, otherwise ``false``. Default ``true``.                                                                                                                                                                                                                                                              |         |
| SSL_CRT         | Location of the Security Certificate generated in [Generate key and self-signed certificate](#generate-key-and-self-signed-certificate) relative to the project root. E.g. `"./ssl-localhost/localhost.crt"`                                                                                                                           |         |
| SSL_KEY         | Location of the Private key generated in [Generate key and self-signed certificate](#generate-key-and-self-signed-certificate) relative to the project root. E.g. `"./ssl-localhost/localhost.key"`                                                                                                                                    |         |


#### Server

##### Development

Run `npm run start_ng` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

##### Production

Run `npm start` to start the [Express](https://expressjs.com/) server.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
