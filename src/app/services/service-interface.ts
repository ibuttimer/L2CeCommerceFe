export interface ServiceInterface {

    /** Get the list of secured endpoints for the service */
    get securedEndpoints(): string[];
}
