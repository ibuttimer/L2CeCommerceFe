import appConfig from '../app/config/app-config';

export const environment = {
  production: true,

  // set to base url of backend server, e.g. 'http://localhost:8082/api'
  apiUrl: `${appConfig.app.protocol}://${appConfig.app.host}:${appConfig.app.port}/api`

};
