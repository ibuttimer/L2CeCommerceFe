import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

    customer!: Customer;
    shippingAddress!: Address;
    billingAddress!: Address;
    order!: Order;
    orderItems!: OrderItem[];


    /**
     * Function to use for type guard
     */
    private iAmPurchase() {
        // no-op
    }

    /**
     * Purchase custom type guard
     */
    public static isPurchase(obj: any): obj is Purchase {
        return (obj as Purchase).iAmPurchase !== undefined; 
    }
}
