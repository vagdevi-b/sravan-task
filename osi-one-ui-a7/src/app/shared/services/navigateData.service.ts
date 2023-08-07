import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavigateDataService {

    //Variable to get the employeeId for the searched expense
    public reportEmployeeId;

    //Variables for Expense Payments Page
    public pmoFilterStatus = "N";
    public pmoFilterSelectedDate = "all";
    public pmoFilterStartDateString = "";
    public pmoFilterEndDateString = "";
    public pmoFilterSearchReportId = "";
    public pmoFilterEmpName = "";
    public pmoFilterEmpId = "";
    public pmoDatePickerStartDate;
    public pmoDatePickerEndDate;

    //Variables for PmoExpenses Page
    public pmoExpenseFilterStatus = "N";
    public pmoExpenseFilterSelectedDate = "all";
    public pmoExpenseFilterStartDateString = "";
    public pmoExpenseFilterEndDateString = "";
    public pmoExpenseFilterSearchReportId = "";
    public pmoExpenseFilterEmpName = "";
    public pmoExpenseFilterEmpId = "";
    public pmoExpenseDatePickerStartDate;
    public pmoExpenseDatePickerEndDate;

    //Variables for manager approve expense dropdown
    public managerApproveDateRange = "thisWeek";
    public managerApproveStartDateString = "";
    public managerApproveEndDateString = "";
    public managerApproveDatePickerStartDate;
    public managerApproveDatePickerEndDate;

    private reportId = new BehaviorSubject('');
    private reportStatus =  new BehaviorSubject('');
    private managerApproveEmployeeFilterValue = new BehaviorSubject('');

    public isRouteFromPmoPage = false;    

    currentReportId = this.reportId.asObservable();
    currentReportStatus = this.reportStatus.asObservable();
    currentEmpFilterText = this.managerApproveEmployeeFilterValue.asObservable();

    resetEmployeeNameFilter(filterText:string){
        this.managerApproveEmployeeFilterValue.next(filterText);
    }

    resetReportIdAndStatus(repId: string, repStatus: string) {
        this.reportId.next(repId);
        this.reportStatus.next(repStatus);
    }
}