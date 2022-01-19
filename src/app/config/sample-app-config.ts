export default {
    oidc: {
        clientId: "<Client ID of okta application>",
        issuer: "https://<okta domain>/oauth2/default",
        redirectUri: window.location.origin + "/login/callback",
        scopes: ["openid", "profile", "email"]
    },
    app: {
        // set to 'local' or 'session'
        storage: "local",
        // set to host address
        host: "<address of host>",
        // set to host port
        port: "<host port>",
        // set to host protocol; 'http' or 'https'
        protocol: "<host protocol>"
    },
    stripe: {
        // set Publishable key from Stripe API keys
        publishableKey: "<Publishable key from Stripe API keys>"
    }
}
