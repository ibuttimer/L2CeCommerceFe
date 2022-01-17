export class PaymentInfo {
    
    // A positive integer representing how much to charge in the smallest currency unit 
    amount!: number;
    currency!: string;
    receiptEmail!: string;

    public static of(amount: number, currency: string, receiptEmail: string) : PaymentInfo {
        let paymentInfo: PaymentInfo = new PaymentInfo();
        paymentInfo.amount = amount;
        paymentInfo.currency = currency;
        paymentInfo.receiptEmail = receiptEmail;
        return paymentInfo;
    }

    /**
     * Function to use for type guard
     */
     private iAmPaymentInfo() {
        // no-op
    }

    /**
     * PaymentInfo custom type guard
     */
    public static isPaymentInfo(obj: any): obj is PaymentInfo {
        return (obj as PaymentInfo).iAmPaymentInfo !== undefined; 
    }
}
