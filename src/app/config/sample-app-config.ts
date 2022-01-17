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
        host: "<address of host>",
        port: "<host port>",
        // set to 'http' or 'https'
        protocol: "https"

    },
    stripe: {
        // set Publishable key from Stripe API keys
        publishableKey: "<Publishable key from Stripe API keys>"    
    }
}
