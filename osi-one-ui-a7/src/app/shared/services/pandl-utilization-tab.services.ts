import { Injectable } from '@angular/core';
import { PandlService } from './pandl.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PandlUtilizationTabService {
  gridData: any = [];
  empUtilGrid: any = [];
  projUtilGrid: any = [];
  yearMonthUtilGrid: any = [];
  empOrgUtilGrid: any = [];
  empOrgTotalUtil: any = 0;
  empUtilGridTotal = {
    "totalutilization": 0,
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  projectsUtilGridTotal = {
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  yearMonthUtilGridTotal = {
    "totalutilization": 0,
    "totalbillinghours": '',
    "totalnonbillinghours": '',
    "totalinternalhours": '',
    "totalholidayhours": '',
    "totalptohours": '',
    "totalspecialleavehours": ''
  };
  dtOptions: DataTables.Settings = {};
  showFilters: boolean;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  spinner: boolean;
  xyz: any = [];
  // subscriptions: Subscription [] = [];
  constructor(
    private pandlService: PandlService
  ) { }
  localeStringToNumber(numStr) {
    let num = numStr.replace(/\D/g, '');
    //1000000  (string)

    let num2 = parseInt(num);
    //1000000  (numeric)
    return num2;
  }
  getProjUtilGridData(gridData: any[]): any {

    const extractedDetails = {
      dataList: [],
      dataTotals: {}
    }
    let projectsGrid: any[] = [];
    let uniqueProjects = [];
    uniqueProjects = this.pandlService.getUniqueDataAfterFilter(gridData, "project_id");
    let projects = [];
    const uniqueProjectDetails = uniqueProjects.map((projectDetails: any) => {
      return {
        projectId: projectDetails.project_id,
        project: projectDetails.project
      }
    });
    for (let i = 0; i < uniqueProjects.length; i++) {
      projects.push(uniqueProjects[i].project_id);
    }
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    for (let i = 0; i < projects.length; i++) {
      let projectsGridData = [];
      projectsGridData = gridData.filter((data: any) => data.project_id === projects[i]);
      let billinghours = 0;
      let nonbillinghours = 0;
      let internalhours = 0;
      let holidayhours = 0;
      let ptohours = 0;
      let specialleavehours = 0;
      billinghours = projectsGridData.reduce((sum, currObj) => sum + currObj.billable_hours, 0),
        nonbillinghours = projectsGridData.reduce((sum, currObj) => sum + currObj.non_billable_hours, 0),
        internalhours = projectsGridData.reduce((sum, currObj) => sum + currObj.internal_hours, 0),
        holidayhours = projectsGridData.reduce((sum, currObj) => sum + currObj.holiday_hours, 0),
        ptohours = projectsGridData.reduce((sum, currObj) => sum + currObj.pto_hours, 0),
        specialleavehours = projectsGridData.reduce((sum, currObj) => sum + currObj.special_leave_hours, 0),
        totalbillinghours = totalbillinghours + billinghours;
      totalnonbillinghours = totalnonbillinghours + nonbillinghours;
      totalinternalhours = totalinternalhours + internalhours;
      totalholidayhours = totalholidayhours + holidayhours;
      totalptohours = totalptohours + ptohours;
      totalspecialleavehours = totalspecialleavehours + specialleavehours;
      const projectName = uniqueProjectDetails.filter(project => project.projectId === projects[i])[0].project;
      let obj = {
        "project": projectName,
        "billinghours": this.pandlService.roundTo(billinghours, 0),
        "nonbillinghours": this.pandlService.roundTo(nonbillinghours, 0),
        "internalhours": this.pandlService.roundTo(internalhours, 0),
        "holidayhours": this.pandlService.roundTo(holidayhours, 0),
        "ptohours": this.pandlService.roundTo(ptohours, 0),
        "specialleavehours": this.pandlService.roundTo(specialleavehours, 0),
      }
      projectsGrid.push(obj);
    }
    let projectGridTotal = {
      "project": 'Total',
      "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
      "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
      "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
      "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),
      "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
      "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString(),
    }
    projectsGrid = _.sortBy(projectsGrid, 'project');
    extractedDetails.dataList = projectsGrid;
    extractedDetails.dataTotals = projectGridTotal;
    return extractedDetails;
  }
  getProjectGridDataSummaryTotals(gridData:any){
    let totalutilization = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    gridData.forEach(element => {
      let utilization = 0;
      let billinghours = 0;
      let nonbillinghours = 0;
      let internalhours = 0;
      let holidayhours = 0;
      let ptohours = 0;
      let specialleavehours = 0;
      billinghours=element.billinghours
      nonbillinghours=element.nonbillinghours
      internalhours=element.internalhours
      holidayhours=element.holidayhours
      ptohours=element.ptohours
      specialleavehours=element.specialleavehours
      totalbillinghours = totalbillinghours + billinghours;
      totalnonbillinghours = totalnonbillinghours + nonbillinghours;
      totalinternalhours = totalinternalhours + internalhours;
      totalholidayhours = totalholidayhours + holidayhours;
      totalptohours = totalptohours + ptohours;
      totalspecialleavehours = totalspecialleavehours + specialleavehours;
      // let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
      // totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);

    })
    const projectGridSummaryTotal = {
      "project": 'Total',
      "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
      "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
      "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
      "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),
      "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
      "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString(),
    }
return projectGridSummaryTotal;
  }

  getUtilGridDataTotals(gridData:any){
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    let totalutilization=0;
    gridData.forEach(element => {
      let billinghours = 0;
      let nonbillinghours = 0;
      let internalhours = 0;
      let holidayhours = 0;
      let ptohours = 0;
      let specialleavehours = 0;
      billinghours=element.billinghours
      nonbillinghours=element.nonbillinghours
      internalhours=element.internalhours
      holidayhours=element.holidayhours
      ptohours=element.ptohours
      specialleavehours=element.specialleavehours
      totalbillinghours = totalbillinghours + billinghours;
      totalnonbillinghours = totalnonbillinghours + nonbillinghours;
      totalinternalhours = totalinternalhours + internalhours;
      totalholidayhours = totalholidayhours + holidayhours;
      totalptohours = totalptohours + ptohours;
      totalspecialleavehours = totalspecialleavehours + specialleavehours;
      let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
      totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);
    }
    )
    let projectUtilTotal = {
      "employee": 'Total',
      "utilization": this.pandlService.roundTo(totalutilization, 2).toLocaleString(),
      "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
      "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
      "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
      "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),
      "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
      "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString()
    }
return projectUtilTotal;
  }
  getEmpOrgUtilGridData(gridData: any[]): any {
    const extractedDetails = {
      dataList: [],
      dataTotals: {}
    }
    let uniqueJobCodes = [];
    let uniqueEmpOrg = [];
    let employeeGrid = [];
    let totalutilization = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    let utilization = 0;
    let billinghours = 0;
    let nonbillinghours = 0;
    let internalhours = 0;
    let holidayhours = 0;
    let ptohours = 0;
    let specialleavehours = 0;
    uniqueJobCodes = this.pandlService.getUniqueDataAfterFilter(gridData, "Job_Code");
    uniqueEmpOrg = this.pandlService.getUniqueDataAfterFilter(gridData, "employee_org");
    for (let i = 0; i < uniqueEmpOrg.length; i++) {
      for (let j = 0; j < uniqueJobCodes.length; j++) {
        let filteredList: any[] = gridData.filter(obj => obj.Job_Code === uniqueJobCodes[j].Job_Code && obj.employee_org === uniqueEmpOrg[i].employee_org);
        if (filteredList.length) {
          billinghours = filteredList.reduce((sum, currObj) => sum + currObj.billable_hours, 0);
          nonbillinghours = filteredList.reduce((sum, currObj) => sum + currObj.non_billable_hours, 0);
          internalhours = filteredList.reduce((sum, currObj) => sum + currObj.internal_hours, 0);
          holidayhours = filteredList.reduce((sum, currObj) => sum + currObj.holiday_hours, 0);
          ptohours = filteredList.reduce((sum, currObj) => sum + currObj.pto_hours, 0);
          specialleavehours = filteredList.reduce((sum, currObj) => sum + currObj.special_leave_hours, 0);
          let totalhours = billinghours + nonbillinghours + internalhours + holidayhours + ptohours;
          utilization = this.pandlService.roundTo((billinghours / totalhours) * 100, 2);
          if (!isFinite(utilization)) {
            utilization = 0;
          }
          let obj = {
            "employeeOrg": uniqueEmpOrg[i].employee_org,
            "resourceLevel": uniqueJobCodes[j].Job_Code,
            "utilization": this.pandlService.roundTo(utilization, 0),
          }
          employeeGrid.push(obj);
          // totalbillinghours = totalbillinghours + billinghours;
          // totalnonbillinghours = totalnonbillinghours + nonbillinghours;
          // totalinternalhours = totalinternalhours + internalhours;
          // totalholidayhours = totalholidayhours + holidayhours;
          // totalptohours = totalptohours + ptohours;
          // totalspecialleavehours = totalspecialleavehours + specialleavehours;
          // let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
          // totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);
          // if (!isFinite(totalutilization)) {
          //   totalutilization = 0;
          // }
        }
      }
    }
    // const employeeGridTotal = {
    //   "employeeOrg": 'Total',
    //   "resourceLevel": '',
    //   "utilization": this.pandlService.roundTo(totalutilization, 2).toLocaleString(),
    // }
    employeeGrid = _.sortBy(employeeGrid,'employeeOrg');
    extractedDetails.dataList = employeeGrid;
    // extractedDetails.dataTotals = employeeGridTotal;
    return extractedDetails;
  }
 
  getYearMonthUtilGridData(gridData: any[]): any {
    const extractedDetails = {
      dataList: [],
      dataTotals: {}
    }
    let gridList: any[] = [];
    const uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(gridData, "yearmonth");
    let totalutilization = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    for (let i = 0; i < uniqueYearMonths.length; i++) {

      let yearMonthChartData = gridData.filter((data: any) => data.yearmonth === uniqueYearMonths[i].yearmonth);
      let utilization = 0;
      let billinghours = 0;
      let nonbillinghours = 0;
      let internalhours = 0;
      let holidayhours = 0;
      let ptohours = 0;
      let specialleavehours = 0;
      billinghours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.billable_hours, 0);
      nonbillinghours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.non_billable_hours, 0);
      internalhours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.internal_hours, 0);
      holidayhours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.holiday_hours, 0);
      ptohours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.pto_hours, 0);
      specialleavehours = yearMonthChartData.reduce((sum, currObj) => sum + currObj.special_leave_hours, 0);
      let totalhours = billinghours + nonbillinghours + internalhours + holidayhours + ptohours;
      utilization = this.pandlService.roundTo((billinghours / totalhours) * 100, 2);
      if (!isFinite(utilization)) {
        utilization = 0;
      }
      let obj = {
        "yearmonth": uniqueYearMonths[i].year + '-' + uniqueYearMonths[i].month,
        "billinghours": this.pandlService.roundTo(billinghours, 0),
        "nonbillinghours": this.pandlService.roundTo(nonbillinghours, 0),
        "internalhours": this.pandlService.roundTo(internalhours, 0),
        "ptohours": this.pandlService.roundTo(ptohours, 0),
        "holidayhours": this.pandlService.roundTo(holidayhours, 0),
        "utilization": this.pandlService.roundTo(utilization, 0),
        "specialleavehours": this.pandlService.roundTo(specialleavehours, 0),
      }
      gridList.push(obj);
      totalbillinghours = totalbillinghours + billinghours;
      totalnonbillinghours = totalnonbillinghours + nonbillinghours;
      totalinternalhours = totalinternalhours + internalhours;
      totalholidayhours = totalholidayhours + holidayhours;
      totalptohours = totalptohours + ptohours;
      totalspecialleavehours = totalspecialleavehours + specialleavehours;
      let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
      totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);
      if (!isFinite(totalutilization)) {
        totalutilization = 0;
      }
    }
    const employeeGridTotal = {
      "yearmonth": 'Total',
      "utilization": this.pandlService.roundTo(totalutilization, 2).toLocaleString(),
      "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
      "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
      "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
      "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),
      "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
      "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString()
    }

    extractedDetails.dataList = gridList;
    extractedDetails.dataTotals = employeeGridTotal;
    return extractedDetails;
  }
  getYearMonthUtilGridDataTotals(gridData:any){
    let totalutilization = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
gridData.forEach(element=>{
  let utilization = 0;
  let billinghours = 0;
  let nonbillinghours = 0;
  let internalhours = 0;
  let holidayhours = 0;
  let ptohours = 0;
  let specialleavehours = 0;

  billinghours=element.billinghours
  nonbillinghours=element.nonbillinghours
  internalhours=element.internalhours
  holidayhours=element.holidayhours
  ptohours=element.ptohours
  specialleavehours=element.specialleavehours
   let totalhours = billinghours + nonbillinghours + internalhours + holidayhours + ptohours;
      utilization = this.pandlService.roundTo((billinghours / totalhours) * 100, 2);
  totalbillinghours = totalbillinghours + billinghours;
  totalnonbillinghours = totalnonbillinghours + nonbillinghours;
  totalinternalhours = totalinternalhours + internalhours;
  totalholidayhours = totalholidayhours + holidayhours;
  totalptohours = totalptohours + ptohours;
  totalspecialleavehours = totalspecialleavehours + specialleavehours;
  let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
  totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);

})
const employeeGridTotalSummary = {
  "yearmonth": 'Total',
  "utilization": this.pandlService.roundTo(totalutilization, 2).toLocaleString(),
  "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
  "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
  "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
  "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),
  "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
  "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString()
}
return employeeGridTotalSummary;
  }


  getEmpUtilGridData(gridData: any[]): any {
    const extractedDetails = {
      dataList: [],
      dataTotals: {}
    }
    let employeeGrid = [];
    let uniqueEmployeeGrid = [];
    uniqueEmployeeGrid = this.pandlService.getUniqueDataAfterFilter(gridData, "employee_id");
    let employees = [];
    const uniqueEmployeeDetails = uniqueEmployeeGrid.map((employeeDetails: any) => {
      return {
        employeeId: employeeDetails.employee_id,
        employee: employeeDetails.employee
      }
    });
    for (let i = 0; i < uniqueEmployeeGrid.length; i++) {

      employees.push(uniqueEmployeeGrid[i].employee_id);
    }
    let totalutilization = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours = 0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let totalspecialleavehours = 0;
    for (let i = 0; i < employees.length; i++) {
      let employeeGridData = [];
      employeeGridData = gridData.filter((data: any) => data.employee_id === employees[i]);
      let utilization = 0;
      let billinghours = 0;
      let nonbillinghours = 0;
      let internalhours = 0;
      let holidayhours = 0;
      let ptohours = 0;
      let specialleavehours = 0;
      billinghours = employeeGridData.reduce((sum, currObj) => sum + currObj.billable_hours, 0);;
      nonbillinghours = employeeGridData.reduce((sum, currObj) => sum + currObj.non_billable_hours, 0);;
      internalhours = employeeGridData.reduce((sum, currObj) => sum + currObj.internal_hours, 0);
      holidayhours = employeeGridData.reduce((sum, currObj) => sum + currObj.holiday_hours, 0);
      ptohours = employeeGridData.reduce((sum, currObj) => sum + currObj.pto_hours, 0);
      specialleavehours = employeeGridData.reduce((sum, currObj) => sum + currObj.special_leave_hours, 0);
      let totalhours = billinghours + nonbillinghours + internalhours + holidayhours + ptohours;
      utilization = this.pandlService.roundTo((billinghours / totalhours) * 100, 2);
      if (!isFinite(utilization)) {
        utilization = 0;
      }
      const employeeName = uniqueEmployeeDetails.filter(employee => employee.employeeId === employees[i])[0].employee;
      let obj = {
        "employee": employeeName,
        "billinghours": this.pandlService.roundTo(billinghours, 0),
        "nonbillinghours": this.pandlService.roundTo(nonbillinghours, 0),
        "internalhours": this.pandlService.roundTo(internalhours, 0),
        "ptohours": this.pandlService.roundTo(ptohours, 0),
        "holidayhours": this.pandlService.roundTo(holidayhours, 0),
        "utilization": this.pandlService.roundTo(utilization, 0),
        "specialleavehours": this.pandlService.roundTo(specialleavehours, 0),
      }
      employeeGrid.push(obj);
      totalbillinghours = totalbillinghours + billinghours;
      totalnonbillinghours = totalnonbillinghours + nonbillinghours;
      totalinternalhours = totalinternalhours + internalhours;
      totalholidayhours = totalholidayhours + holidayhours;
      totalptohours = totalptohours + ptohours;
      totalspecialleavehours = totalspecialleavehours + specialleavehours;
      let utiltotalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours;
      totalutilization = this.pandlService.roundTo((totalbillinghours / utiltotalhours) * 100, 2);
      if (!isFinite(totalutilization)) {
        totalutilization = 0;
      }
    }

    const employeeGridTotal = {
      "employee": 'Total',
      "utilization": this.pandlService.roundTo(totalutilization, 2).toLocaleString(),

      "billinghours": this.pandlService.roundTo(totalbillinghours, 0).toLocaleString(),
      "nonbillinghours": this.pandlService.roundTo(totalnonbillinghours, 0).toLocaleString(),
      "internalhours": this.pandlService.roundTo(totalinternalhours, 0).toLocaleString(),
      "holidayhours": this.pandlService.roundTo(totalholidayhours, 0).toLocaleString(),

      "ptohours": this.pandlService.roundTo(totalptohours, 0).toLocaleString(),
      "specialleavehours": this.pandlService.roundTo(totalspecialleavehours, 0).toLocaleString()
    }

    employeeGrid = _.sortBy(employeeGrid, 'employee');
    extractedDetails.dataList = employeeGrid;
    extractedDetails.dataTotals = employeeGridTotal;
    return extractedDetails;
  }

 


}
