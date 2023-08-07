import { NavigateDataService } from './../../shared/services/navigateData.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DateOnDashboard } from '../../shared/utilities/DateOnDashboard';
import { Router, ActivatedRoute } from '@angular/router';
import { ManagerExpenseService } from '../../shared/services/manager.expense.service';
import { CreateExpenseService } from '../../shared/services/createexpense.service';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import 'jspdf';
import 'jspdf-autotable';
declare let jsPDF;

declare var $: any;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


import RefData from "./refData";

@Component({
    selector: 'app-manager-expense',
    templateUrl: './manager-expense.component.html',
    styleUrls: ['./manager-expense.component.css']
})
export class ManagerExpenseComponent implements OnInit {
    @ViewChild('DatePickContainer1') datePickContainer1;
    @ViewChild('DatePickContainer2') datePickContainer2;
    @ViewChild('AlertSuccess') alertSuccess: ElementRef;
    @ViewChild('AlertError') alertError: ElementRef;
    _viewExpensesService: any;
    RefData: number;
    private startDate: string;
    private endDate: string;
    private icons: any;
    public rowData: any[];
    public columnDefs: any[];
    public rowCount: string;
    private gridApi;
    private gridColumnApi;

    private api: GridApi;
    private columnApi: ColumnApi;
    public rowSelection;
    private reportid;
    startDateSelectedDate;
    endDateSelectedDate;
    endDateMinVal;
    employeeNameFilterText;
    public tmpRowData: any[];
    flashMessage;
    exportLayoutType = "l";

    selectedDates: DateOnDashboard = new DateOnDashboard('thisWeek', 'This Week');
    listdates = [
        new DateOnDashboard('thisWeek', 'This Week'),
        new DateOnDashboard('lastWeek', 'Last Week'),
        new DateOnDashboard('lastBiWeek', 'Last Bi-week'),
        new DateOnDashboard('thisMonth', 'This Month'),
        new DateOnDashboard('lastMonth', 'Last Month'),
        new DateOnDashboard('dateRange', 'Date Range')
    ];

    // array of all items to be paged
    private allItems: any[];
    private filterItems: any[];

    errorMessage: string;
    collection = [];
    public paginationPageSize: any;
    itemsPerPageList = [10,20,50,100];
    currentPageItemCount = 10; 

    constructor(private _managerExpenseService: ManagerExpenseService, private router: Router, private route: ActivatedRoute, private _navigateDataService: NavigateDataService, private _createExpenseService: CreateExpenseService) {
        // this.rowData = this.createRowData();
        this.columnDefs = this.createColumnDefs();
    }

    ngOnInit() {
        this.paginationPageSize = 10;
        this.selectedDates.id = this._navigateDataService.managerApproveDateRange;
        this._navigateDataService.currentEmpFilterText.subscribe(filterText => this.employeeNameFilterText = filterText);
        if (this._navigateDataService.managerApproveDateRange == "dateRange") {
            this.startDateSelectedDate = this._navigateDataService.managerApproveDatePickerStartDate;
            this.endDateSelectedDate = this._navigateDataService.managerApproveDatePickerEndDate;
            this.myMethod(this._navigateDataService.managerApproveStartDateString, this._navigateDataService.managerApproveEndDateString);
        } else {
            this.onSelect(this._navigateDataService.managerApproveDateRange);
        }
    }

    showExpense() {
        this.router.navigate(['/manager-approve']);
    }

    private createRowData(): any {
        const rowData: any[] = [];
        this._managerExpenseService.getAllExpensesByWeek().subscribe(response => {
            this.rowData = response;
            this.tmpRowData = response;
            this.filterByEmployeeName(this.employeeNameFilterText);
            //console.log("RefData==========>>>>>>>>"+JSON.stringify(this.RefData.length));
            //this.RefData = JSON.stringify(this.RefData.length);
        },
            error => this.errorMessage = <any>error);


        /*for (let i = 0; i < this.RefData.length; i++) {
            
            rowData.push({
                reportid: this.RefData[i].reportid,
                location: this.RefData[i].location,
                totalAmount: this.RefData[i].totalAmount,
                department: this.RefData[i].department,
                status: this.RefData[i].status,
                submitedDate: this.RefData[i].submitedDate,
                date:  this.RefData[i].fromDate+ 'to' + this.RefData[i].toDate,
            });
        }
    
        return rowData;*/
    }

