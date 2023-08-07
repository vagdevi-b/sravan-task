import { Injectable } from '@angular/core';
import { PandlService } from './pandl.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PandlDataTabService {
  gridData: any = [];
  yearMonthGridData: any = [];
  projectsGrid: any = [];
  projectsGridTotal: any = [];
  revenueTotal: any = 0;
  spinner: boolean;
  dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();
  showFilters: boolean;
  showLoading: boolean = false;
  constructor(
    private pandlService: PandlService
  ) { }

  yearMonthGrid(gridData: any[]): any {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
      isFullScreenReq: true
    }
    let constructedList: any[] = [];
    gridData.forEach((details: any) => {
      let obj: any = {};
      let totalHours = details.billable_hours + details.holiday_hours + details.non_billable_hours + details.internal_hours + details.pto_hours + details.special_leave_hours;
      let utilization = (details.billable_hours / totalHours) * 100;
      let margin = 100 * ((details.recognized_revenue - details.recognized_cost) / details.recognized_revenue);
      if (!isFinite(margin)) {
        margin = 0;
      }
      if (!isFinite(utilization)) {
        utilization = 0;
      }
      obj.yearMonth = details.year + '-' + details.month,
      obj.projectOrg = details.project_org,
      obj.projectBu = details.project_bu,
      obj.projectPractise = details.project_practice,
      obj.customer = details.customer,
      obj.project = details.project,
      obj.sow = details.sow_number,
      obj.cost =  this.pandlService.roundTo(details.recognized_cost, 0),
      obj.revenue = this.pandlService.roundTo(details.recognized_revenue, 0),
      obj.margin =this.pandlService.roundTo(margin, 0) ,
      obj.billableHours =this.pandlService.roundTo(details.billable_hours, 0) ,
      obj.nonBillableHours = this.pandlService.roundTo(details.non_billable_hours, 0),
      obj.holidayHours = this.pandlService.roundTo(details.holiday_hours, 0),
      obj.internalHours = this.pandlService.roundTo(details.internal_hours, 0),
      obj.ptoHours = this.pandlService.roundTo(details.pto_hours, 0),
      obj.specailLeaveHours =this.pandlService.roundTo(details.special_leave_hours, 0) ,
      obj.totalHours =this.pandlService.roundTo(totalHours, 0) ,
      obj.utilization = this.pandlService.roundTo(utilization, 0),
      obj.pm = details.project_manager,
      obj.employee = details.employee,
      obj.employeeStatus = details.employee_status,
      obj.employeeOrg = details.employee_org,
      obj.employeeBu = details.employee_bu,
      obj.employeePractice = details.employee_practice,
      obj.employeeSubPractice = details.employee_sub_practice,
      obj.employeeTitle = details.employee_title,
      obj.billableExpenses = this.pandlService.roundTo(details.billable_expenses, 0),
      obj.nonBillableExpenses = this.pandlService.roundTo(details.non_billable_expenses, 0),
      obj.level1 = details.Level_1,
      obj.level2 = details.Level_2,
      obj.level3 = details.Level_3,
      obj.projectStatus = details.project_status
      constructedList.push(obj);
    });
    constructedList = _.orderBy(constructedList, ['yearMonth', 'project', 'employee']);
    extractedDetails.dataList = constructedList;
    return extractedDetails;
  }




}
