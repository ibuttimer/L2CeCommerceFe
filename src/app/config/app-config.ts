import { environment } from '../../environments/environment';

export default {
    oidc: {
        clientId: environment.envVar.L2C_OKTA_CLIENT_ID,
        issuer: `https://${environment.envVar.L2C_OKTA_DOMAIN}/oauth2/default`,
        redirectUri: window.location.origin + "/login/callback",
        scopes: ["openid", "profile", "email"]
    },
    widget: {
      // set to 'false' to use new Okta Identity Engine
      USE_CLASSIC_ENGINE: "true",
    },
    app: {
        // set to 'local' (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
        // or 'session' (https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
        storage: "local",
        // set to host address
        host: environment.envVar.L2C_HOST_ADDR,
        // set to host port
        port: environment.envVar.L2C_HOST_PORT,
        // set to host protocol; 'http' or 'https'
        protocol: environment.envVar.L2C_HOST_PROTOCOL,
        // base url of api
        apiUrl: `${environment.envVar.L2C_HOST_PROTOCOL}://${environment.envVar.L2C_HOST_ADDR}:${environment.envVar.L2C_HOST_PORT}${environment.envVar.L2C_API_BASE_PATH}`
    },
    stripe: {
        // set Publishable key from Stripe API keys
        publishableKey: environment.envVar.L2C_STRIPE_API_KEY
    }
}
