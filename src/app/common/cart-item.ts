import { Product } from "./product";

export class CartItem {
    id!: number;
    name!: string;
    unitPrice!: number;
    imageUrl!: string;
    quantity!: number;
    unitsInStock!: number;


    init(id: number, name: string, unitPrice: number, imageUrl: string, quantity: number, unitsInStock: number) {
        this.id = id;
        this.name = name;
        this.unitPrice = unitPrice;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.unitsInStock = unitsInStock;
    }

    static ofProduct(product: Product) {
        let item = new CartItem();
        item.init(product.id, product.name, product.unitPrice, product.imageUrl, 1, product.unitsInStock);
        return item;
    }

    static fromObj(obj: Object): CartItem {
        let result: CartItem = new CartItem();
        result.init(0, '', 0, '', 0, 0);
        for (const keyVal of Object.entries(obj)) {
            if(result.hasOwnProperty(keyVal[0])){
                switch (keyVal[0]) {
                    case 'id':
                        result.id = keyVal[1];
                        break;
                    case 'name':
                        result.name = keyVal[1];
                        break;
                    case 'unitPrice':
                        result.unitPrice = keyVal[1];
                        break;
                    case 'imageUrl':
                        result.imageUrl = keyVal[1];
                        break;
                    case 'quantity':
                        result.quantity = keyVal[1];
                        break;
                    case 'unitsInStock':
                        result.unitsInStock = keyVal[1];
                        break;
                    default:
                        break;
                }
            }
        }
        return result;
    }

    /**
     * Get cart item total price
     */
    get totalPrice(): number {
        return this.unitPrice * this.quantity;
    }

    /**
     * Check if quantity is min allowed
     */
     get isMin(): boolean {
        return this.quantity == 1;
    }

    /**
     * Check if quantity is max allowed
     */
     get isMax(): boolean {
        return this.quantity == this.unitsInStock;
    }
}
