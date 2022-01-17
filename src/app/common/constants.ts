/**
 * Interface for components to implement to allow access to global constants
 */
export declare interface Constants {
    /**
     * Currency code accessor
     */
    get currencyCode(): string;
}

/**
 * Globals constants
 */
export class AppConstants {

    public static CURRENCY_CODE: string = "EUR";
    public static CURRENCY_UNITS: number = 100;
}

