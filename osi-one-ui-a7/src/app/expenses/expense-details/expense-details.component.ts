import { saveAs } from 'file-saver/FileSaver';
import { CreateExpenseService } from './../../shared/services/createexpense.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditExpensesService } from '../../shared/services/editexpense.service';
import { NavigateDataService } from '../../shared/services/navigateData.service';
import { ReimburseExpenseService } from '../../shared/services/reimburseExpense.service';
import { Flash } from '../../shared/utilities/flash';
import 'jspdf';
import 'jspdf-autotable';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
declare let jsPDF;
 
class PayDetail {
  expenseId?= '';
  paymentDate?= '';
  description?= '';
  refNo?= '';
  amount?: Number;
  constructor(expenseId, paymentDate, description, refNo, amount) {
    this.expenseId = expenseId;
    this.paymentDate = paymentDate;
    this.description = description;
    this.refNo = refNo;
    this.amount = amount;
  }
}

declare var $: any;
@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})
export class ExpenseDetailsComponent implements OnInit {

  @ViewChild('AlertSuccess') alertSuccess: any;
  @ViewChild('AlertError') alertError: any;
 @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;
  private rowData;
  public errorMessage: string;
  public fieldArray: Array<any> = [];
  public user: any = {};
  private downloadFiles: any;
  selectedRowId: Number;
  selectedRowsForReimbursement = [];
  selectedTotalExpenses = 0;
  formError: Boolean = false;
  alertText: String = "";
  baseExchangeCurrency: String = "";
  parentReportId = 0;
  //Setting the min date to today as payment has to be made in future
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  reportid: any;
  status: any;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  p: number;
  paymentDetailsFields = [];
  flash: Flash = new Flash();
  isTrascError: boolean = false;
  showSuccessAlert = false;
  successTextMessage = '';
  employeeFullName:String;
  employeeNumber:String;
  employeeLevel:String;
  employeeDepartment:String;
  exportLayoutType = "l";
  expenseStartDate;
  expenseEndDate;
  totalAmount : number = 0;
  postFileArray=[];
  itemsPerPageList = [5,10,20,50,100];
  currentPageItemCount = 10;
  pageCount = 10;

  constructor(private route: ActivatedRoute, private router: Router, private _editExpensesService: EditExpensesService,
    private _navigateDataService: NavigateDataService, private _reimburseExpense: ReimburseExpenseService, private _createExpenseService: CreateExpenseService) { }

