export class Customer {

    firstName!: string;
    lastName!: string;
    email!: string;

    /**
     * Function to use for type guard
     */
    private iAmCustomer() {
        // no-op
    }

    /**
     * Customer custom type guard
     */
    public static isCustomer(obj: any): obj is Customer {
        return (obj as Customer).iAmCustomer !== undefined; 
    }

}
