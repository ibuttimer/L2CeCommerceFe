import { NullTemplateVisitor } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartSummary } from 'src/app/common/cart-summary';
import { AppConstants } from 'src/app/common/constants';
import { Country } from 'src/app/common/country';
import { Subdivision } from 'src/app/common/subdivision';
import { AccessorFunction, InputItem } from 'src/app/common/input-item';
import { CartService } from 'src/app/services/cart.service';
import { CountryService } from 'src/app/services/country.service';
import { FormService, JANUARY, MonthNum } from 'src/app/services/form.service';
import { SubdivisionService } from 'src/app/services/subdivision.service';
import { ValidatorList } from 'src/app/validators/custom-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { CartItem } from 'src/app/common/cart-item';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { Address } from 'src/app/common/address';
import { appRouteUrl, PRODUCTS_ROUTE } from 'src/app/app.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthenticationStatus } from 'src/app/common/authentication-status';

import appConfig from '../../config/app-config';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  private static readonly NO_COUNTRY_CODE: string = "NO_CC";
  private static readonly NO_COUNTRY: Country = Country.of(Country.NO_COUNTRY_ID, CheckoutComponent.NO_COUNTRY_CODE, "Select country");
  private static readonly NO_SUBDIVISION: Subdivision = Subdivision.ofIdName(Subdivision.NO_SUBDIVISION_ID, "Select subdivision");

  // Form group names
  private static readonly CUSTOMER_FGN = 'customer';
  private static readonly FIRST_NAME_FGN = 'firstName';
  private static readonly LAST_NAME_FGN = 'lastName';
  private static readonly EMAIL_FGN = 'email';
  private static readonly SHIPPING_ADDR_FGN = 'shippingAddress';
  private static readonly BILLING_ADDR_FGN = 'billingAddress';
  private static readonly STREET_FGN = 'street';
  private static readonly CITY_FGN = 'city';
  private static readonly STATE_FGN = 'state';
  private static readonly COUNTRY_FGN = 'country';
  private static readonly ZIPCODE_FGN = 'zipCode';
  private static readonly ADDRESS_FGNS = [
    CheckoutComponent.SHIPPING_ADDR_FGN, CheckoutComponent.BILLING_ADDR_FGN
  ]
  
  // Input item definitions
  private firstNameII: InputItem = InputItem.text("First Name", CheckoutComponent.FIRST_NAME_FGN, "Enter first name")
                            .setRequired(true)
                            .setMinLength(2)
                            .setAccessor(() => { return this.firstName});
  private lastNameII: InputItem = InputItem.text("Last Name", CheckoutComponent.LAST_NAME_FGN, "Enter last name")
                            .setRequired(true)
                            .setMinLength(2)
                            .setAccessor(() => { return this.lastName});
  private emailII: InputItem = InputItem.email("Email", CheckoutComponent.EMAIL_FGN, "Enter email")
                            .setRequired(true)
                            .setPattern('^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\\.[a-zA-Z0-9]{2,6}$')
                            .setPatternErrorMsg(`${InputItem.REPLACE_BY_LABEL} must be a valid email address format`)
                            .setAccessor(() => { return this.email});
  private streetII: InputItem = InputItem.text("Street", CheckoutComponent.STREET_FGN, "Enter street address")
                            .setRequired(true)
                            .setMinLength(1)
                            .setAccessor(() => { return this.billingStreet});
  private cityII: InputItem = InputItem.text("City", CheckoutComponent.CITY_FGN, "Enter city")
                            .setAccessor(() => { return this.billingCity});
  private stateII: InputItem = InputItem.text("State", CheckoutComponent.STATE_FGN, "Select state")
                            .setRequired(true)
                            .setNotInvalidId(true)
                            .setAccessor(() => { return this.billingState});
  private countryII: InputItem = InputItem.text("Country", CheckoutComponent.COUNTRY_FGN, "Select country")
                            .setRequired(true)
                            .setNotInvalidId(true)
                            .setAccessor(() => { return this.billingCountry});
  private zipCodeII: InputItem = InputItem.text("Zip code", CheckoutComponent.ZIPCODE_FGN, "Enter zip code")
                            .setRequired(true)
                            .setMinLength(1)
                            .setAccessor(() => { return this.billingZipcode});
                      
  checkoutFormGroup!: FormGroup;
  countries: Country[] = [CheckoutComponent.NO_COUNTRY];     // list of countries
  shippingSubdivisions: Subdivision[] = [CheckoutComponent.NO_SUBDIVISION];     // list of subdivisions for shipping address
  billingSubdivisions: Subdivision[] = [CheckoutComponent.NO_SUBDIVISION];     // list of subdivisions for billing address
  shippingIsBilling: boolean = false; // shipping & billing address are same flag

  cartSummary: CartSummary = CartSummary.EMPTY_CART;

  authStatus: AuthenticationStatus = AuthenticationStatus.LOGGED_OUT_STATUS;

  isDisabled: boolean = true;   // submit payment button enabled/disabled status
  cardComplete: boolean = false;

  // initialise Stripe api
  stripe = Stripe(appConfig.stripe.publishableKey);

  paymentInfo: PaymentInfo = PaymentInfo.of(0, AppConstants.CURRENCY_CODE, "");
  cardElement: any;
  displayCardError: HTMLElement | null = null;  // error for card details

  constructor(private countryService: CountryService,
              private subdivisionService: SubdivisionService,
              private cartService: CartService,
              private formService: FormService,
              private checkoutService: CheckoutService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private builder: FormBuilder,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    // build the form
    this.checkoutFormGroup = this.builder.group({
      customer: this.builder.group({
        firstName: new FormControl('', this.firstNameII.validatorList().list),
        lastName: new FormControl('', this.lastNameII.validatorList().list),
        email: new FormControl('', this.emailII.validatorList().list),

      }),
      shippingAddress: this.builder.group({
        street: new FormControl('', this.streetII.validatorList().list),
        city: new FormControl('', this.cityII.validatorList().list),
        state: new FormControl('', this.stateII.validatorList().list),
        country: new FormControl('', this.countryII.validatorList().list),
        zipCode: new FormControl('', this.zipCodeII.validatorList().list),
        }),
      billingAddress: this.builder.group({
        street: new FormControl('', this.streetII.validatorList().list),
        city: new FormControl('', this.cityII.validatorList().list),
        state: new FormControl('', this.stateII.validatorList().list),
        country: new FormControl('', this.countryII.validatorList().list),
        zipCode: new FormControl('', this.zipCodeII.validatorList().list),
        })
    });

    this.setupStripePaymentForm();
    
    this.setSelectCountry();
    this.setSelectSubdivisions();

    this.listCountries();
    this.updateCartStatus();
    this.reviewCartDetails();
    this.userDetails();
  }

  setupStripePaymentForm() {
    // https://stripe.com/docs/payments/card-element

    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', {
      hidePostalCode: true
    });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: { empty: boolean; complete: any; error: { message: string | null; }; }) => {

      // Disable the Pay button if card details in the Element are not complete
      this.cardComplete = event.complete;
      this.disableSubmit(!this.cardComplete);

      this.displayCardError = document.getElementById('card-errors');
      if (this.displayCardError != null) {
        if (event.complete) { 
          this.displayCardError.textContent = '';
        } else if (event.error) { 
          this.displayCardError.textContent = event.error.message;
        }
      }
    });

  }

  /**
   * Subscribe to countries list
   */
  listCountries() {
    this.countryService.getCountriesList().subscribe(
      data => {
        console.log('Countries=' + JSON.stringify(data));
        this.countries = [CheckoutComponent.NO_COUNTRY].concat(data);
        this.setSelectCountry();
      }
    );
  }

  /**
   * Subscribe to cart summary
   */
  reviewCartDetails() {
    this.cartService.summary.subscribe(
      data => this.cartSummary = data
    );
  }

  /**
   * Subscribe to user details
   */
   userDetails() {
    this.authenticationService.status.subscribe(
      data => {
        this.authStatus = data;

        this.fillUserDetails();
      }
    );
  }

  /**
   * Fill user details with current user
   */
   fillUserDetails() {
      this.firstName?.setValue(this.authStatus.firstName);
      this.lastName?.setValue(this.authStatus.lastName);
      this.email?.setValue(this.authStatus.email);
  }

  /**
   * Set value of form group element to initial value in specified list
   * @param formGroupName 
   * @param elementName 
   * @param list 
   */
  setFormGroupList(formGroupName: string, elementName: string, list: any[]) {
    this.checkoutFormGroup.get(formGroupName)?.get(elementName)?.setValue(list[0]);
  }

  setSelectCountry() {
    CheckoutComponent.ADDRESS_FGNS.forEach(formGroupName => {
      this.setFormGroupList(formGroupName, CheckoutComponent.COUNTRY_FGN, this.countries);
    });
  }

  setSelectSubdivisions() {
    CheckoutComponent.ADDRESS_FGNS.forEach(formGroupName => {
      this.setSelectSubdivision(formGroupName, true);
    });
  }

  setSelectSubdivision(formGroupName: string, reset: boolean) {
    if (reset) {
      if (formGroupName == CheckoutComponent.SHIPPING_ADDR_FGN) {
        this.shippingSubdivisions = [CheckoutComponent.NO_SUBDIVISION];
      } else {
        this.billingSubdivisions = [CheckoutComponent.NO_SUBDIVISION];
      }
    }
    let list = formGroupName == CheckoutComponent.SHIPPING_ADDR_FGN ? this.shippingSubdivisions : this.billingSubdivisions;
    this.setFormGroupList(formGroupName, CheckoutComponent.STATE_FGN, list);
  }

  /**
   * Subscribe to cart summary
   */
  updateCartStatus() {
    this.cartService.summary.subscribe(
      data => this.cartSummary = data
    );
  }

  /**
   * Get subdivisions for the country selected in the specified form group
   * @param formGroupName name of form group to update subdivisions for
   */
  getSubdivisions(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    if (formGroup != null) {
      const countryCode = formGroup?.value.country.code;
      let subdivisions: Subdivision[] = [CheckoutComponent.NO_SUBDIVISION]

      if (countryCode === CheckoutComponent.NO_COUNTRY_CODE) {
        this.setSubdivisions(formGroupName, subdivisions);
      } else {
        this.subdivisionService.getCountrySubdivisions(countryCode).subscribe(
          data => {
            console.log(`Subdivisions[${formGroupName}]=${JSON.stringify(data)}`);
            this.setSubdivisions(formGroupName, subdivisions.concat(data));
          }
        );
      }
    }
  }

  setSubdivisions(formGroupName: string, list: Subdivision[]) {
    let wasSet = true;
    if (formGroupName == CheckoutComponent.SHIPPING_ADDR_FGN) {
      this.shippingSubdivisions = list;
    } else if (formGroupName == CheckoutComponent.BILLING_ADDR_FGN) {
      this.billingSubdivisions = list;
    } else {
      wasSet = false;
    }
    if (wasSet) {
      this.setFormGroupList(formGroupName, CheckoutComponent.STATE_FGN, list);
    }
  }

  /**
   * Update billing/shipping address is the same flag
   * @param sameAddr 
   */
  shippingBillingChange(sameAddr: boolean) {
    if (sameAddr) {
      this.billingSubdivisions = this.shippingSubdivisions;
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.setFormGroupList(CheckoutComponent.BILLING_ADDR_FGN, CheckoutComponent.COUNTRY_FGN, this.countries);
      this.setSelectSubdivision(CheckoutComponent.BILLING_ADDR_FGN, true)
    }
    this.shippingIsBilling = sameAddr;
    console.log("shippingIsBilling " + this.shippingIsBilling);
    this.changeDetector.detectChanges();

    this.disableSubmit(!sameAddr);
  }


  getFormGroup(element: string): AbstractControl | null {
    return this.checkoutFormGroup.get(element)
  }

  get firstName(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.CUSTOMER_FGN}.${CheckoutComponent.FIRST_NAME_FGN}`)
  }

  get lastName(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.CUSTOMER_FGN}.${CheckoutComponent.LAST_NAME_FGN}`)
  }

  get email(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.CUSTOMER_FGN}.${CheckoutComponent.EMAIL_FGN}`)
  }

  get billingStreet(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.BILLING_ADDR_FGN}.${CheckoutComponent.STREET_FGN}`)
  }

  get billingCity(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.BILLING_ADDR_FGN}.${CheckoutComponent.CITY_FGN}`)
  }

  get billingState(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.BILLING_ADDR_FGN}.${CheckoutComponent.STATE_FGN}`)
  }

  get billingCountry(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.BILLING_ADDR_FGN}.${CheckoutComponent.COUNTRY_FGN}`)
  }

  get billingZipcode(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.BILLING_ADDR_FGN}.${CheckoutComponent.ZIPCODE_FGN}`)
  }

  get shippingStreet(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.SHIPPING_ADDR_FGN}.${CheckoutComponent.STREET_FGN}`)
  }

  get shippingCity(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.SHIPPING_ADDR_FGN}.${CheckoutComponent.CITY_FGN}`)
  }

  get shippingState(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.SHIPPING_ADDR_FGN}.${CheckoutComponent.STATE_FGN}`)
  }

  get shippingCountry(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.SHIPPING_ADDR_FGN}.${CheckoutComponent.COUNTRY_FGN}`)
  }

  get shippingZipcode(): AbstractControl | null {
    return this.getFormGroup(`${CheckoutComponent.SHIPPING_ADDR_FGN}.${CheckoutComponent.ZIPCODE_FGN}`)
  }

  get customerSettings() {
    return [
      this.firstNameII,
      this.lastNameII,
      this.emailII,
    ];
  }

  get billingSettings() {
    return [
      this.streetII,
      this.cityII,
      this.stateII,
      this.countryII,
      this.zipCodeII,
    ];
  }

  get shippingSettings() {
    let settings: InputItem[] = [];
    this.billingSettings.forEach(element => {
      let shippingII: InputItem = element.copy();
      let accessor: AccessorFunction | null = null;
      switch (shippingII.ctrlName) {
        case CheckoutComponent.STREET_FGN:
          accessor = () => { return this.shippingStreet};
          break;
        case CheckoutComponent.CITY_FGN:
          accessor = () => { return this.shippingCity};
          break;
        case CheckoutComponent.STATE_FGN:
          accessor = () => { return this.shippingState};
          break;
        case CheckoutComponent.COUNTRY_FGN:
          accessor = () => { return this.shippingCountry};
          break;
        case CheckoutComponent.ZIPCODE_FGN:
          accessor = () => { return this.shippingZipcode};
          break;
      }
      if (accessor != null) {
        shippingII.setAccessor(accessor);
        settings.push(
            shippingII
          );
      }
    });
    return settings;
  }


  onSubmit() {
    console.log("purchase");

    if (this.shippingIsBilling) {
      // re-copy shipping to billing to make sure any changes since box was checked are captured
      this.shippingBillingChange(this.shippingIsBilling)
    }

    if (this.displayCardError == null) {
      this.displayCardError = document.getElementById('card-errors');
      if (this.displayCardError != null) {
        this.displayCardError.textContent = 'Card information required';
      }
    }

    if (!this.checkoutFormGroup.invalid && this.displayCardError?.textContent === '') {

      [CheckoutComponent.CUSTOMER_FGN, 
        CheckoutComponent.SHIPPING_ADDR_FGN, 
        CheckoutComponent.BILLING_ADDR_FGN].forEach(element => {
          console.log(`${element}: `);
          console.log(this.checkoutFormGroup.get(element)?.value);
      });

      let order: Order = new Order();
      order.totalPrice = this.cartSummary.totalPrice;
      order.totalQuantity = this.cartSummary.totalQuantity;

      const cartItems: CartItem[] = this.cartService.cartItems;
      let orderItems:  OrderItem[] = cartItems.map(item => new OrderItem(item));

      let purchase: Purchase = new Purchase();

      purchase.customer = this.checkoutFormGroup.controls[CheckoutComponent.CUSTOMER_FGN].value;
      purchase.shippingAddress = this.getAddress(CheckoutComponent.SHIPPING_ADDR_FGN);
      purchase.billingAddress = this.getAddress(CheckoutComponent.BILLING_ADDR_FGN);
      purchase.order = order;
      purchase.orderItems = orderItems;

      this.paymentInfo.amount = Math.round(this.cartSummary.totalPrice * AppConstants.CURRENCY_UNITS);
      this.paymentInfo.receiptEmail = purchase.customer.email;

      console.log(`totalPrice ${this.cartSummary.totalPrice} -> ${this.paymentInfo.amount}`);
      
      this.disableSubmit(true);

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe((paymentIntentResp) => {

          this.stripe.confirmCardPayment(paymentIntentResp.client_secret, {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  address: {
                    city: purchase.billingAddress.city,
                    country: purchase.billingAddress.countryCode,
                    line1: purchase.billingAddress.street,
                    // line2: null,
                    postal_code: purchase.billingAddress.zipCode,
                    state: purchase.billingAddress.state
                  },
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`
                }
              }
            }, { handleActions: false}
          ).then((result: { error: { message: any; }; }) => {

            this.disableSubmit(false);

            if (result.error) {
              alert(`Error: ${result.error.message}`);
            } else {
              this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                  alert(`Your order has been received.\nYour order number is ${response.orderTrackingNumber}`);

                  this.resetCart();
                },
                error: err => {
                  alert(`Error: ${err.message}`);
                }
              });
            }
          });
      });
    } else {
      // to display all error messages
      this.checkoutFormGroup.markAllAsTouched();
    }
  }


  resetCart() {
    this.cartService.emptyCart();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl(appRouteUrl(PRODUCTS_ROUTE));
  }


  getAddress(formGroupName: string): Address {
    let ctrlValue = this.checkoutFormGroup.controls[formGroupName].value;
    const subdivision: Subdivision = JSON.parse(JSON.stringify(ctrlValue.state));
    const country: Country = JSON.parse(JSON.stringify(ctrlValue.country));
    
    let address: Address = new Address();
    address.street = ctrlValue.street;
    address.city = ctrlValue.city;
    address.state = subdivision.name;
    address.country = country.name;
    address.countryCode = country.code;
    address.zipCode = ctrlValue.zipCode;

    return address;
  }


  disableSubmit(disableSubmit: boolean) {
    var button: HTMLElement | null = document.getElementById('purchase_button');

    // disable submit button if form or card is not valid
    this.isDisabled = disableSubmit || !this.checkoutFormGroup.valid || !this.cardComplete;

    // Disable the button when loading
    // if (button instanceof HTMLButtonElement) {
    //   (button as HTMLButtonElement).disabled = disableSubmit;
    // }
    this.hiddenClass(document.querySelector("#button-text"), this.isDisabled)
  }

  hiddenClass(element: Element | null, hide: boolean) {
    if (element != null) {
      if (hide) {
        element.classList.add("hidden");
      } else {
        element.classList.remove("hidden");
      }
    }
  }

  /** Get the currency code */
  get currencyCode(): string {
    return AppConstants.CURRENCY_CODE;
  }

}

