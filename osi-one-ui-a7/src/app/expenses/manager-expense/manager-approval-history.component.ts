import { Component, ViewChild, OnInit } from "@angular/core";
import { DateOnDashboard } from "../../shared/utilities/DateOnDashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { GridOptions } from "ag-grid";
import { ViewExpensesService } from "../../shared/services/viewexpenses.service";
import { ManagerExpenseService } from '../../shared/services/manager.expense.service';

@Component({
    selector: 'app-manager-expense',
    templateUrl: './manager-approval-history.component.html',
    styleUrls: ['./manager-approval-history.component.css']
})
export class ManagerApprovalHistoryComponent implements OnInit {
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


    selectedDates: DateOnDashboard = new DateOnDashboard('thisMonth', 'This Month');
    listdates = [
        new DateOnDashboard('thisWeek', 'This Week'),
        new DateOnDashboard('lastWeek', 'Last Week'),
        new DateOnDashboard('lastBiWeek', 'Last bi-week'),
        new DateOnDashboard('thisMonth', 'This Month'),
        new DateOnDashboard('lastMonth', 'Last Month'),
        new DateOnDashboard('dateRange', 'Date Range')
    ];

    // constructor(private _viewExpensesService: ViewExpensesService, private router: Router, private route: ActivatedRoute) {
    //     this.columnDefs = this.createColumnDefs();

    // }
    constructor(private _managerExpenseService: ManagerExpenseService, private router: Router, private route: ActivatedRoute) {
        // this.rowData = this.createRowData();
        this.columnDefs = this.createColumnDefs();

    }
    

    ngOnInit() {

        this.paginationPageSize = 10;
        // this.getAllExpensesByWeek();
        this.getInitialExpensesByDateAndStatus();

    }

    getInitialExpensesByDateAndStatus() {
        this.status = "O";
        let selectedDate = this.selectedDates.id;
        this.getExpensesByDateAndStatus(this.status, selectedDate, "", "")
    }

    getExpensesByDateAndStatus(status, selectedDate, startDateString, endDateString) {
        this._managerExpenseService.data = undefined;
        let urlData = "";
        if (selectedDate == "dateRange") {
            urlData = "status=" + status + "&startDate=" + this.startDateString + "&endDate=" + this.endDateString + "&selectedDateRange=&userId=";
        } else {
            urlData = "status=" + status + "&startDate=&endDate=&selectedDateRange=" + selectedDate + "&userId=";
        }

        if (status === 'P') {
            // this._viewExpensesService.getReimbursedExpenses(urlData).subscribe(response => {
            //     this.rowData = response;
            //     this.columnDefs = this.createReimburseColumnDefs();
            // },
            //     error => this.errorMessage = <any>error);
        } else {
            this._managerExpenseService.getExpensesByDateAndStatus(urlData).subscribe(response => {
                this.rowData = response;
                this.columnDefs = this.createColumnDefs();
            },
                error => this.errorMessage = <any>error);
        }
    }

    private createColumnDefs() {
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
                width: 170,
                autoHeight: true
            }, {
                headerName: "Expense Date Range",
                field: "expenseWeekDate",
                filter: 'date',
                suppressFilter: true,
                width: 180,
                autoHeight: true
            },
            {
                headerName: "Employee Name",
                field: "employeeName",
                suppressFilter: true,
                width: 180,
                autoHeight: true
            },
            {
                headerName: "Total Amount",
                field: "totalAmount",
                suppressFilter: true,
                width: 140,
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
                width: 170,
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

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
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
            this.getExpensesByDateAndStatus(this.status, daterange, "", "");
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
        this.getExpensesByDateAndStatus(this.status, "dateRange", this.startDateString, this.endDateString);
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
        this._managerExpenseService.data = data;
        this.reportid = event.node.data.reportid;
        this.status = event.node.data.status;

        if (event.node.selected && (event.node.data.status == "Approved" || event.node.data.status == "Rejected")) {
            this.router.navigate(['../review-manager-expense', this.reportid, this.status], { relativeTo: this.route });
        } else if (event.node.selected && event.node.data.status == "Reimbursed") {
            this.router.navigate(['../reimbursed-expense', this.reportid, this.status], { relativeTo: this.route });
        }
    }

    onSelectionChanged(event) {

    }

    statusBasedExpenses(event, status) {
        this.selectedStatusExpense = status;
        this.status = status;
        this.getExpensesByDateAndStatus(status, this.selectedDates.id, "", "");
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
                headerName: "Reimbursible Amount",
                field: "totalReimburseAmount",
                suppressFilter: true,
                width: 180,
                autoHeight: true,
                valueFormatter: function(params){
                    if(params.value){
                        let numVal = Number(params.value.split(" ")[1]);
                        return params.value.split(" ")[0] + ' '+ numVal.toFixed(Math.max(((numVal+'').split(".")[1]||"").length, 2)); 
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
                        return params.value.split(" ")[0] + ' '+ numVal.toFixed(Math.max(((numVal+'').split(".")[1]||"").length, 2)); 
                    }
                    
                  }
            },
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

    showManagerApproval() {
        this.router.navigate(['../manager-expense/'], { relativeTo: this.route });
    }
}
