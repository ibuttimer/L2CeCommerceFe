export class Address {

    street!: string;
    city!: string;
    country!: string;
    state!: string;
    zipCode!: string;
    countryCode!: string;

    /**
     * Function to use for type guard
     */
    private iAmAddress() {
        // no-op
    }

    /**
     * Address custom type guard
     */
    public static isAddress(obj: any): obj is Address {
        return (obj as Address).iAmAddress !== undefined; 
    }
}
