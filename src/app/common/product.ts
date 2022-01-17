export class Product {
    id!: number;
    sku!: string;
    name!: string;
    description!: string;
    unitPrice!: number;
    imageUrl!: string;
    active!: boolean;
    unitsInStock!: number;
    dateCreated!: Date;
    lastUpdated!: Date;


    /**
     * Function to use for type guard
     */
    private iAmProduct() {
        // no-op
    }

    /**
     * Product custom type guard
     */
    public static isProduct(obj: any): obj is Product {
        return (obj as Product).iAmProduct !== undefined;
    }

    public static EMPTY_PRODUCT: Product;

    static initialise() {
        let product: Product = new Product();
        product.id = 0;
        product.sku = "";
        product.name = "";
        product.description = "";
        product.unitPrice = 0;
        product.imageUrl = "";
        product.active = false;
        product.unitsInStock = 0;
        product.dateCreated = new Date();
        product.lastUpdated = product.dateCreated;
    
        Product.EMPTY_PRODUCT = product;
    }
}

Product.initialise();
