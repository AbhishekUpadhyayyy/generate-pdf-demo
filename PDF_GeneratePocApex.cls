public without sharing class PDF_GeneratePocApex {
    
    //Method to fetch accounts
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(){
        return [ SELECT Id,Name,( SELECT Id,Name,Age__c FROM Contacts ) FROM Account LIMIT 10 ];
    }
} 
