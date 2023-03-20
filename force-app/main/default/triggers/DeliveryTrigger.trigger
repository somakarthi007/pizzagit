trigger DeliveryTrigger on PizzaOrder__C (before update) {
    for(PizzaOrder__c pizzaOrder: Trigger.new){
        if(pizzaOrder.Delivery_Status__c == 'Delivered'){

            String toEmail = '';

            String toEmailAddress = [SELECT Email__c FROM Account WHERE Id= :pizzaOrder.AccountId__c][0].Email__c;
            Pizza__C pizza = [SELECT Id FROM Pizza__C WHERE Id= :pizzaOrder.PizzaId__c][0];

            if(toEmailAddress != null){
                toEmail = toEmailAddress;
            }

            System.debug(toEmail);

            if(toEmail != null){
                String subject = 'Pizza Delivery Status';

                String body = 'Your Pizza Order has been Successfully Deliverd! \n';
    
                body += 'Pizza: ' + pizza.Pizza__c + '\n';
                body += 'Quantity: ' + pizza.Quantity__c + '\n';
                body += 'Size: ' + pizza.Size__c + '\n';
                body += 'Toppings: ' + pizza.Toppings__c + '\n';
                body += 'Coupon: ' + pizza.Coupon__c + '\n';
                body += 'Total: ' + pizza.Price__c + '\n';
    
                body += 'Thank you for ordering with us! Enjoy your Pizza!! ' + '\n';

                System.debug(toEmail);
                System.debug(subject);
                System.debug(body);

                EmailManager em = new EmailManager();
                em.sendMail(toEmail, subject, body); 
            }  


        }
    }
}