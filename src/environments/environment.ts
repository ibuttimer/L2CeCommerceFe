// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import appConfig from '../app/config/app-config';

export const environment = {
  production: false,

  // set to base url of backend server, e.g. 'http://localhost:8082/api'
  apiUrl: `${appConfig.app.protocol}://${appConfig.app.host}:${appConfig.app.port}/api`

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