    filterByEmployeeName(filterText) {
        this.rowData = this.tmpRowData;
        if (filterText != "") {
            this._navigateDataService.resetEmployeeNameFilter(filterText);
            this.rowData = this.rowData.filter(x =>
                x["employeeName"].toLowerCase().includes(filterText.toLowerCase())
            )
        } else {
            this._navigateDataService.resetEmployeeNameFilter(filterText);
            this.rowData = this.tmpRowData;
        }

    }

    onGridReady(params) {
        this.gridApi = params.api;

        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();

        params.api.sizeColumnsToFit();
        window.addEventListener("resize", function () {
            setTimeout(function () {
                params.api.sizeColumnsToFit();
            });
        });
    }

    getSelectedApprovalRows(){
        let selectedRows = this.gridApi.getSelectedNodes();
        if(selectedRows.length > 0){
            $("#approve_expense_conf").modal('show');
        }else {
            this.errorMessage = "Please select atleast one expense report";
            let ref = this;
            this.alertError.nativeElement.classList.add("show");
            setTimeout(function () {
                ref.alertError.nativeElement.classList.remove("show");
            }, 2000);
        }        
    }

    approveRows(){
        let selectedRows = this.gridApi.getSelectedNodes();
        $('#loaderDisplayModal').modal('show');
        let reportIds = [];
        selectedRows.forEach(row=>{
            reportIds.push(row.data.reportid);
        });
        this._managerExpenseService.approveExpensesFromReportPage(reportIds).subscribe(response => {
            $('#loaderDisplayModal').modal('hide');
            this.flashMessage = "Expenses Approved Successfully";
            let ref = this;
            this.alertSuccess.nativeElement.classList.add("show");
            setTimeout(function () {
                ref.alertSuccess.nativeElement.classList.remove("show");
                ref.ngOnInit();
            }, 1500);
        },error=>{
            console.log(error);
            $('#loaderDisplayModal').modal('hide');
            this.errorMessage = "Error Occured While Approving Expenses";
            let ref = this;
            this.alertError.nativeElement.classList.add("show");
            setTimeout(function () {
                ref.alertError.nativeElement.classList.remove("show");
            }, 1500);
            
        });
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: "",
                suppressSizeToFit: true,
                width: 45,
                autoHeight: true,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
                cellStyle: {fontSize: '15px'}
            },
            {
                headerName: "Report Id",
                field: "reportid",
                suppressSizeToFit: true,
                width: 110,
                autoHeight: true,
                
            },
            {
                headerName: "Created Date",
                field: "submitedDate",
                suppressFilter: true,
                suppressSizeToFit: true,
                width: 130,
                autoHeight: true
            },
            {
                headerName: "Expense Date Range",
                field: "expenseWeekDate",
                suppressFilter: true,
                suppressSizeToFit: true,
                width: 190,
                autoHeight: true
            },
            {
                headerName: "Employee Name",
                field: "employeeName",
                suppressSizeToFit: true,
                width: 230,
                autoHeight: true
            },
            {
                headerName: "Location",
                field: "location",
                suppressSizeToFit: true,
                width: 140,
                autoHeight: true
            },
            {
                headerName: "Total",
                field: "totalAmount",
                suppressSizeToFit: true,
                width: 170,
                autoHeight: true,
                comparator: this.totalValueComparator,
                valueFormatter: function(params){
                    let numVal = Number(params.value.split(" ")[1]);
                    return params.value.split(" ")[0] + ' '+ numVal.toFixed(2); 
                  }
            },
            // {
            //     headerName: "Department",
            //     field: "department",
            //     suppressSizeToFit: true,
            //     width: 120,
            //     autoHeight: true
            // },
            {
                headerName: "Status",
                field: "status",
                suppressFilter: true,
                suppressSizeToFit: true,
                width: 120,
                autoHeight: true
            },

        ];
        this.rowSelection = "multiple";
        return columnDefs;
    }

    totalValueComparator(val1, val2) {
        let totalVal1 = val1.split(" ")[1];
        let totalVal2 = val2.split(" ")[1];
        return Number(totalVal1) - Number(totalVal2);
      }

    onRowSelected(event) {
        if (event.node.selected) {
            this.reportid = event.node.data.reportid;
            this.router.navigate(['../manager-approve/', this.reportid], { relativeTo: this.route });
        }
    }
    showApprovalHistory() {
        this.router.navigate(['../manager-approval-history/'], { relativeTo: this.route });
    }

    checkStartDate() {
        this.endDateMinVal = this.startDateSelectedDate;
        if (this.endDateSelectedDate != undefined) {
            let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;
            let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;
            this.myMethod(startDateString, endDateString);
        }

    }

    endDateSelected() {
        if (this.startDateSelectedDate != undefined) {
            let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;
            let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;

            console.log(endDateString + '<=====>' + startDateString);
            this.myMethod(startDateString, endDateString);
        }

    }

    myMethod(startDateString, endDateString) {

        this._navigateDataService.managerApproveDatePickerStartDate = this.startDateSelectedDate;
        this._navigateDataService.managerApproveDatePickerEndDate = this.endDateSelectedDate;
        this._navigateDataService.managerApproveStartDateString = startDateString;
        this._navigateDataService.managerApproveEndDateString = endDateString;
        this._managerExpenseService.getExpensesInDateRange(startDateString, endDateString).subscribe(response => {
            this.rowData = response;
            this.tmpRowData = response;
            this.filterByEmployeeName(this.employeeNameFilterText);
        },
            error => this.errorMessage = <any>error);
    }

    onSelect(daterange: string) {
        this._navigateDataService.managerApproveDateRange = daterange;
        if (daterange != 'dateRange') {
            this._managerExpenseService.getAllExpensesForSelectedRange(daterange).subscribe(empbreakinservice => {
                this.rowData = empbreakinservice;                
                this.tmpRowData = empbreakinservice;
                this.filterByEmployeeName(this.employeeNameFilterText);
            },
                error => this.errorMessage = <any>error);
        }
    }

    onSelectionChanged(event) {

    }

    closeFix1(event, datePicker) {
        if (!this.datePickContainer1.nativeElement.contains(event.target)) { // check click origin
            datePicker.close();
        }
    }

    closeFix2(event, datePicker) {
        if (!this.datePickContainer2.nativeElement.contains(event.target)) { // check click origin
            datePicker.close();
        }
    }

    getLineItemsForExcel(exportFor) {
        let selectedRows = this.gridApi.getSelectedNodes();
        if(selectedRows.length == 0){
            this.errorMessage = "No Expenses Selected to export.";
            let ref = this;
            this.alertError.nativeElement.classList.add("show");
            setTimeout(function () {
                ref.alertError.nativeElement.classList.remove("show");
            }, 1500);
        } else {
            $('#loaderDisplayModal').modal('show');
            let expenseReportIdList = [];
            selectedRows.forEach(row=>{
                expenseReportIdList.push(row.data.reportid);
            });
            // let expenseReportIdList = [];
            // this.rowData.forEach(x => {
            //     expenseReportIdList.push(x.reportid)
            // });
            let dataToExport = [];
            this._managerExpenseService.getExpenseLineItemsForExcel(expenseReportIdList).subscribe(response => {
                if (response.length > 0) {
                    response.forEach(x => {
                        let data = {
                            reportId: x.expenseReportId,
                            employeeName:x.employeeName,
                            reportDescription: x.reportDescription,
                            expenseStartDate: x.weekStartDate,
                            date: x.expenseDate,
                            project: x.projectName,
                            task: x.taskName,
                            expenseType: x.typeName,
                            quantity: x.quantity,
                            totalReceiptAmount: x.receiptCurrencyCode + " " + Number(x.totalRecieptAmount).toFixed(2),
                            exchangeRate: x.exchangeRateWithDesc,
                            employeeBaseCurrencyAmount: x.empBaseExchangeAmt,
                            billable: x.billable == true ? "Yes" : "No",
                            reimbursible: x.reimbursible == true ? "Yes" : "No",
                            notes: x.notes,
                            status: x.status
                        };
                        dataToExport.push(data);
                    });
                    // console.log(dataToExport);
                    if(exportFor == 'excel'){
                        this.exportAsExcelFile(dataToExport, "expense");
                    }else if(exportFor == 'pdf'){
                        this.exportAsPdfFile(dataToExport, "expense");
                    }
                } else {
                    $('#loaderDisplayModal').modal('hide');
                    this.errorMessage = "No Expense Line Items Found to Export.";
                    let ref = this;
                    this.alertError.nativeElement.classList.add("show");
                    setTimeout(function () {
                        ref.alertError.nativeElement.classList.remove("show");
                    }, 1500);
                }
            }, error => {
                $('#loaderDisplayModal').modal('hide');
                this.errorMessage = "Error Occured While Fetching Expenses to Export";
                let ref = this;
                this.alertError.nativeElement.classList.add("show");
                setTimeout(function () {
                    ref.alertError.nativeElement.classList.remove("show");
                }, 1500);
            });
        }
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        for (var C = range.s.r; C <= range.e.c; ++C) {
            var address = XLSX.utils.encode_col(C) + "1";
            if (!worksheet[address]) continue;
            worksheet[address].v = this.camelCaseToTitleCase(worksheet[address].v);
        }

        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        $('#loaderDisplayModal').modal('hide');
    }

    exportAsPdfFile(json: any[], pdfFileName: string): void{
        this.getPdfLogo(json, pdfFileName); 
    }

    getPdfLogo(json: any[], pdfFileName: string) {
        this._createExpenseService.getLogoImage().subscribe(data => {
            this.createImageFromBlob(data, json, pdfFileName);
        }, error => {
            this.exportToPdf(null, json, pdfFileName);
        });
    }

    createImageFromBlob(image: Blob, json: any[], pdfFileName: string) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.exportToPdf(reader.result, json, pdfFileName);
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    exportToPdf(base64Image, json: any[], pdfFileName: string){
        // Getting Column names from json keys
        let colNames = [];
        for(let key in json[0]){
            colNames.push(this.camelCaseToTitleCase(key));
        }

        //Preparing row data from the json
        let rowData = [];
        json.forEach(expenseItem =>{
            let row = [];
            for(let key in expenseItem){
                row.push(expenseItem[key]);
            }
            rowData.push(row);
        })
        
        //Creation of pdf begins
        var pdf = new jsPDF(this.exportLayoutType, 'pt', 'A4');

        pdf.setFontSize(8);
        var yCoordinate = 30;
        //Adding the logo image
        if (base64Image) {
            pdf.addImage(base64Image, 'PNG', 45, yCoordinate, 190, 30);
        }

        yCoordinate += 50;

        pdf.setDrawColor(128, 128, 128); //Setting the line color to gray
        pdf.line(35, yCoordinate, pdf.internal.pageSize.getWidth() - 35, yCoordinate);

        let tableColStyles = { 0: { cellWidth: 35 }, 15: { cellWidth: 35 } };
        
        pdf.autoTable({
            head: [colNames], body: rowData, theme: 'striped',
            didDrawPage: function (data) { // Gets called everytime a page is added
              pdf.setDrawColor(0, 0, 0);
              pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);
              pdf.setDrawColor(128, 128, 128);
            },
            startY: yCoordinate, styles: { cellPadding: 1.5, fontSize: 10 }, columnStyles: tableColStyles,
            margin: {left: 15, right:10}
        });

        $('#loaderDisplayModal').modal('hide');
        pdf.save(pdfFileName + '.pdf');
    }

    camelCaseToTitleCase(camelCase) {
        if (camelCase == null || camelCase == "") {
            return camelCase;
        }

        camelCase = camelCase.trim();
        var newText = "";
        for (var i = 0; i < camelCase.length; i++) {
            if (/[A-Z]/.test(camelCase[i])
                && i != 0
                && /[a-z]/.test(camelCase[i - 1])) {
                newText += " ";
            }
            if (i == 0 && /[a-z]/.test(camelCase[i])) {
                newText += camelCase[i].toUpperCase();
            } else {
                newText += camelCase[i];
            }
        }

        return newText;
    }

    chengePageSize(itemCount){
        this.currentPageItemCount = itemCount;
        if(itemCount==0){
            this.gridApi.paginationSetPageSize(Number(this.rowData.length));
        }else{
            this.gridApi.paginationSetPageSize(Number(itemCount));
        }
    }
}
