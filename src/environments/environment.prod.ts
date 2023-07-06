export const environment = {
  production: true,

  // environment variables to be retrieved by ng-process-env in postinstall
  envVar: {
    L2C_HOST_ADDR: "host",
    L2C_HOST_PORT: "443",
    L2C_HOST_PROTOCOL: "https",
    L2C_API_BASE_PATH: "/api",
    L2C_OKTA_CLIENT_ID: "okta_client_id",
    L2C_OKTA_DOMAIN: "okta_domain",
    L2C_STRIPE_API_KEY: "stripe_api_key"
  }

};
