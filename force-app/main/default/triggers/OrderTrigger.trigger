trigger OrderTrigger on Pizza__C (before update) {

    // System.debug(Trigger.new);
    // System.debug(Trigger.old);

    for(Pizza__C pizza: Trigger.new){

        if(pizza.Coupon__c != ''){
            switch on pizza.Coupon__c {
                when 'FRE-000' {
                    pizza.Price__c = 0;
                }
                when 'DIS-005' {
                    pizza.Price__c = pizza.Price__c - (pizza.Price__c/100) * 5;
                }
                when 'OFF-010' {
                    pizza.Price__c = pizza.Price__c - (Pizza.price__c/100) * 10;
                }
            }
        }

    }

}