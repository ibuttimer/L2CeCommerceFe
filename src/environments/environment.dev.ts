// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // environment variables to be retrieved by ng-process-env in postinstall
  envVar: {
    L2C_HOST_ADDR: "localhost",
    L2C_HOST_PORT: "8443",
    L2C_HOST_PROTOCOL: "https",
    L2C_API_BASE_PATH: "/api",
    L2C_OKTA_CLIENT_ID: "okta_client_id",
    L2C_OKTA_DOMAIN: "okta_domain",
    L2C_STRIPE_API_KEY: "stripe_api_key"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
