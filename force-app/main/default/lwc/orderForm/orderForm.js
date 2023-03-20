import { LightningElement, wire } from 'lwc';
import getAccounts from "@salesforce/apex/OrderController.getAccounts";
import placeOrder from "@salesforce/apex/OrderController.placeOrder";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrderForm extends LightningElement {
    price = 99;
    pizza = "Margherita Pizza";
    quantity = 1;
    size = "Regular";
    toppings = "No Toppings"
    toppingsPrice = 0;
    accountId = this.accounts ? this.accounts[0].Id : "No Account";
    coupon = "NIL"

    isDiscounted = false;

    title = "Successfull!";
    message = "Order Placed!";
    variant = "success";

    @wire(getAccounts)
    accounts;

    showNotification() {
        const evt = new ShowToastEvent({
            title: this._title,
            message: this.message,
            variant: this.variant,
        });
        this.dispatchEvent(evt);
    }

    getToppingsPrice(){
        switch(this.toppings){
            case "Black Olives":
                this.toppingsPrice = 30;
                break;
            case "Crisp Capsicum":
                this.toppingsPrice = 20;
                break;
            case "Paneer":
                this.toppingsPrice = 40;
                break;
            case "Mozzarella":
                this.toppingsPrice = 35;
                break;
            case "Pecorino":
                this.toppingsPrice = 50;
                break;
            case "Parmesan":
                this.toppingsPrice = 50;
                break;
            case "No Toppings":
                this.toppingsPrice = 0;
                break;
        }
    }

    handleToppingsChange(e){
        this.toppings = e.target.value;
        this.getPrice();
        this.getToppingsPrice();
    }

    handleQuantityChange(e){
        this.quantity = e.target.value;
        this.getPrice();
        this.price = this.price * this.quantity;
    }

    handleCouponChange(e){
        this.coupon = e.target.value;
        this.getPrice();
        console.log(this.coupon);
    }

    handleAccountChange(e){
        this.accountId = e.target.value;
        console.log(this.accountId);
    }


    handlePizzaChange(e) {
        this.pizza = e.target.value;
        this.getPrice();
        console.log(this.pizza);
    }

    handleSizeChange(e){
        this.size = e.target.value;
        console.log(this.size);
        this.getPrice();
    }

    getPrice(){
        switch (this.pizza) {
            case "Margherita Pizza":
                if(this.size == "Regular"){
                    this.price = 99;
                }else if(this.size == "Medium"){
                    this.price = 199;
                }else {
                    this.price = 399;
                }
                break;
            case "Cheese n Corn Pizza":
                if(this.size == "Regular"){
                    this.price = 169;
                }else if(this.size == "Medium"){
                    this.price = 309;
                }else {
                    this.price = 499;
                }
                break;
            case "Cheese n Tomato Pizza":
                if(this.size == "Regular"){
                    this.price = 169;
                }else if(this.size == "Medium"){
                    this.price = 309;
                }else {
                    this.price = 499;
                }
                break;
            case "Double Cheese Margherita Pizza":
                if(this.size == "Regular"){
                    this.price = 189;
                }else if(this.size == "Medium"){
                    this.price = 339;
                }else {
                    this.price = 539;
                }
                break;
            case "Fresh Veggie Pizza":
                if(this.size == "Regular"){
                    this.price = 189;
                }else if(this.size == "Medium"){
                    this.price = 339;
                }else {
                    this.price = 539;
                }
                break;
            case "Farmhouse Pizza":
                if(this.size == "Regular"){
                    this.price = 229;
                }else if(this.size == "Medium"){
                    this.price = 399;
                }else {
                    this.price = 599;
                }
                break;
            case "Peppy Paneer Pizza":
                if(this.size == "Regular"){
                    this.price = 229;
                }else if(this.size == "Medium"){
                    this.price = 399;
                }else {
                    this.price = 599;
                }
                break;
            case "Veggie Paradise Pizza":
                if(this.size == "Regular"){
                    this.price = 229;
                }else if(this.size == "Medium"){
                    this.price = 399;
                }else {
                    this.price = 599;
                }
                break;
            case "Veg Extravaganza Pizza":
                if(this.size == "Regular"){
                    this.price = 249;
                }else if(this.size == "Medium"){
                    this.price = 459;
                }else {
                    this.price = 699;
                }
                break;
            case "Cheese Dominator Pizza":
                if(this.size == "Regular"){
                    this.price = 319;
                }else if(this.size == "Medium"){
                    this.price = 579;
                }else {
                    this.price = 839;
                }
                break;
        
            default:
                console.log('default');
                break;
        }

        if(this.coupon == "DIS-005"){
            this.price = (this.price) - ((this.price*5)/100);
        }else if(this.coupon == "OFF-010"){
            this.price = (this.price) - ((this.price*10)/100);
        }else if(this.coupon == "FRE-000"){
            this.price = 0 + this.toppingsPrice;
        }

        console.log(this.price);
    }

    async handleOrder(e){

        e.preventDefault();

        this.getToppingsPrice();
        this.price = this.price + this.toppingsPrice;

        placeOrder({accountId: this.accountId, pizza: {
            Pizza__c: this.pizza,
            Size__c: this.size,
            Price__c: this.price,
            Quantity__c: this.quantity,
            Toppings__c: this.toppings,
            Coupon__c: this.coupon ? this.coupon : ''
        }})
        .then((data) => {this.showNotification(); document.querySelector("form").reset();})
        .error((error) => console.log(error));

    }
}