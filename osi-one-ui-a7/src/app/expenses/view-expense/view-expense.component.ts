import { Component, ViewChild, OnInit } from "@angular/core";
import { DateOnDashboard } from "../../shared/utilities/DateOnDashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { GridOptions } from "ag-grid";
import { ViewExpensesService } from "../../shared/services/viewexpenses.service";

@Component({
    selector: "my-view-expense",
    templateUrl: './view-expense.component.html',
    styleUrls: ['./view-expense.component.css']
})
export class ViewExpenseComponent implements OnInit {
    @ViewChild('DatePickContainer1') datePickContainer1;
    @ViewChild('DatePickContainer2') datePickContainer2;

    private gridApi;
    private gridColumnApi;

    public columnDefs: any[];
    public rowData;

    private errorMessage: string;
    private RefData: any[];

    startDateSelectedDate;
    endDateSelectedDate;
    endDateMinVal;
    startDateString;
    endDateString;
    public paginationPageSize: any;
    public rowSelection;
    private reportid;
    private status;
    selectedStatusExpense = "N";
    responseData:any;
    showSuccessAlert=false;
    successTextMessage='';
    itemsPerPageList = [5,10,20,50,100];
    currentPageItemCount = 10; 


    selectedDates: DateOnDashboard = new DateOnDashboard('thisMonth', 'This Month');
    listdates = [
        new DateOnDashboard('thisWeek', 'This Week'),
        new DateOnDashboard('lastWeek', 'Last Week'),
        new DateOnDashboard('lastBiWeek', 'Last bi-week'),
        new DateOnDashboard('thisMonth', 'This Month'),
        new DateOnDashboard('lastMonth', 'Last Month'),
        new DateOnDashboard('thisYear', 'This Year'),
        new DateOnDashboard('dateRange', 'Date Range')
    ];

    constructor(private _viewExpensesService: ViewExpensesService, private router: Router, private route: ActivatedRoute) {
        // this.rowData = this.createRowData();
        this.columnDefs = this.createColumnDefs();

    }

    ngOnInit() {
        this.responseData=this.route.snapshot.params;
        if(this.responseData){
            this.showSuccessAlert = this.responseData.p1;
            this.successTextMessage = this.responseData.p2;
            let ref = this;
            setTimeout(function () {
                ref.showSuccessAlert = false
            }, 5000);
        }

        this.paginationPageSize = 10;
        // this.getAllExpensesByWeek();
        if (this._viewExpensesService.data) {
            let tmpData = this._viewExpensesService.data;
            this.selectedDates.id = tmpData.selectedDate;
            this.selectedStatusExpense = tmpData.status;
            this.status = tmpData.status;
            this.startDateString = tmpData.startDateString;
            this.endDateString = tmpData.endDateString;
            if (tmpData.selectedDate == "dateRange" && tmpData.startDateString!=undefined && tmpData.endDateString!=undefined) {
                let startDate: string[] = tmpData.startDateString.split('-');
                this.startDateSelectedDate = { year: Number(startDate[0]), month: Number(startDate[1]), day: Number(startDate[2]) };
                let endDate: string[] = tmpData.endDateString.split('-');
                this.endDateSelectedDate = { year: Number(endDate[0]), month: Number(endDate[1]), day: Number(endDate[2]) };
            }
            this.getExpensesByDateAndStatus(tmpData.status, tmpData.selectedDate, tmpData.startDateString, tmpData.endDateString, this.currentPageItemCount)
        } else {
            this.getInitialExpensesByDateAndStatus();
        }

    }

    getInitialExpensesByDateAndStatus() {
        this.status = "N";
        let selectedDate = this.selectedDates.id;
        this.getExpensesByDateAndStatus(this.status, selectedDate, "", "",this.currentPageItemCount)
    }

    getExpensesByDateAndStatus(status, selectedDate, startDateString, endDateString, itemCount) {
        this._viewExpensesService.data = undefined;
        let urlData = "";
        if (selectedDate == "dateRange") {
            urlData = "status=" + status + "&startDate=" + this.startDateString + "&endDate=" + this.endDateString + "&selectedDateRange=&userId=&limitSize="+itemCount;
        } else {
            urlData = "status=" + status + "&startDate=&endDate=&selectedDateRange=" + selectedDate + "&userId=&limitSize="+itemCount;
        }

        if (status === 'P') {
            this._viewExpensesService.getReimbursedExpenses(urlData).subscribe(response => {
                this.rowData = response;
                this.columnDefs = this.createReimburseColumnDefs();
            },
                error => this.errorMessage = <any>error);
        } else {
            this._viewExpensesService.getExpensesByDateAndStatus(urlData).subscribe(response => {
                this.rowData = response;
                this.columnDefs = this.createColumnDefs();
            },
                error => this.errorMessage = <any>error);
        }
        // this._viewExpensesService.getExpensesByDateAndStatus(urlData).subscribe(response=>{
        //     this.rowData = response;
        // },
        // error=>this.errorMessage =<any>error);
    }

