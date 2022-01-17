export class Order {

    totalQuantity!: number;
    totalPrice!: number;

    /**
     * Function to use for type guard
     */
    private iAmOrder() {
        // no-op
    }

    /**
     * Order custom type guard
     */
    public static isOrder(obj: any): obj is Order {
        return (obj as Order).iAmOrder !== undefined; 
    }

}