  ngOnInit() {
    this.reportid = this.route.params['_value'].reportid;
    this.status = this.route.params['_value'].status;

    //Calling edit expense serivce to get the report expenses
    /*this._editExpensesService.getAllExpensesForReportId(this.reportid, this.status).subscribe(response => {
      this.fieldArray = response.field;

      if (response.expenseStartDate.length != null) {
        let date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.user.description = response.description;
    },
      error => this.errorMessage = <any>error); */

      this._editExpensesService.getAllNonReimbursedExpensesForReportId(this.reportid).subscribe(response => {
        // console.log(response);
        this.fieldArray = response.field;
        if(this.fieldArray != undefined || this.fieldArray != null){
          this.fieldArray.forEach(x => {
            this.totalAmount += Number(x.baseExchangeAmt.split(" ")[1]);
          });
        }
        this.parentReportId = response.parentId;
        this._createExpenseService.getEmployeeDetails(response.employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
        })
        this.expenseStartDate = response.expenseStartDate;
        this.expenseEndDate = response.expenseEndDate;
        if (response.expenseStartDate != null && response.expenseStartDate.length != null) {
          var date: string[] = response.expenseStartDate.split('-');
          this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
        }
        this.user.description = response.description;
  
        // console.log("On Non Reimbursed Expenses Load : " + JSON.stringify(this.fieldArray));
      },
        error => this.errorMessage = <any>error);
      this._editExpensesService.getExpenseAttachmentsByReport(this.reportid).subscribe(response=>{
        this.postFileArray = response;
        this.expenseAttachmentComponent.setReportId(this.reportid);
        this.expenseAttachmentComponent.setAttachments(response);
        this.expenseAttachmentComponent.setHideDelete(true); 
      });
  }

  cancel() {
    this.router.navigate(['../../../expense-payment/'], { relativeTo: this.route });
  }

  onEditChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    } else {
      let count = 0;
      this.fieldArray.forEach(x => {
        if (x.selected) {
          count++;
        }
      });
      if (count == 0) {
        this.selectedRowId = 0;
      } else if (count == 1) {
        this.fieldArray.forEach(x => {
          if (x.selected) {
            this.selectedRowId = x.id;
          }
        });
      }
    }
  }

  trackByFn(index, item) {
    return index;
  }

  checkSelectedStatus() {
    return this.fieldArray.some(field => field.selected == true);
  }

  checkAll(event) {
    if (this.fieldArray.length == 1) {
      this.selectedRowId = this.fieldArray[0].id;
    }
    this.fieldArray.forEach(x => x.selected = event.target.checked)
  }
  uncheckAll() {
    if (this.fieldArray.length == 1) {
      this.selectedRowId = this.fieldArray[0].id;
    }
    this.fieldArray.forEach(x => x.selected = false)
  }

  isAllChecked() {
    return this.fieldArray.every(_ => _.selected);
  }

  closeModal() {
    this.paymentDetailsFields = []; // Reinititalizing the array to blank object
  }

  reimburseExpense() { // Called when the Reimburse button is clicked
    this.selectedTotalExpenses = 0;
    this.selectedRowsForReimbursement = [];
    this.fieldArray.forEach(field => {
      if (field.selected == true) {
        let baseExchangeAmt = 0; //Base Exchange amt coming as INR 2544. Splitting it to get the currency and amount for each 
        let tmpExcangePriceData = field.baseExchangeAmt.split(" ", 2);
        this.baseExchangeCurrency = tmpExcangePriceData[0];
        this.selectedTotalExpenses += Number(tmpExcangePriceData[1]);
        this.paymentDetailsFields.push(new PayDetail(field.id, '', '', '', Number(tmpExcangePriceData[1]))); // Added selected fields to array if needed in future
      }
    });
  }
  rejectExpense() {
    let isValidToReject = false;
    this.selectedRowsForReimbursement = [];
    this.fieldArray.forEach(field => {
      if (field.selected == true ) {
        if(field.status === 'O' && !isValidToReject) {
          field.reasonForReject = this.user.rejectReason;
          this.selectedRowsForReimbursement.push(field);
          isValidToReject = false;
        } else {
          isValidToReject = true;
          this.errorMessage = "Charged Item can't be rejected";
          this.alertError.nativeElement.classList.add("show");
          //field.selected = false;
          this.selectedRowsForReimbursement = [];
          let ref = this;
          setTimeout(() => {
            ref.alertError.nativeElement.classList.remove("show");
            //ref.router.navigate(['../../expenses/expense-payment/'], { relativeTo: this.route });
          }, 1200);
        }
      }
    });
    if(!isValidToReject) {
      if(this.selectedRowsForReimbursement.length > 0)
        this.pmoRejectExpense();
    }
  }
  pmoRejectExpense () {
      this._editExpensesService.pmoRejectExpenses(this.selectedRowsForReimbursement).subscribe(response => {
        this.flash.message = 'Expense Report Rejected Successfully';
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['../../expenses/expense-payment/'], { relativeTo: this.route });
        }, 900);
      },
      error => {
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
          ref.router.navigate(['../../expenses/expense-payment/'], { relativeTo: this.route });
        }, 900);
      });
  }
  validateFields(payDetail) { //Validation for the textboxes in the modal
    if (payDetail.paymentDate == "") {
      this.formError = true;
      this.alertText = "Please select payment date.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else if (payDetail.description == "") {
      this.formError = true;
      this.alertText = "Please add description.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else if (payDetail.refNo == "") {
      this.formError = true;
      this.alertText = "Please add reference number.";
      let ref = this;
      setTimeout(function () {
        ref.formError = false,
          this.alertText = "";
      }, 1000);
      return false;
    } else {
      return true;
    }
  }

  savePaymentDetails() { 
    let lastAddedRowIndex = this.paymentDetailsFields.length - 1;
    let isValidated = false;
    isValidated = this.paymentDetailsFields.every(x => this.validateFields(x));
    if (isValidated) {
      this.paymentDetailsFields.forEach(field => {
        field.paymentDate = field.paymentDate['year'] + '-' + field.paymentDate['month'] + '-' + field.paymentDate['day'];
      });

      //TODO:== Call the service to save expenses here
      let submitData = {
        "reportId":this.reportid,
        "baseExchangeCurrency":this.baseExchangeCurrency,
        "paymentDetails":this.paymentDetailsFields
      }
      // console.log(submitData);

      this._reimburseExpense.reimburseExpense(submitData).subscribe(expensesLst => {
        // console.log("after save : assigning expensesList======>>>>>>>>>" + JSON.stringify(expensesLst));
        this.successTextMessage = "Expense Item Reimbursed Successfully"
        this.showSuccessAlert = true;
        if (expensesLst !== null) {
          this.isTrascError = true;
          this.flash.message = 'Expense Item Reimbursed Successfully';
          this.flash.type = 'success';
          let ref = this;
          this.alertSuccess.nativeElement.classList.add("show");
          this.uncheckAll();
          setTimeout(() => {
            ref.isTrascError = false;
            ref.alertSuccess.nativeElement.classList.remove("show");
            ref.router.navigate(['/expenses/expense-payment'], { relativeTo: ref.route });
          }, 1000);
        }
      },
  
        error => {
          this.errorMessage = <any>error;
          this.alertError.nativeElement.classList.add("show");
          let ref = this;
          setTimeout(function () {
            ref.alertError.nativeElement.classList.remove("show");
          }, 900);
        });
      //TODO:== After success response inside response put these fields
      //Maybe redirect back to this.router.navigate(['../../../expense-payment/'], { relativeTo: this.route });
      this.paymentDetailsFields = [];
      $('#reimburseModal').modal('hide');

    }
  }

  //Function to get rows of data in sequential array format as per the column name sequence
  getRowDataForPdf(dataObj) {
    let rowData = [];
    dataObj.forEach(x => {
      let rows = [];
      rows.push(x.expenseDate);
      rows.push(x.projectName);
      rows.push(x.expenseTypeName);
      rows.push(x.notes);
      rows.push(x.reimbursible == true ? 'Yes' : 'No');
      rows.push(x.billable == true ? 'Yes' : 'No');
      rows.push(x.currencyCode);
      rows.push(Number(x.receiptPrice).toFixed(2));
      rows.push(x.quantity);
      rows.push(x.exchangeRateWithDesc);
      rows.push(x.baseExchangeAmt);
                                                       
      rowData.push(rows);
    });
    return rowData;
  }

  getPdfData() {
    this._createExpenseService.getLogoImage().subscribe(data => {
      this.createImageFromBlob(data);
    },error=>{
      this.exportToPdf(null);
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.exportToPdf(reader.result);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  exportToPdf(base64Image) {
    let anySelected = this.fieldArray.some(item => {
      return item.selected;
    });
    
    //Column names for the table
    //const oldcolNames = ["Report Id", "Status", "Project", "Task", "Expense Date", "Expense Type", "Quantity", "Receipt Currency", "Receipt Price", "Employee Base Currency Amount", "Billable", "Reimbursible", "Exchange Rate", "Notes"]
    const colNames = ["Date", "Project", "Expense Item", "Notes", "Reimb", "Bill", "Cur", "Price", "QTY", "XE Rate", "Total"];
    let reimbursibleData;
    let nonReimbursibleData;
    if(anySelected==true){
      reimbursibleData = this.fieldArray.filter(x => {
        if(x.reimbursible == true && x.selected==true){
          return x;
        }
      });
      nonReimbursibleData = this.fieldArray.filter(x => {
        if(x.reimbursible == false && x.selected==true){
          return x;
        }
      });
    }else{
      //Separating the reimbursible and non reimbursible data
      reimbursibleData = this.fieldArray.filter(x => x.reimbursible == true);
      nonReimbursibleData = this.fieldArray.filter(x => x.reimbursible == false);
    }

    let totalReimbursibleAmount = 0;
    let totalNonReimbursibleAmount = 0;
    let baseExchangeCurrency = "";
    //Calculating the total reimbursible amount and totalNonReimbursibleAmount
    reimbursibleData.forEach(x => {
      baseExchangeCurrency = x.baseExchangeAmt.split(" ")[0];
      totalReimbursibleAmount += Number(x.baseExchangeAmt.split(" ")[1]);
    });

    nonReimbursibleData.forEach(x => {
      totalNonReimbursibleAmount += Number(x.baseExchangeAmt.split(" ")[1]);
    });

    let totalAmount = Number(totalReimbursibleAmount) + Number(totalNonReimbursibleAmount);

    //Getting the rows of data in sequential array format from function as per column name sequence
    let reimbursedRowData = this.getRowDataForPdf(reimbursibleData);

    let nonReimbursedRowData = this.getRowDataForPdf(nonReimbursibleData);

    //Creation of pdf begins
    var pdf = new jsPDF(this.exportLayoutType, 'pt', 'A4');

    // pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
    pdf.setFontSize(8);
    var yCoordinate = 30;
    //Adding the logo image
    if(base64Image){
      pdf.addImage(base64Image, 'PNG', 45, yCoordinate, 190, 30);
    }
    
    yCoordinate += 50;
    pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Header Creation begin
    pdf.fromHTML('<b style="font-size:18px;">Expense Report</b>', 35, yCoordinate);
    yCoordinate += 17;
    pdf.fromHTML('Tracking Number: ' + this.reportid, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Date: ' + this.expenseStartDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Name: ' + this.expenseStartDate+' to '+this.expenseEndDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Status: ' + this.status, 35, yCoordinate);
    yCoordinate += 23;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.fromHTML('<b style="font-size:18px">From</b>', 35, yCoordinate);
    yCoordinate += 17;
    pdf.fromHTML(this.employeeFullName, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Department: ' + (this.employeeDepartment==null?"":this.employeeDepartment), 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Employee Number: ' + (this.employeeNumber==null?"":this.employeeNumber), 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Position Level: ' + (this.employeeLevel==null?"":this.employeeLevel), 35, yCoordinate);
    yCoordinate += 23;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Header Creation End
    
    
    let tableColStyles={};
    if(this.exportLayoutType=="p"){
      tableColStyles = { 1:{cellWidth: 75}, 3: { cellWidth: 55 } };
    }else{
      tableColStyles = { 3: { cellWidth: 85 } };
    }

    //Reimbursible Expenses table
    let firstTable;
    //If data is there then only create grid
    if (reimbursedRowData.length != 0) {
      pdf.fromHTML('<b>Reimbursible Expenses</b>', 35, yCoordinate);
      yCoordinate += 30;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 10;
      pdf.autoTable({
        head: [colNames], body: reimbursedRowData, theme: 'striped',
        didDrawPage: function (data) { // Gets called everytime a page is added
          pdf.setDrawColor(0, 0, 0);     
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
      },
        startY: yCoordinate, styles:
          { cellPadding: 1.5, fontSize: 10 }, columnStyles: tableColStyles
      });
      firstTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
    }
    if (firstTable) {
      yCoordinate = firstTable.finalY + 30; //changing the y coordinate to end of table if present
    }

    
    let secondTable;
    //If data is there then only create grid
    if (nonReimbursedRowData.length != 0) {
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      //Non Reimbursible Expenses table
      pdf.fromHTML('<b>Non Reimbursible Expenses</b>', 35, yCoordinate);
      yCoordinate += 30;
      pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
      yCoordinate += 10;
      pdf.autoTable({
        head: [colNames], body: nonReimbursedRowData, theme: 'striped',
        didDrawPage: function (data) { // Gets called everytime a page is added
          pdf.setDrawColor(0, 0, 0);     
          pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
          pdf.setDrawColor(128, 128, 128);
      },
        startY: yCoordinate, styles:
          { cellPadding: 1.5, fontSize: 10 }, columnStyles: tableColStyles
      });
      secondTable = pdf.autoTable.previous; //Tracking the table created to get the end y axis value
    }

    if (secondTable) {
      yCoordinate = secondTable.finalY + 30; //changing the y coordinate to end of table if present
    } else {
      yCoordinate += 30; //Else only increase y coordinate by 30
    }

    //Chcking if the y coordinate has reached almost the end then draw the footer html in new page
    if(this.exportLayoutType=="p"){
      if (yCoordinate > 1100) {
        pdf.addPage();
        pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
        yCoordinate = 30;
        pdf.setDrawColor(128, 128, 128);
      }
    }else{
      if (yCoordinate > 500) {
        pdf.addPage();
        pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
        yCoordinate = 30;
        pdf.setDrawColor(128, 128, 128);
      }
    }
    //Total expenses footer
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.fromHTML('<b>Total of All Expenses</b>', 35, yCoordinate);
    //Adding the amount vlaue at the end of the same row
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Non Reimbursible expenses footer
    pdf.fromHTML('<b>Non Reimbursible Expenses</b>', 35, yCoordinate);
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalNonReimbursibleAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //Total Due footer
    pdf.fromHTML('<b>Total Due</b>', 35, yCoordinate);
    pdf.fromHTML('<b>' + baseExchangeCurrency + ' ' + Number(totalAmount - totalNonReimbursibleAmount).toFixed(2) + '</b>', pdf.internal.pageSize.getWidth() - 150, yCoordinate);
    yCoordinate += 25;
    pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);
    //creating file name
    let fileName = this.employeeFullName+"_"+this.expenseStartDate+"_"+this.expenseEndDate;    
    //Save the pdf    
    pdf.save(fileName+'.pdf');
  }

  checkIfAnySelected() {
    if (this.fieldArray !== null && this.fieldArray.length > 0) {
      return this.fieldArray.some(field => field.selected == true);
    } else {
      return false;
    }
  }
  checkAnySelected(popupname) {
    let f = this.checkIfAnySelected();
    if(f) {
      $('#'+popupname).modal('show');
    } else {
      this.errorMessage = 'Please select atleast one expense';
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 1500);
    }
  }

  downloadAllAttachments(){

    let fileName=this.employeeFullName+"_attachments";
    let expenseReportIdList = [];
    let attachmentCount = this.postFileArray.length;
    expenseReportIdList.push(this.reportid);
    // this.fieldArray.forEach(field=>{
    //   expenseReportIdList.push(field.id);
    //   attachmentCount+=field.expenseAttachments.length;
    // })
    
    if(attachmentCount>0){
      $('#loadingEditSubmitModal').modal('show');
      this._createExpenseService.downloadAllAttachments(expenseReportIdList).subscribe(response=>{
        var byteCharacters = atob(response.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: response.fileType });
  
        saveAs(blob, fileName);
        $('#loadingEditSubmitModal').modal('hide');
      },error=>{
        console.log(error);
        $('#loadingEditSubmitModal').modal('hide');
        this.errorMessage = 'Error Occured While Downloading Attachments';
        let ref = this;
        this.alertError.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.alertError.nativeElement.classList.remove("show");
        }, 2000);
      })
    }else{
      this.errorMessage = 'No attachments to download';
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 2000);
    }
  }

  getCurr(val){
    if(val != undefined && val != "")
    return val.split(" ")[0];
  }
  
  getVal(val){
    if(val != undefined && val != "")
    return val.split(" ")[1];
  }

  getExRateVal(val){
    
    if(val != undefined && val != ""){
      return (val.split(" ")[1] + ' '+ val.split(" ")[2] + ' '+ val.split(" ")[3]);
    }
  }

  getExRatePopupVal(val){
    
    if(val != undefined && val != ""){
      return (val.split(" ")[2] + ' '+ val.split(" ")[3] + ' '+ val.split(" ")[4]);
    }
  }

  getExRateCurr(val){
    if(val != undefined && val != "")
    return val.split(" ")[0];
  }

  rejectReasonClose(){
    this.user.rejectReason="";
  }

  chengePageSize(itemCount){
    this.pageCount = itemCount;
    if(itemCount==0){
        this.currentPageItemCount = Number(this.fieldArray.length);
    }else{
      this.currentPageItemCount = Number(itemCount);
    }
  }
  previewCalled(){
    this.expenseAttachmentComponent.previewModalOpen();
  }
}