    getAllExpensesByWeek() {
        let status = "N";
        this._viewExpensesService.statusBasedExpenses(status).subscribe(response => {
            this.rowData = response;
        },
            error => this.errorMessage = <any>error);
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: "Report Id",
                field: "reportid",
                width: 150,
                autoHeight: true
            },
            {
                headerName: "Created Date",
                field: "submitedDate",
                filter: 'date',
                width: 220,
                autoHeight: true
            }, {
                headerName: "Expense Date Range",
                field: "expenseWeekDate",
                filter: 'date',
                suppressFilter: true,
                width: 330,
                autoHeight: true
            },
            {
                headerName: "Total Amount",
                field: "totalAmount",
                suppressFilter: true,
                width: 190,
                autoHeight: true,
                valueFormatter: function(params){
                    let numVal = Number(params.value.split(" ")[1]);
                    return params.value.split(" ")[0] + ' '+ numVal.toFixed(2); 
                }

            },
            // {
            //     headerName: "Department",
            //     field: "department",
            //     suppressFilter: true,
            //     width: 110,
            //     autoHeight: true
            // },
            {
                headerName: "Location",
                field: "location",
                suppressFilter: true,
                width: 230,
                autoHeight: true
            },
            {
                headerName: "Status",
                field: "status",
                filter: 'status',
                width: 205,
                autoHeight: true
            },


        ];
        this.rowSelection = "multiple";
        return columnDefs;
    }

    private createRowData(): any {
        const rowData: any[] = [];
        this._viewExpensesService.getAllExpensesByWeek().subscribe(response => {
            this.rowData = response;
        },
            error => this.errorMessage = <any>error);
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        //params.api.sizeColumnsToFit();

        //params.api.sizeColumnsToFit();
        /*window.addEventListener("resize", function () {
            setTimeout(function () {
                params.api.sizeColumnsToFit();
            });
        });*/
    }

    createExpense() {
        this.router.navigate(['../create-expense'], { relativeTo: this.route });
    }

    onSelect(daterange: string) {
        if (daterange != 'dateRange') {
            this.startDateString = "";
            this.endDateString = "";
            this.startDateSelectedDate = { year: Number(), month: Number(), day: Number() };
            this.endDateSelectedDate = { year: Number(), month: Number(), day: Number() };
            this.getExpensesByDateAndStatus(this.status, daterange, "", "", this.currentPageItemCount);
            // this._viewExpensesService.getAllExpensesForSelectedRange(daterange).subscribe(response => {
            //     this.rowData = response;
            // },
            //     error => this.errorMessage = <any>error);
        }
    }

    checkStartDate() {
        this.endDateMinVal = this.startDateSelectedDate;
        if (this.endDateSelectedDate != undefined && this.endDateSelectedDate.year != 0) {
            let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;
            let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;
            this.myMethod(startDateString, endDateString);
        }

    }

    endDateSelected() {
        if (this.startDateSelectedDate != undefined && this.startDateSelectedDate.year != 0) {
            let endDateString = this.endDateSelectedDate.year + '-' + this.endDateSelectedDate.month + '-' + this.endDateSelectedDate.day;
            let startDateString = this.startDateSelectedDate.year + '-' + this.startDateSelectedDate.month + '-' + this.startDateSelectedDate.day;

            console.log(endDateString + '<=====>' + startDateString);
            this.myMethod(startDateString, endDateString);
        }

    }

    myMethod(startDateString, endDateString) {
        this.startDateString = startDateString;
        this.endDateString = endDateString;
        this.getExpensesByDateAndStatus(this.status, "dateRange", this.startDateString, this.endDateString, this.currentPageItemCount);
        // this._viewExpensesService.getExpensesInDateRange(startDateString, endDateString).subscribe(response => {
        //     this.rowData = response;
        // },
        //     error => this.errorMessage = <any>error);
    }

    onRowSelected(event) {
        let data = {
            status: this.status,
            selectedDate: this.selectedDates.id,
            startDateString: this.startDateString,
            endDateString: this.endDateString
        };
        this._viewExpensesService.data = data;
        this.reportid = event.node.data.reportid;
        this.status = event.node.data.status;

        if (event.node.selected && (event.node.data.status == "Open" || event.node.data.status == "Rejected")) {
            this.router.navigate(['../edit-expense', this.reportid, this.status], { relativeTo: this.route });
        } else if (event.node.selected && (event.node.data.status == "Approved" || event.node.data.status == "Submitted")) {
            this.router.navigate(['../review-expense', this.reportid, this.status], { relativeTo: this.route });
        } else if (event.node.selected && event.node.data.status == "Reimbursed") {
            this.router.navigate(['../reimbursed-expense', this.reportid, this.status], { relativeTo: this.route });
        }
    }

    onSelectionChanged(event) {

    }

    statusBasedExpenses(event, status) {
        // var target = event.target || event.srcElement || event.currentTarget;
        // var x = document.getElementsByClassName("btn");
        // var i;
        // for (i = 0; i < x.length; i++) {
        //     x[i].classList.remove("active");
        // }
        // document.getElementById(target.attributes.id.nodeValue).classList.add('active');
        this.selectedStatusExpense = status;
        this.status = status;
        this.getExpensesByDateAndStatus(status, this.selectedDates.id, "", "", this.currentPageItemCount);
        // if(status === 'P') {
        //     this._viewExpensesService.expensesForReimbursed(status).subscribe(response => {
        //         this.rowData = response;
        //         this.columnDefs = this.createReimburseColumnDefs();
        //     },
        //     error => this.errorMessage = <any>error);
        // } else {
        //     this._viewExpensesService.statusBasedExpenses(status).subscribe(response => {
        //         this.rowData = response;
        //         this.columnDefs = this.createColumnDefs();
        //     },
        //     error => this.errorMessage = <any>error);
        // }
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

    /*submittedStatus(){
        this.status = "S";
        this._viewExpensesService.getSubmittedStatusExpenses(this.status).subscribe(response => {
            this.rowData = response;
        },
            error => this.errorMessage = <any>error);
    }

    rejectedStatus(){
        this.status = "R";
        this._viewExpensesService.getRejectedStatusExpenses(this.status).subscribe(response => {
            this.rowData = response;
        },
            error => this.errorMessage = <any>error);
    }

    allStatus(){
        this.status = "A";
        this._viewExpensesService.getAllStatusExpenses(this.status).subscribe(response => {
            this.rowData = response;
        },
            error => this.errorMessage = <any>error);
    }*/

    private createReimburseColumnDefs() {
        const columnDefs = [
            {
                headerName: "Report Id",
                field: "reportid",
                width: 120,
                autoHeight: true
            },
            {
                headerName: "Created Date",
                field: "submitedDate",
                filter: 'date',
                width: 140,
                autoHeight: true
            }, {
                headerName: "Expense Date Range",
                field: "expenseWeekDate",
                filter: 'date',
                suppressFilter: true,
                width: 230,
                autoHeight: true
            },
            {
                headerName: "Total Amount",
                field: "totalAmount",
                suppressFilter: true,
                width: 150,
                autoHeight: true,
                valueFormatter: function(params){
                    if(params.value){
                        let numVal = Number(params.value.split(" ")[1]);
                        return params.value.split(" ")[0] + ' '+ numVal.toFixed(2); 
                    }
                    
                }
            },
            {
                headerName: "Reimbursable Amount",
                field: "totalReimburseAmount",
                suppressFilter: true,
                width: 180,
                autoHeight: true,
                valueFormatter: function(params){
                    if(params.value){
                        let numVal = Number(params.value.split(" ")[1]);
                        return params.value.split(" ")[0] + ' '+ numVal.toFixed(2); 
                    }
                }

            },
            {
                headerName: "Balance Amount",
                field: "balanceAmount",
                suppressFilter: true,
                width: 150,
                autoHeight: true,
                valueFormatter: function(params){
                    if(params.value){
                        let numVal = Number(params.value.split(" ")[1]);
                        return params.value.split(" ")[0] + ' '+ numVal.toFixed(2); 
                    }
                    
                  }
            },
            //{
            //    headerName: "Department",
            //    field: "department",
            //    suppressFilter: true,
            //    width: 110,
            //    autoHeight: true
            //},
            {
                headerName: "Status",
                field: "status",
                filter: 'status',
                width: 140,
                autoHeight: true
            },


        ];
        this.rowSelection = "multiple";
        return columnDefs;
    }

    onClick() {
       
        this.router.navigate(
          ["/expenses/expense-payment"],
          { relativeTo: this.route }
        );
      }

    chengePageSize(itemCount){
        this.currentPageItemCount = itemCount;
        let selectedDate = this.selectedDates.id;
        this.getExpensesByDateAndStatus(this.status, selectedDate, "", "", itemCount)
    }
}
