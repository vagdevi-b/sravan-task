import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ManagerApproveExpenseService } from '../../shared/services/managerapproveexpense.service';
import { ManagerExpenses } from '../../shared/utilities/managerExpenses';
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { EditExpensesService } from '../../shared/services/editexpense.service';
import { saveAs } from 'file-saver/FileSaver';
import 'jspdf';
import 'jspdf-autotable';
import { ExpenseAttachmentComponent } from '../expense-attachment/expense-attachment.component';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';
declare let jsPDF;

declare var $: any;

@Component({
  selector: 'app-manager-approve',
  templateUrl: './manager-approve.component.html',
  styleUrls: ['./manager-approve.component.css']
})
export class ManagerApproveComponent implements OnInit {
  @ViewChild('AlertSuccess') alertSuccess: ElementRef;
  @ViewChild('AlertError') alertError: ElementRef;
  @ViewChild(ExpenseAttachmentComponent) expenseAttachmentComponent;

  
  public errorMessage: any;
  private expenseStartDate: any;
  trackingId: any;
  public fieldArray: Array<ManagerExpenses> = [];
  managerExpenses: ManagerExpenses;
  selectedAll: any;
  user: any = {};
  expenses: any;
  flashMessage: String;
  display: string;
  p:number;
  employeeFullName:String;
  employeeNumber:String;
  employeeLevel:String;
  employeeDepartment:String;
  reportid: any;
  expenseEndDate;
  status:any;
  passedExpenseData:any;
  reportIdList:any;
  // jsonExpenseData;
  isSkipDisabled: boolean = false;
  private downloadFiles: any;
  totalEmpExchangeAmt : number;
  currencyType : string;
  public AuditInputDTO: any = {};
  waitingOn = [];
  exportLayoutType="l";
  parentReportId = 0;
  itemsPerPageList = [5,10,20,50,100];
  currentPageItemCount = 5;
  pageCount = 5;

  constructor(private router: Router, private route: ActivatedRoute,
    private _managerApproveExpenseService: ManagerApproveExpenseService,
    private _createExpenseService: CreateExpenseService,
    private _editExpensesService: EditExpensesService,
    private toasterService: ToastrService,
  ) {
    this.expenses = new Array<ManagerExpenses>();
  }

  ngOnInit() {
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    }
    this.route.params.subscribe(params => {
      this.trackingId = params;
    })

    this._managerApproveExpenseService.getExpenseListToApprove()
      .subscribe(res => {
        this.reportIdList = res.map(e => e.reportid);
        if (this.reportIdList.length === 1) {
          this.isSkipDisabled = true;
        }
      },
    error => this.errorMessage = <any>error);

