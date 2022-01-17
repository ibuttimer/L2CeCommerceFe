export class CartSummary {

    static readonly EMPTY_CART = new CartSummary(0, 0);

    totalPrice: number;
    totalQuantity: number;

    constructor(price: number, quantity: number) {
        this.totalPrice = price;
        this.totalQuantity = quantity;
    }

    reset() {
        this.totalPrice = 0;
        this.totalQuantity = 0;
    }

    get isEmpty(): boolean {
        return this.totalQuantity == 0;
    }
}
