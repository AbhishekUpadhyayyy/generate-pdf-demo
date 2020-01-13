public without sharing class PDF_GenerateVFController {
    
    public String PDFData {get; set;} 

    //Method to save content version
    public Pagereference printPdf (){
        System.debug( 'Inside printPdf ');
        PageReference ref = Page.PDF_GenerateVFPage;
        Blob b = ref.getContentAsPDF();
        System.debug( 'get content '+ref.getContent() );
        System.debug( 'Blob value of pdf chart '+ b);
        ContentVersion contentVersion = new ContentVersion(
                                                            Title = 'Age Chart PDF',
                                                            PathOnClient = 'AgeChart.pdf',
                                                            VersionData = b,
                                                            IsMajorVersion = true
                                                          );
        insert contentVersion;           
        System.debug( 'content document id => '+ [ SELECT id,ContentDocumentId,CreatedDate FROM ContentVersion WHERE id = : contentVersion.Id ]);                                        
        return null;
    }

}