    this._managerApproveExpenseService.getExpenseBasedOnId(this.trackingId.trackingId)
      .subscribe(response => {
        this.expenses = response;
        this.parentReportId = response.lineItems[0].parentId;
        this._createExpenseService.getEmployeeDetails(this.expenses.lineItems[0].employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
        });
        this.expenses.lineItems.forEach(x => {
          let temp = x.empBaseExchangeAmt.split(" ")
          x.amt= temp[1]
          x.currencyTyp = temp[0]
        })
        let temp = this.expenses.totalEmpExchangeAmt.split(" ");
        this.currencyType = temp[0]
        this.totalEmpExchangeAmt =Number(temp[1]);
      },
        error => this.errorMessage = <any>error);

      this._editExpensesService.getExpenseAttachmentsByReport(this.trackingId.trackingId).subscribe(response=>{
        this.expenseAttachmentComponent.setReportId(this.trackingId.trackingId);
        this.expenseAttachmentComponent.setAttachments(response);
        this.expenseAttachmentComponent.setHideDelete(true);
      });
  }

  selectAll(ev) {
    if (this.selectedAll === true) {
      for (var i = 0; i < this.expenses['lineItems'].length; i++) {
        this.expenses['lineItems'][i].selected = this.selectedAll;
      }
    } else {
      for (var i = 0; i < this.expenses['lineItems'].length; i++) {
        this.expenses['lineItems'][i].selected = false;
      }
    }

  }

  checkIfAllSelected(expenseId) {
    this.selectedAll = this.expenses['lineItems'].every(item => {
      return item.selected;
    });
  }

  checkIfAnySelected() {
    if (this.expenses['lineItems'] !== null && this.expenses['lineItems'].length > 0) {
      return this.expenses['lineItems'].some(field => field.selected == true);
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

  rejectExpense() {
    this.expenses['lineItems'].forEach(item => {
      if(item.selected){
        item.rejectReason = this.user.rejectReason;
      }
    });

    this._managerApproveExpenseService.rejectExpense(this.expenses).subscribe(response => {
      $('#approveRejectModal').modal('hide');
      this.expenses = response;
      this.flashMessage = 'Expense Report Rejected Successfully';
      let ref = this;
      this.alertSuccess.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertSuccess.nativeElement.classList.remove("show");
        // ref.router.navigate(['../../expenses/manager-expense/'], { relativeTo: this.route });
        ref.getExpensesToApprove();
      }, 1500);
    },
      error => {
        $('#approveRejectModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
          ref.router.navigate(['../../expenses/manager-expense/'], { relativeTo: this.route });
        }, 1500);
      });

    // this.router.navigate(['../../manager-expense/'], { relativeTo: this.route });
  }

  approveExpense() {
    // console.log("this.expenses : " + JSON.stringify(this.expenses));
    this._managerApproveExpenseService.approveExpense(this.expenses).subscribe(response => {
      $('#approveRejectModal').modal('hide');
      this.expenses = response;
      this.flashMessage = "Expense Report Approved Successfully";
      let ref = this;
      this.alertSuccess.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertSuccess.nativeElement.classList.remove("show");
        // ref.router.navigate(['../../expenses/manager-expense/'], { relativeTo: this.route });
        ref.getExpensesToApprove();
      }, 1500);
    },
      error => {
        $('#approveRejectModal').modal('hide');
        this.errorMessage = <any>error;
        this.alertError.nativeElement.classList.add("show");
        let ref = this;
        setTimeout(() => {
          ref.alertError.nativeElement.classList.remove("show");
          ref.router.navigate(['../../expenses/manager-expense/'], { relativeTo: this.route });
        }, 1500);
      });

    // this.router.navigate(['../../manager-expense/'], { relativeTo: this.route });
  }

  openModal(id: string) {
    //console.log("openModal : Value of id : " + JSON.stringify(this.expenses['lineItems']));    
    this.expenses['lineItems'].every(item => {

      // console.log("item : " + JSON.stringify(item));
      if (item.selected == true) {
        // console.log("hi in if true 1");
      }

      if (item.selected == false) {
        // console.log("hi in if false 1");

        close();
        //document.getElementById('reject_expense').click();
      }

      this.user.rejectId = item.expenseId;
    });


  }

  cancel() {
    this.router.navigate(['../../manager-expense/'], { relativeTo: this.route });
  }
  
  downloadFile(duplicateFileName: string, fileType: string, expenseId: string) {
    this._createExpenseService.downloadFile(duplicateFileName, expenseId).subscribe(
      downloadObj => {
        this.downloadFiles = downloadObj;
        // console.log("Response : data : ", this.downloadFiles);
        // console.log("downloadObj.fileContent : ", this.downloadFiles.fileContent);

        var byteCharacters = atob(this.downloadFiles.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: this.downloadFiles.fileType });
        //var url= window.URL.createObjectURL(blob);
        //window.open(url, "download,status=1");

        saveAs(blob, this.downloadFiles.fileName)

        //window.open("data:image/png;base64,"+this.downloadFiles.fileContent,"_blank");
      },
      error => this.errorMessage = <any>error);
  }

  //Function to get rows of data in sequential array format as per the column name sequence
  getRowDataForPdf(dataObj) {
    let rowData = [];
    dataObj.forEach(x => {
      let rows = [];
      rows.push(x.expenseDate);
      rows.push(x.projectName);
      rows.push(x.customerName);
      rows.push(x.typeName);

      rows.push(x.reimbursible == true ? 'Yes' : 'No');
      rows.push(x.billable == true ? 'Yes' : 'No');

      rows.push(x.receiptCurrencyCode+" "+Number(x.totalRecieptAmount).toFixed(2));
      rows.push(x.currencyTyp+" "+Number(x.amt).toFixed(2));
      rows.push(x.notes);
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
    let anySelected = this.expenses['lineItems'].some(item => {
      return item.selected;
    });
    //Column names for the table
    const colNames = ["Date", "Project", "Client", "Expense Type", "Reimb", "Bill", "Total Receipt Amt", "Base Cur Amt", "Notes"];
    let reimbursibleData;
    let nonReimbursibleData;
    if(anySelected==true){
      reimbursibleData = this.expenses.lineItems.filter(x => {
        if(x.reimbursible == true && x.selected==true){
          return x;
        }
      });
      nonReimbursibleData = this.expenses.lineItems.filter(x => {
        if(x.reimbursible == false && x.selected==true){
          return x;
        }
      });
    }else{
      //Separating the reimbursible and non reimbursible data
      reimbursibleData = this.expenses.lineItems.filter(x => x.reimbursible == true);
      nonReimbursibleData = this.expenses.lineItems.filter(x => x.reimbursible == false);
    }
    
    
    let totalReimbursibleAmount = 0;
    let totalNonReimbursibleAmount = 0;
    let baseExchangeCurrency = "";
    //Calculating the total reimbursible amount and totalNonReimbursibleAmount
    reimbursibleData.forEach(x => {
      baseExchangeCurrency = x.empBaseExchangeAmt.split(" ")[0];
      totalReimbursibleAmount += Number(x.empBaseExchangeAmt.split(" ")[1]);
    });

    nonReimbursibleData.forEach(x => {
      if(baseExchangeCurrency==""){
        baseExchangeCurrency = x.empBaseExchangeAmt.split(" ")[0];
      } 
      totalNonReimbursibleAmount += Number(x.empBaseExchangeAmt.split(" ")[1]);
    });

    let totalAmount = Number(totalReimbursibleAmount) + Number(totalNonReimbursibleAmount);

    //Getting the rows of data in sequential array format from function as per column name sequence
    let reimbursedRowData = this.getRowDataForPdf(reimbursibleData);

    let nonReimbursedRowData = this.getRowDataForPdf(nonReimbursibleData);

    //Creation of pdf begins
    var pdf = new jsPDF(this.exportLayoutType, 'pt', 'A4');
    // pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
    pdf.setFontSize(8);
    var yCoordinate = 40;
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
    pdf.fromHTML('Tracking Number: ' + this.trackingId.trackingId, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Date: ' + this.expenses.expenseDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Name: ' + this.expenses.weekStartDate+' to '+this.expenses.weekEndDate, 35, yCoordinate);
    yCoordinate += 15;
    pdf.fromHTML('Status: ' + this.expenses.lineItems[0].status, 35, yCoordinate);
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
      tableColStyles = { 1:{cellWidth: 55}, 2: { cellWidth: 55 } };
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
          { cellPadding: 1.5, fontSize: 9 }, columnStyles: tableColStyles
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
      }
    }else{
      if (yCoordinate > 500) {
        pdf.addPage();
        pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
        yCoordinate = 30;
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
    let fileName = this.employeeFullName+"_"+this.expenses.weekStartDate+'_to_'+this.expenses.weekEndDate;    
    //Save the pdf    
    pdf.save(fileName+'.pdf');
  }

  getExpenseForApproval () {
    let count = 0;
    let selectedId;
    this.expenses['lineItems'].some(item => {
      if(item.selected) {
        count +=1;
        selectedId = item.expenseId;
      }
    });
    if(count ==1 ) {
      this.AuditInputDTO.employeeId = selectedId;
      this._editExpensesService.getExpenseForApproval(this.AuditInputDTO)
      .subscribe(waitingOn => {
        this.waitingOn = waitingOn;
        $('#waitingForApproval').modal('show');
      },
        error => this.errorMessage = <any>error);
    } else {
      if(count <= 0) {
        this.errorMessage = "Please select one line item";
      } else {
        this.errorMessage = "Please select only one line item";
      }
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
    let attachmentCount = this.expenseAttachmentComponent.getAttachmentsToSubmit().length;
    expenseReportIdList.push(this.trackingId.trackingId);

    if(attachmentCount>0){
      $('#approveRejectModal').modal('show');
      this._createExpenseService.downloadAllAttachments(expenseReportIdList).subscribe(response=>{
        var byteCharacters = atob(response.fileContent);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], { type: response.fileType });
  
        saveAs(blob, fileName);
        $('#approveRejectModal').modal('hide');
      })
    }else{
      $('#approveRejectModal').modal('hide');
      this.errorMessage = 'No attachments to download';
      let ref = this;
      this.alertError.nativeElement.classList.add("show");
      setTimeout(function () {
        ref.alertError.nativeElement.classList.remove("show");
      }, 2000);
    }
    
  }

  changeUrl(){
    // this.router.navigate(['../', "80123"], { relativeTo: this.route });
    // this.getNextExpense();
    // this.ngOnInit();
    this.getExpensesToApprove();
  }

  getNextExpense(reportId){
    this.router.navigate(['../', reportId], { relativeTo: this.route });
    this.trackingId = {trackingId: reportId};
    this._managerApproveExpenseService.getExpenseBasedOnId(reportId)
      .subscribe(response => {
        this.expenses = response;
        this.parentReportId = response.lineItems[0].parentId;
        this._createExpenseService.getEmployeeDetails(this.expenses.lineItems[0].employeeId).subscribe(data => {
          this.employeeFullName = data.fullName;
          this.employeeNumber = data.employeeNumber;
          this.employeeDepartment = data.departmentName;
          this.employeeLevel = data.gradeName;
        });
        this.expenses.lineItems.forEach(x => {
          let temp = x.empBaseExchangeAmt.split(" ")
          x.amt= temp[1]
          x.currencyTyp = temp[0]
        })
        let temp = this.expenses.totalEmpExchangeAmt.split(" ");
        this.currencyType = temp[0]
        this.totalEmpExchangeAmt =Number(temp[1]);
      },
        error => this.errorMessage = <any>error);
  }

  getExpensesToApprove(){
    this._managerApproveExpenseService.getExpenseListToApprove().subscribe(response => {
      if(response.length != 0){
        this.selectedAll = false;
        this.ngOnInit();
        this.skipExpense();
        
      }else{
        this.flashMessage = "No More Expenses to Approve";
        let ref = this;
        this.alertSuccess.nativeElement.classList.add("show");
        setTimeout(function () {
          ref.alertSuccess.nativeElement.classList.remove("show");
          ref.router.navigate(['../../expenses/manager-expense/'], { relativeTo: this.route });
        }, 1500);
      }

    })
  }


  getExRateVal(val){
    
    if(val != undefined && val != ""){
      return (val.split(" ")[1] + ' '+ val.split(" ")[2] + ' '+ val.split(" ")[3]);
    }
  }

  getExRateCurr(val){
    if(val != undefined && val != "")
    return val.split(" ")[0];
  }

  rejectReasonClose(){
    this.user.rejectReason="";
  }

  previewCalled(){
    this.expenseAttachmentComponent.previewModalOpen();
  }

  chengePageSize(itemCount){
    this.pageCount = itemCount;
    if(itemCount==0){
        this.currentPageItemCount = Number(this.expenses.lineItems.length);
    }else{
      this.currentPageItemCount = Number(itemCount);
    }
  }
  
	//skip Functionality
  skipExpense() {
      // let reportIdList = response.map(e => e.reportid)
      console.log(this.reportIdList);
      var reportId = this.trackingId.trackingId;
      let reportIndex = this.reportIdList.indexOf(parseInt(reportId));
      if(this.reportIdList.length - 1 === reportIndex){
        this.getNextExpense(this.reportIdList[0]);
      }else{
        this.getNextExpense(this.reportIdList[reportIndex + 1]);
      }
  }


}
