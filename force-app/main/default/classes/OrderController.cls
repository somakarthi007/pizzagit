public with sharing class OrderController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        List<Account> accounts = new List<Account>();
        try{
            accounts = [SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 10 ];
            System.debug(accounts);
        }catch(Exception e){
            System.debug(e.getMessage());
        }
        return accounts;
    }

    @AuraEnabled
    public static String placeOrder(String accountId, Pizza__C pizza){
        try {
            System.debug(accountId);
            System.debug(pizza);

            // if(pizza.Coupon__c != ''){
            //     switch on pizza.Coupon__c {
            //         when 'FRE-000' {
            //             pizza.Price__c = 0;
            //         }
            //         when 'DIS-005' {
            //             pizza.Price__c = pizza.Price__c - (pizza.Price__c/100) * 5;
            //         }
            //         when 'OFF-010' {
            //             pizza.Price__c = pizza.Price__c - (Pizza.price__c/100) * 10;
            //         }
            //     }
            // }

            insert pizza;

            PizzaOrder__C pizzaOrder = new PizzaOrder__C(AccountId__c=accountId, PizzaId__c=pizza.Id);

            System.debug(pizzaOrder);

            insert pizzaOrder;

            String toEmail = '';

            String toEmailAddress = [SELECT Email__c FROM Account WHERE Id= :accountId][0].Email__c;

            if(toEmailAddress != null){
                toEmail = toEmailAddress;
            }

            System.debug(toEmail);

            if(toEmail != null){
                String subject = 'Your Pizza Order';

                String body = 'Your Pizza Order has been Successfully Placed! \n';
    
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

            return 'Success';

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    
}