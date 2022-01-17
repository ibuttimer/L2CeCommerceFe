export class OrderHistory {
    id!: string;
    orderTrackingNumber!: string;
    totalPrice!: number;
    totalQuantity!: number;
    dateCreated!: Date;

    /**
     * Function to use for type guard
     */
     private iAmOrderHistory() {
        // no-op
    }

    /**
     * OrderHistory custom type guard
     */
    public static isOrderHistory(obj: any): obj is OrderHistory {
        return (obj as OrderHistory).iAmOrderHistory !== undefined; 
    }

}
