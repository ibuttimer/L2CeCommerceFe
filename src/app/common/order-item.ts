import { CartItem } from "./cart-item";

export class OrderItem {

    imageUrl!: string;
    quantity!: number;
    unitPrice!: number;
    productId!: number;

    constructor(cartItem: CartItem) {
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }


    /**
     * Function to use for type guard
     */
    private iAmOrderItem() {
        // no-op
    }

    /**
     * OrderItem custom type guard
     */
    public static isOrderItem(obj: any): obj is OrderItem {
        return (obj as OrderItem).iAmOrderItem !== undefined; 
    }

}
