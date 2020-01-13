/* eslint-disable no-console */
import { LightningElement, wire, track } from 'lwc';
import getAccount from '@salesforce/apex/PDF_GeneratePocApex.getAccount'
import { loadScript } from 'lightning/platformResourceLoader';
import highChart from '@salesforce/resourceUrl/PDF_Libs'; 

export default class PdfGeneratePoc extends LightningElement {

    @track isShowRadioGroup = false;
    @track radioGroupList; 
    @track selectedAccountId = '';
    @track accountList = [];
    @track options = [];
    @track isShowPDFButton = true;

    connectedCallback() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    handleResize(){
        console.log( 'inside handleResize ');
        this.drawChart ( this.selectedAccountId );
    }
    renderedCallback() {
        console.log( 'Inside render callback ');
        Promise.all([
            loadScript( this, highChart + '/PDFLibs/highcharts.js' ),
            loadScript( this, highChart + '/PDFLibs/jspdf1.min.js' ),
            loadScript( this, highChart + '/PDFLibs/html2canvas.js' ),
            loadScript( this, highChart + '/PDFLibs/jquery.min.js' ),
          ]).then(() => {
            //this.drawChart();
          });
                
                
    }

    handleChange ( event ){
        console.log( 'selectedAccountId ==>> ',  event.detail.value ); 
        this.selectedAccountId = event.detail.value;
        this.drawChart( this.selectedAccountId );
        this.isShowPDFButton = false;
    }
    drawChart ( accountId ){
        try{
            let account = this.accountList.filter( rec => rec.Id === accountId );
            let contactRecordsList = account[0].Contacts;
            if ( contactRecordsList.length > 0 ){
                let contactNames = []; 
                let contactAges  = []; 
                for( let rec of contactRecordsList ){
                    contactNames.push( rec.Name ); 
                    contactAges.push( rec.Age__c ); 
                }
                console.log( contactRecordsList);
                let divArray = this.template.querySelector('.classText'); 
                console.log( 'divArray @@@ 1234==>. ', JSON.stringify( divArray )); 
                const divValue = this.template.querySelector('.classText'); 

                Highcharts.setOptions({ // Apply to all charts
                    chart: {
                        events: {
                            beforePrint: function () {
                                this.oldhasUserSize = this.hasUserSize;
                                this.resetParams = [this.chartWidth, this.chartHeight, false];
                                this.setSize(600, 400, false);
                            },
                            afterPrint: function () {
                                this.setSize.apply(this, this.resetParams);
                                this.hasUserSize = this.oldhasUserSize;
                            }
                        }
                    }
                });
                
                Highcharts.chart(divValue, {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Contact Age Graph'
                    },
                    xAxis: {
                    categories: contactNames,
                        crosshair: true
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                }
                            }
                        }]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'values'
                        }
                    },
                    series: [{
                        name: 'Contact Age Chart',
                        data: contactAges //age

                    }]
                });
            }
    }catch ( err ){
        console.log( 'error in draw chart ',JSON.stringify(err.message));
    }

    }
     
    @wire( getAccount ,{} ) 
    accountRecordList ( result ) {  
        if( result.data ){ 
            this.accountList = result.data;
            let radioGroupOptionList = [];
            for ( let rec of result.data ){
                radioGroupOptionList.push( { label: rec.Name, value: rec.Id } );
            }
            console.log( 'radioGroupOptionList @@', JSON.stringify( radioGroupOptionList ) );
            this.options = radioGroupOptionList; 
            this.isShowRadioGroup = result.data.length > 0 ? true : false;
        }else if ( result.error ) { 
            console.log('error ',result.error);
        }
    }
    generatePdf(){
        console.log( 'inside generate pdf method 123' );
        try{
            // let doc = new jsPDF();
            // doc.text(20, 20, 'Hello world!');
            // doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
            // doc.addPage();
            // doc.text(20, 20, 'Do you like that?');
            // doc.save('test.pdf');
            //window.print();
            //         const divValue = this.template.querySelector('.classText'); 
            //         html2canvas(document.body).then(function(canvas) {
            //             document.body.appendChild(canvas);
            //         });
            //     html2canvas(divValue,{ 
            //     onrendered: function (canvas) {
            //         //show image
            //         var myCanvas = document.getElementById('my_canvas_id');
            //         var ctx = myCanvas.getContext('2d');
            //         var img = new Image;
            //         img.onload = function(){ 
            //             ctx.drawImage(img,0,0,270,350); // Or at whatever offset you like
            //         };
            //         console.log('img >> ', canvas.toDataURL());
            //         img.src = canvas.toDataURL();
            //     }
            // });
            window.print(); 
             
        }catch ( err ){
            console.log( 'err message ==>> ',err.message );
        }
    }
} 