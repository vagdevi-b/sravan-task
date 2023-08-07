import { Injectable } from '@angular/core'
import { PandlService } from './pandl.service'
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class PandlDetailsTabService {
  constructor(private pandlService: PandlService) {}

  getCustomerGridData(gridData: any[]): any {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
    }
    let customersGrid = []
    let uniqueCustomers = []
    uniqueCustomers = this.pandlService.getUniqueDataAfterFilter(
      gridData,
      'customer_id',
    )
    let customers = []
    const uniqueCustomerDetails = uniqueCustomers.map(
      (customerDetails: any) => {
        return {
          customerId: customerDetails.customer_id,
          customer: customerDetails.customer,
        }
      },
    )
    for (let i = 0; i < uniqueCustomers.length; i++) {
      customers.push(uniqueCustomers[i].customer_id)
    }
    let totalcost = 0
    let totalrevenue = 0
    let totalmargin = 0
    for (let i = 0; i < customers.length; i++) {
      let customerGridData = []
      customerGridData = gridData.filter(
        (data: any) => data.customer_id === customers[i],
      )
      let cost = 0
      let revenue = 0
      let margin = 0
      cost = customerGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_cost,
        0,
      )
      revenue = customerGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_revenue,
        0,
      )
      if (revenue === 0 && cost === 0) {
        margin = 0
      } else if (revenue === 0 && cost != 0) {
        margin = -100
      } else {
        margin = (100 * (revenue - cost)) / revenue
      }
      totalcost = totalcost + cost
      totalrevenue = totalrevenue + revenue
      // if (!isFinite(margin)) {
      //   margin = 0;
      // }
      const customerName = uniqueCustomerDetails.filter(
        (customer) => customer.customerId === customers[i],
      )[0].customer
      let obj = {
        customer: customerName,
        cost: this.pandlService.roundTo(cost, 0),
        revenue: this.pandlService.roundTo(revenue, 0),
        margin: this.pandlService.roundTo(margin, 0),
      }
      customersGrid.push(obj)
    }

    // for (let i = 0; i < customersGrid.length; i++) {
    //   totalcost = totalcost + this.pandlService.localeStringToNumber(customersGrid[i].cost);
    //   totalrevenue = totalrevenue + this.pandlService.localeStringToNumber(customersGrid[i].revenue);
    // }
    if (totalcost === 0 && totalrevenue === 0) {
      totalmargin = 0
    } else if (totalcost != 0 && totalrevenue === 0) {
      totalmargin = -100
    } else {
      totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
    }
    if (!isFinite(totalmargin)) {
      totalmargin = 0
    }
    const customersGridTotal = {
      customer: 'Total',
      cost: this.pandlService.roundTo(totalcost, 0).toLocaleString(),
      revenue: this.pandlService.roundTo(totalrevenue, 0).toLocaleString(),
      margin: this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
    }
    customersGrid = _.sortBy(customersGrid, 'customer')
    extractedDetails.dataList = customersGrid
    extractedDetails.dataTotals = customersGridTotal
    return extractedDetails
  }
  getCustomerGridDataTotals(gridData:any[]){
    let totalcost=0;
    let totalrevenue=0
    let totalmargin=0
gridData.forEach(element => {
  let cost=0;
  let revenue=0;
  let margin=0;
  cost=element.cost
  revenue=element.revenue
  totalcost=totalcost+cost
  totalrevenue=totalrevenue+revenue
  if (cost === 0 && revenue === 0) {
    margin = 0
  } else if (cost != 0 && revenue === 0) {
    margin = -100
  } else {
    margin = (100 * (revenue - cost)) / revenue
  }
  if (totalcost === 0 && totalrevenue === 0) {
    totalmargin = 0
  } else if (totalcost != 0 && totalrevenue === 0) {
    totalmargin = -100
  } else {
    totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
  }
});
let obj={
  cusomer:'Total',
  cost:this.pandlService.roundTo(totalcost,0).toLocaleString(),
  revenue:this.pandlService.roundTo(totalrevenue,0).toLocaleString(),
  margin:this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
}
return obj;
  }

  getprojectGridData(gridData: any[]) {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
    }
    let projectsGrid: any[] = []
    let uniqueProjects = []
    uniqueProjects = this.pandlService.getUniqueDataAfterFilter(
      gridData,
      'project_id',
    )
    let projects = []
    const uniqueProjectDetails = uniqueProjects.map((projectDetails: any) => {
      return {
        projectId: projectDetails.project_id,
        project: projectDetails.project,
      }
    })
    for (let i = 0; i < uniqueProjects.length; i++) {
      projects.push(uniqueProjects[i].project_id)
    }
    let totalcost = 0
    let totalrevenue = 0
    let totalmargin = 0
    for (let i = 0; i < projects.length; i++) {
      let projectsGridData = []
      projectsGridData = gridData.filter(
        (data: any) => data.project_id === projects[i],
      )
      // projectsGridData = this.pandlService.filterArray(gridData, filterobj);
      let cost = 0
      let revenue = 0
      let margin = 0
      cost = projectsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_cost,
        0,
      )
      revenue = projectsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_revenue,
        0,
      )
      totalcost = totalcost + cost
      totalrevenue = totalrevenue + revenue
      if (cost === 0 && revenue === 0) {
        margin = 0
      } else if (cost != 0 && revenue === 0) {
        margin = -100
      } else {
        margin = (100 * (revenue - cost)) / revenue
      }
      if (!isFinite(margin)) {
        margin = 0
      }
      const projectName = uniqueProjectDetails.filter(
        (project) => project.projectId === projects[i],
      )[0].project
      let obj = {
        project: projectName,
        cost: this.pandlService.roundTo(cost, 0),
        revenue: this.pandlService.roundTo(revenue, 0),
        margin: this.pandlService.roundTo(margin, 0),
      }
      projectsGrid.push(obj)
    }
    if (totalcost === 0 && totalrevenue === 0) {
      totalmargin = 0
    } else if (totalcost != 0 && totalrevenue === 0) {
      totalmargin = -100
    } else {
      totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
    }
    if (!isFinite(totalmargin)) {
      totalmargin = 0
    }
    let projectGridTotal = {
      project: 'Total',
      cost: this.pandlService.roundTo(totalcost, 0).toLocaleString(),
      revenue: this.pandlService.roundTo(totalrevenue, 0).toLocaleString(),
      margin: this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
    }
    projectsGrid = _.sortBy(projectsGrid, 'project')
    extractedDetails.dataList = projectsGrid
    extractedDetails.dataTotals = projectGridTotal
    return extractedDetails
  }

  getEmpOrgGridData(gridData: any[]) {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
    }
    let empOrgGrid: any[] = []
    let uniqueEmpOrgs = []
    uniqueEmpOrgs = this.pandlService.getUniqueDataAfterFilter(
      gridData,
      'employee_org',
    )
    let empOrgs = []
    for (let i = 0; i < uniqueEmpOrgs.length; i++) {
      if (uniqueEmpOrgs[i].employee_org !== null) {
        empOrgs.push(uniqueEmpOrgs[i].employee_org)
      }
    }
    let totalcost = 0
    let totalrevenue = 0
    let totalmargin = 0
    for (let i = 0; i < empOrgs.length; i++) {
      let empOrgsGridData = []
      let filterobj = {
        employee_org: empOrgs[i],
      }
      empOrgsGridData = this.pandlService.filterArray(gridData, filterobj)
      let cost = 0
      let revenue = 0
      let margin = 0
      cost = empOrgsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_cost,
        0,
      )
      revenue = empOrgsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_revenue,
        0,
      )
      totalcost = totalcost + cost
      totalrevenue = totalrevenue + revenue
      if (cost === 0 && revenue === 0) {
        margin = 0
      } else if (cost != 0 && revenue === 0) {
        margin = -100
      } else {
        margin = (100 * (revenue - cost)) / revenue
      }
      if (!isFinite(margin)) {
        margin = 0
      }
      let obj = {
        employeeOrg: empOrgs[i],
        cost: this.pandlService.roundTo(cost, 0),
        revenue: this.pandlService.roundTo(revenue, 0),
        margin: this.pandlService.roundTo(margin, 0),
      }
      empOrgGrid.push(obj)
    }

    if (totalcost === 0 && totalrevenue === 0) {
      totalmargin = 0
    } else if (totalcost != 0 && totalrevenue === 0) {
      totalmargin = -100
    } else {
      totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
    }
    if (!isFinite(totalmargin)) {
      totalmargin = 0
    }
    let empOrgGridTotal = {
      employeeOrg: 'Total',
      cost: this.pandlService.roundTo(totalcost, 0).toLocaleString(),
      revenue: this.pandlService.roundTo(totalrevenue, 0).toLocaleString(),
      margin: this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
    }
    empOrgGrid = _.sortBy(empOrgGrid, 'employeeOrg')
    extractedDetails.dataList = empOrgGrid
    extractedDetails.dataTotals = empOrgGridTotal
    return extractedDetails
  }
 
  getEmpGridData(gridData: any[]) {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
    }
    let empGrid: any[] = []
    let uniqueEmps = []
    uniqueEmps = this.pandlService.getUniqueDataAfterFilter(
      gridData,
      'employee_id',
    )
    const uniqueEmployeeDetails = uniqueEmps.map((employeeDetails: any) => {
      return {
        employeeId: employeeDetails.employee_id,
        employee: employeeDetails.employee,
      }
    })
    let emps = []
    for (let i = 0; i < uniqueEmps.length; i++) {
      if (uniqueEmps[i].employee !== null) {
        emps.push(uniqueEmps[i].employee_id)
      }
    }
    let totalbillinghours = 0
    let totalnonbillinghours = 0
    let totalcost = 0
    let totalrevenue = 0
    let totalmargin = 0
    for (let i = 0; i < emps.length; i++) {
      let empsGridData = []
      let filterobj = {
        employee_id: emps[i],
      }
      empsGridData = gridData.filter(
        (data: any) => data.employee_id === emps[i],
      )
      // empsGridData = this.pandlService.filterArray(gridData, filterobj);
      let cost = 0
      let revenue = 0
      let margin = 0
      let billinghours = 0
      let nonbillinghours = 0
      cost = empsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_cost,
        0,
      )
      revenue = empsGridData.reduce(
        (sum, currObj) => sum + currObj.recognized_revenue,
        0,
      )
      billinghours = empsGridData.reduce(
        (sum, currObj) => sum + currObj.billable_hours,
        0,
      )
      nonbillinghours = empsGridData.reduce(
        (sum, currObj) => sum + currObj.non_billable_hours,
        0,
      )
      totalcost = totalcost + cost
      totalrevenue = totalrevenue + revenue
      totalbillinghours = totalbillinghours + billinghours
      totalnonbillinghours = totalnonbillinghours + nonbillinghours
      if (cost === 0 && revenue === 0) {
        margin = 0
      } else if (cost != 0 && revenue === 0) {
        margin = -100
      } else {
        margin = (100 * (revenue - cost)) / revenue
      }
      if (!isFinite(margin)) {
        margin = 0
      }
      const employeeName = uniqueEmployeeDetails.filter(
        (emplDetails) => emplDetails.employeeId === emps[i],
      )[0].employee
      let obj = {
        employee: employeeName,
        cost: this.pandlService.roundTo(cost, 0),
        revenue: this.pandlService.roundTo(revenue, 0),
        margin: this.pandlService.roundTo(margin, 0),
        billinghours: this.pandlService.roundTo(billinghours, 0),
        nonbillinghours: this.pandlService.roundTo(nonbillinghours, 0),
      }
      empGrid.push(obj)
    }

    if (totalcost === 0 && totalrevenue === 0) {
      totalmargin = 0
    } else if (totalcost != 0 && totalrevenue === 0) {
      totalmargin = -100
    } else {
      totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
    }
    if (!isFinite(totalmargin)) {
      totalmargin = 0
    }
    let empOrgGridTotal = {
      employee: 'Total',
      billinghours: this.pandlService
        .roundTo(totalbillinghours, 0)
        .toLocaleString(),
      nonbillinghours: this.pandlService
        .roundTo(totalnonbillinghours, 0)
        .toLocaleString(),
      cost: this.pandlService.roundTo(totalcost, 0).toLocaleString(),
      revenue: this.pandlService.roundTo(totalrevenue, 0).toLocaleString(),
      margin: this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
    }
    empGrid = _.sortBy(empGrid, 'employee')
    extractedDetails.dataList = empGrid
    extractedDetails.dataTotals = empOrgGridTotal
    // console.log(this.empGridTotal, 'etotalgrid');
    return extractedDetails
  }
  getEmpGridDataTotals(gridData:any){
    let totalcost=0;
    let totalrevenue=0
    let totalmargin=0
    let totalbillinghours=0
    let totalnonbillinghours=0
gridData.forEach(element => {
  let cost=0;
  let revenue=0;
  let margin=0;
  let billinghours=0
  let nonbillinghours=0
  cost=element.cost
  revenue=element.revenue
  billinghours=element.billinghours
  nonbillinghours=element.nonbillinghours
  totalcost=totalcost+cost
  totalrevenue=totalrevenue+revenue
  totalbillinghours=totalbillinghours+billinghours
  totalnonbillinghours=totalnonbillinghours+nonbillinghours
  if (cost === 0 && revenue === 0) {
    margin = 0
  } else if (cost != 0 && revenue === 0) {
    margin = -100
  } else {
    margin = (100 * (revenue - cost)) / revenue
  }
  if (totalcost === 0 && totalrevenue === 0) {
    totalmargin = 0
  } else if (totalcost != 0 && totalrevenue === 0) {
    totalmargin = -100
  } else {
    totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
  }
});
let obj={
  customer:'Total',
  billinghours:this.pandlService.roundTo(totalbillinghours,0).toLocaleString(),
  nonbillinghours:this.pandlService.roundTo(totalnonbillinghours,0).toLocaleString(),
  cost:this.pandlService.roundTo(totalcost,0).toLocaleString(),
  revenue:this.pandlService.roundTo(totalrevenue,0).toLocaleString(),
  margin:this.pandlService.roundTo(totalmargin, 2).toLocaleString(),
}
return obj;

  }


  getYearMonthGridData(gridData: any[]) {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
    }
    let constructedList = []
    let summaryTotals
    let yearmonthdata
    let projectdata
    let sowdata
    let statusdata
    let pmdata
    let employeedata
    let costdata
    let revenuedata
    let billableExpensesdata
    let nonBillableExpensesdata
    let billableHoursdata
    let nonBillableHoursdata
    let internalHoursdata
    let holidayHoursdata
    let ptoHoursdata
    let specailLeaveHoursdata
    let totalcost = 0
    let totalrevenue = 0
    let totalbillableExpenses = 0
    let totalnonBillableExpenses = 0
    let totalBillablehours = 0
    let totalnonbillinghours = 0
    let totalinternalhours = 0
    let totalholidayhours = 0
    let totalptohours = 0
    let totalspecialleavehours = 0
    gridData.forEach((details: any) => {
      // yearmonthdata=details.year + '-' + details.month,
      const obj = {
        yearmonth: details.year + '-' + details.month,
        project: details.project,
        sow: details.sow_number,
        status: details.project_status,
        pm: details.project_manager,
        employee: details.employee,
        cost: this.pandlService.roundTo(details.recognized_cost, 0),
        revenue: this.pandlService.roundTo(details.recognized_revenue, 0),
        billableExpenses: this.pandlService.roundTo(
          details.billable_expenses,
          0,
        ),
        nonBillableExpenses: this.pandlService.roundTo(
          details.non_billable_expenses,
          0,
        ),
        billableHours: this.pandlService.roundTo(details.billable_hours, 0),
        nonBillableHours: this.pandlService.roundTo(
          details.non_billable_hours,
          0,
        ),
        internalHours: this.pandlService.roundTo(details.internal_hours, 0),
        holidayHours: this.pandlService.roundTo(details.holiday_hours, 0),
        ptoHours: this.pandlService.roundTo(details.pto_hours, 0),
        specailLeaveHours: this.pandlService.roundTo(
          details.special_leave_hours,
          0,
        ),
      }
      totalcost=totalcost+obj.cost
      totalrevenue=totalrevenue+obj.revenue
      totalbillableExpenses=totalbillableExpenses+obj.billableExpenses
      totalnonBillableExpenses=totalnonBillableExpenses+obj.nonBillableExpenses
      totalBillablehours=totalBillablehours+obj.billableHours
      totalnonbillinghours=totalnonbillinghours+obj.nonBillableHours
      totalinternalhours=totalinternalhours+obj.internalHours
      totalholidayhours=totalholidayhours+obj.holidayHours
      totalptohours=totalptohours+obj.ptoHours
      totalspecialleavehours=totalspecialleavehours+obj.specailLeaveHours
      constructedList.push(obj)

      let totalobj = {
        yearmonthdata: 'Total',
        projectdata: '',
        sow: '',
        status: '',
        pm: '',
        employee: '',
        totalcost:this.pandlService.roundTo(totalcost,2).toLocaleString(),
        totalrevenue:this.pandlService.roundTo(totalrevenue,2) .toLocaleString() ,
        totalbillableExpenses:this.pandlService.roundTo(totalbillableExpenses,2) .toLocaleString()  ,
        totalnonBillableExpenses:this.pandlService.roundTo(totalnonBillableExpenses,2).toLocaleString() ,
        totalBillablehours:this.pandlService.roundTo(totalBillablehours,2).toLocaleString() ,
        totalnonbillinghours:this.pandlService.roundTo(totalnonbillinghours,2).toLocaleString()  ,
        totalinternalhours:this.pandlService.roundTo(totalinternalhours,2) .toLocaleString() ,
        totalholidayhours:this.pandlService.roundTo(totalholidayhours,2) .toLocaleString() ,
        totalptohours:this.pandlService.roundTo(totalptohours,2) .toLocaleString() ,
        totalspecialleavehours:this.pandlService.roundTo(totalspecialleavehours,2).toLocaleString() ,
      }
      summaryTotals = totalobj
    })
    // yearmonthdata=constructedList.yearmonth,
    constructedList = _.orderBy(constructedList, [
      'yearmonth',
      'project',
      'employee',
    ])
    extractedDetails.dataList = constructedList
    extractedDetails.dataTotals = summaryTotals
    return extractedDetails
  }
  getEmpRevenueGridDataTotals(gridData:any){
    let totalcost=0;
    let totalrevenue=0
    let totalmargin=0
    let totalbillableExpenses = 0
    let totalnonBillableExpenses = 0
    let totalBillablehours = 0
    let totalnonbillinghours = 0
    let totalinternalhours = 0
    let totalholidayhours = 0
    let totalptohours = 0
    let totalspecialleavehours = 0
gridData.forEach(element => {
  let cost=0;
  let revenue=0;
  let margin=0;
  let billinghours=0
  let nonbillinghours=0
  let billableexpenses=0
  let nonbillableexpenses=0
  let internalHoursdata=0
    let holidayHoursdata=0
    let ptoHoursdata=0
    let specailLeaveHoursdata=0
  cost=element.cost
  revenue=element.revenue
  billinghours=element.billableHours
  nonbillinghours=element.nonBillableHours
  billableexpenses=element.billableExpenses
  nonbillableexpenses=element.nonBillableExpenses
  internalHoursdata=element.internalHours
  holidayHoursdata=element.holidayHours
  ptoHoursdata=element.ptoHours
  specailLeaveHoursdata=element.specailLeaveHours
  totalcost=totalcost+cost
  totalrevenue=totalrevenue+revenue
  totalbillableExpenses=totalbillableExpenses+billableexpenses
  totalnonBillableExpenses=totalnonBillableExpenses+nonbillableexpenses
  totalBillablehours=totalBillablehours+billinghours
  totalnonbillinghours=totalnonbillinghours+nonbillinghours
  totalinternalhours=totalinternalhours+internalHoursdata
  totalholidayhours=totalholidayhours+holidayHoursdata
  totalptohours=totalptohours+ptoHoursdata
  totalspecialleavehours=totalspecialleavehours+specailLeaveHoursdata
  if (cost === 0 && revenue === 0) {
    margin = 0
  } else if (cost != 0 && revenue === 0) {
    margin = -100
  } else {
    margin = (100 * (revenue - cost)) / revenue
  }
  if (totalcost === 0 && totalrevenue === 0) {
    totalmargin = 0
  } else if (totalcost != 0 && totalrevenue === 0) {
    totalmargin = -100
  } else {
    totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
  }
});
let obj={
  yearmonthdata: 'Total',
        projectdata: '',
        sow: '',
        status: '',
        pm: '',
        employee: '',
        totalcost:this.pandlService.roundTo(totalcost,2).toLocaleString(),
        totalrevenue:this.pandlService.roundTo(totalrevenue,2) .toLocaleString() ,
        totalbillableExpenses:this.pandlService.roundTo(totalbillableExpenses,2) .toLocaleString()  ,
        totalnonBillableExpenses:this.pandlService.roundTo(totalnonBillableExpenses,2).toLocaleString() ,
        totalBillablehours:this.pandlService.roundTo(totalBillablehours,2).toLocaleString() ,
        totalnonbillinghours:this.pandlService.roundTo(totalnonbillinghours,2).toLocaleString()  ,
        totalinternalhours:this.pandlService.roundTo(totalinternalhours,2) .toLocaleString() ,
        totalholidayhours:this.pandlService.roundTo(totalholidayhours,2) .toLocaleString() ,
        totalptohours:this.pandlService.roundTo(totalptohours,2) .toLocaleString() ,
        totalspecialleavehours:this.pandlService.roundTo(totalspecialleavehours,2).toLocaleString() ,

}
return obj;

  }
  getEmpOrgcharts(gridData: any[], widget: any) {
    let costData = []
    let revenueData = []
    let empOrgs = []
    empOrgs = this.pandlService.getUniqueDataAfterFilter(
      gridData,
      'employee_org',
    )
    let empOrgLabels = []
    for (let i = 0; i < empOrgs.length; i++) {
      if (empOrgs[i].employee_org !== null) {
        empOrgLabels.push(empOrgs[i].employee_org)
      }
    }
    let empOrgChartData = []
    let constructedData = []
    for (let i = 0; i < empOrgLabels.length; i++) {
      const data = {
        label: empOrgLabels[i],
        cost: 0,
        revenu: 0,
      }
      let filterObj = {
        employee_org: empOrgLabels[i],
      }
      empOrgChartData = this.pandlService.filterArray(gridData, filterObj)
      let costsum = 0
      let revenuesum = 0
      for (let j = 0; j < empOrgChartData.length; j++) {
        costsum = costsum + empOrgChartData[j].recognized_cost
        revenuesum = revenuesum + empOrgChartData[j].recognized_revenue
      }
      data.cost = Math.round(costsum)
      data.revenu = Math.round(revenuesum)
      constructedData.push(data)
      // costData.push(Math.round(costsum));
      // revenueData.push(Math.round(revenuesum));
    }
    constructedData = _.orderBy(
      constructedData,
      ['cost', 'revenu'],
      ['desc', 'desc'],
    )
    empOrgLabels = constructedData.map((data: any) => {
      return data.label
    })
    costData = constructedData.map((data: any) => {
      return data.cost
    })
    revenueData = constructedData.map((data: any) => {
      return data.revenu
    })
    widget.details.data.labels = empOrgLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Cost') {
        dataset.data = costData
      } else if (dataset.label === 'Revenue') {
        dataset.data = revenueData
      }
    })
    return widget
  }
}
