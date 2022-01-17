import { UserClaims } from '@okta/okta-auth-js';

export class AuthenticationStatus {

    isAuthenticated: boolean | undefined;
    fullName: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
  
    constructor() {
        this.reset();
    }

    init(isAuthenticated: boolean, fullName: string, firstName: string, lastName: string, email: string) {
        this.isAuthenticated = isAuthenticated;
        this.fullName = fullName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    static ofUserClaims(claims: UserClaims): AuthenticationStatus {
        let status: AuthenticationStatus = new AuthenticationStatus();
        status.setFromUserClaims(claims);
        return status;
    }

    setFromUserClaims(claims: UserClaims) {
        this.init(this.isAuthenticated!, 
            claims.name ? claims.name : '', 
            claims.given_name ? claims.given_name : '', 
            claims.family_name ? claims.family_name : '', 
            claims.email ? claims.email : ''
        );
    }

    reset() {
        this.init(false, '', '', '', '');
    }

    get isLoggedIn() {
        return this.isAuthenticated && this.fullName;
    }

    public static LOGGED_OUT_STATUS: AuthenticationStatus;

    static initialise() {
        let loggedOut: AuthenticationStatus = new AuthenticationStatus();
        loggedOut.reset()
    
        AuthenticationStatus.LOGGED_OUT_STATUS = loggedOut;
    }
}

AuthenticationStatus.initialise();
