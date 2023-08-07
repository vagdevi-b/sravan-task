import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditExpensesService } from '../../shared/services/editexpense.service';
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { saveAs } from 'file-saver/FileSaver';
import { NavigateDataService } from '../../shared/services/navigateData.service';
import 'jspdf';
import 'jspdf-autotable';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
declare let jsPDF;
declare var $: any;

@Component({
  selector: 'app-review-expense',
  templateUrl: './review-manager-expense.component.html',
  styleUrls: ['./review-manager-expense.component.css']
})
export class ReviewManagerExpenseComponent implements OnInit {
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;
  private rowData;
  public errorMessage: string;
  public flashMessage: string;
  public fieldArray: Array<any> = [];
  public user: any = {};
  private downloadFiles: any;
  selectedRowId: Number;
  employeeDetail;
  expenseStartDate;
  expenseEndDate;
  employeeFullName:String;
  employeeNumber:String;
  employeeLevel:String;
  employeeDepartment:String;
  reportid: any;
  status: any;
  expenseStartDateField: { "year": number, "month": number, "day": number };
  p: number;
  exportLayoutType = "l";

  constructor(private route: ActivatedRoute, private router: Router, private _editExpensesService: EditExpensesService,
    private _createExpenseService: CreateExpenseService, private _navigateDataService: NavigateDataService) { }

  ngOnInit() {
    this.reportid = this.route.params['_value'].reportid;
    this.status = this.route.params['_value'].status;

    this._editExpensesService.getAllExpensesForReportId(this.reportid, this.status).subscribe(response => {
      this._createExpenseService.getEmployeeDetails(response.employeeId).subscribe(data => {
        this.employeeFullName = data.fullName;
        this.employeeNumber = data.employeeNumber;
        this.employeeDepartment = data.departmentName;
        this.employeeLevel = data.gradeName;
      })
      this.fieldArray = response.field;
      this.expenseStartDate = response.expenseStartDate;
      this.expenseEndDate = response.expenseEndDate;

      if (response.expenseStartDate.length != null) {
        let date: string[] = response.expenseStartDate.split('-');
        this.expenseStartDateField = { year: Number(date[0]), month: Number(date[1]), day: Number(date[2]) };
      }
      this.user.description = response.description;
    },
      error => this.errorMessage = <any>error);

    this._editExpensesService.getExpenseAttachmentsByReport(this.reportid).subscribe(response=>{
      this.expenseAttachmentComponent.setReportId(this.reportid);
      this.expenseAttachmentComponent.setAttachments(response);
      this.expenseAttachmentComponent.setHideDelete(true);
    });
  }

  cancel() {
    this.router.navigate(['../../../manager-approval-history/'], { relativeTo: this.route });
  }

  onRowChecked(event) {
    if (event.target.checked) {
      this.selectedRowId = event.target.value;
    } else {
      this.selectedRowId = 0;
    }
  }

  downloadFile(duplicateFileName: string, fileType: string, expenseId: string) {

    this._createExpenseService.downloadFile(duplicateFileName, expenseId).subscribe(
      downloadObj => {
        this.downloadFiles = downloadObj;
        var byteCharacters = atob(this.downloadFiles.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: this.downloadFiles.fileType });
        saveAs(blob, this.downloadFiles.fileName)
      },
      error => this.errorMessage = <any>error);
  }

  showHistory(id) {
    this._navigateDataService.resetReportIdAndStatus(this.reportid, this.status);
    this.selectedRowId = id;
    this.router.navigate(['../../../view-manager-approval-history-expense/', this.selectedRowId], { relativeTo: this.route });
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
    //Column names for the table
    const colNames = ["Date", "Project", "Expense Item", "Notes", "Reimb", "Bill", "Cur", "Price", "QTY", "XE Rate", "Total"];
    //Separating the reimbursible and non reimbursible data
    let reimbursibleData = this.fieldArray.filter(x => x.reimbursible == true);
    let nonReimbursibleData = this.fieldArray.filter(x => x.reimbursible == false);

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

  downloadAllAttachments(){
    let fileName=this.employeeFullName+"_attachments";
    let expenseReportIdList = [];
    let attachmentCount = this.expenseAttachmentComponent.getAttachmentsToSubmit().length;
    expenseReportIdList.push(this.reportid);

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
      })
    }else{
      $('#loadingEditSubmitModal').modal('hide');
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

  previewCalled(){
    this.expenseAttachmentComponent.previewModalOpen();
  }
}
