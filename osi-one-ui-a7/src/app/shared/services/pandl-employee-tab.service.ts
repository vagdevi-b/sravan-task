import { Injectable } from '@angular/core'
import { PandlService } from './pandl.service'
import * as _ from 'lodash'
import { EmployeePandLdataCards } from '../constants/employeetab-chart.contants'
@Injectable({
  providedIn: 'root',
})
export class PandlEmployeeTabService {
  constructor(private pandlService: PandlService) {}

  constructHoursBreakdown(rawData: any[], widget: any): void {
    let yearMonthLabels = []
    let yearMonthBillableHours = []
    let yearMonthNonBillableHours = []
    let yearMonthInternalHours = []
    let yearMonthPtoHours = []
    let yearMonthHolidayHours = []
    let yearMonthSPHours = []
    let utilizationData = []
    let uniqueYearMonths = []
    uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'yearmonth',
    )
    //console.log(uniqueYearMonths, 'yearmonths');
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      let obj = {
        yearmonth: uniqueYearMonths[i].yearmonth,
      }
      let yearMonthChartData = this.pandlService.filterArray(rawData, obj)

      const totalhours = yearMonthChartData.reduce(
        (sum, currObj) =>
          sum +
          currObj.billable_hours +
          currObj.non_billable_hours +
          currObj.internal_hours +
          currObj.pto_hours +
          currObj.holiday_hours +
          currObj.special_leave_hours,
        0,
      )
      const billableHoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.billable_hours,
        0,
      )
      const nonBillableHoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.non_billable_hours,
        0,
      )
      const internalHoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.internal_hours,
        0,
      )
      const holidayHoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.holiday_hours,
        0,
      )
      const specialleavehoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.special_leave_hours,
        0,
      )
      const ptoHoursSum = yearMonthChartData.reduce(
        (sum, currObj) => sum + currObj.pto_hours,
        0,
      )
      const utilizationsum = this.pandlService.roundTo(
        (billableHoursSum / totalhours) * 100,
        2,
      )

      yearMonthLabels.push(
        uniqueYearMonths[i].year + '/' + uniqueYearMonths[i].month,
      )
      yearMonthBillableHours.push(Math.round(billableHoursSum))
      yearMonthNonBillableHours.push(Math.round(nonBillableHoursSum))
      yearMonthInternalHours.push(Math.round(internalHoursSum))
      yearMonthPtoHours.push(Math.round(ptoHoursSum))
      yearMonthSPHours.push(Math.round(specialleavehoursSum))
      yearMonthHolidayHours.push(Math.round(holidayHoursSum))
      utilizationData.push(Math.round(utilizationsum))
    }
    widget.details.data.labels = yearMonthLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Utilization') {
        dataset.data = utilizationData
      } else if (dataset.label === 'Billable') {
        dataset.data = yearMonthBillableHours
      } else if (dataset.label === 'Non Billable') {
        dataset.data = yearMonthNonBillableHours
      } else if (dataset.label === 'Internal') {
        dataset.data = yearMonthInternalHours
      } else if (dataset.label === 'PTO') {
        dataset.data = yearMonthPtoHours
      } else if (dataset.label === 'Holiday') {
        dataset.data = yearMonthHolidayHours
      } else if (dataset.label === 'SP') {
        dataset.data = yearMonthSPHours
      }
    })
    return widget
  }

  constructYearMonth(rawData: any[], widget: any): void {
    let yearMonthLabels = []
    let yearMonthCostData = []
    let yearMonthRevenueData = []
    let marginData = []
    let uniqueYearMonths = []
    uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'yearmonth',
    )
    //console.log(uniqueYearMonths, 'yearmonths');
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      let obj = {
        yearmonth: uniqueYearMonths[i].yearmonth,
      }
      let yearMonthChartData = this.pandlService.filterArray(rawData, obj)
      let costsum = 0
      let revenuesum = 0
      let marginsum = 0
      for (let j = 0; j < yearMonthChartData.length; j++) {
        costsum = costsum + yearMonthChartData[j].recognized_cost
        revenuesum = revenuesum + yearMonthChartData[j].recognized_revenue
      }
      if (costsum === 0 && revenuesum === 0) {
        marginsum = 0
      } else if (costsum != 0 && revenuesum === 0) {
        marginsum = -100
      } else {
        marginsum = (100 * (revenuesum - costsum)) / revenuesum
      }
      yearMonthLabels.push(
        uniqueYearMonths[i].year + '/' + uniqueYearMonths[i].month,
      )
      yearMonthCostData.push(Math.round(costsum))
      yearMonthRevenueData.push(Math.round(revenuesum))
      marginData.push(Math.round(marginsum))
    }
    widget.details.data.labels = yearMonthLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Margin') {
        dataset.data = marginData
      } else if (dataset.label === 'Cost') {
        dataset.data = yearMonthCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = yearMonthRevenueData
      }
    })
    return widget
  }

  constructRevenuBreakdownByEmployee(rawData: any[], widget: any): void {
    let employeesRevenue = []
    let revenueData = []
    let uniqueEmps = []
    uniqueEmps = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'employee_id',
    )
    let empLabels = []
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

    for (let i = 0; i < emps.length; i++) {
      let empRevenueData = rawData.filter(
        (data: any) => data.employee_id === emps[i],
      )
      // let empRevenueData = this.pandlService.filterArray(rawData, obj);
      let revenueSum = 0
      for (let j = 0; j < empRevenueData.length; j++) {
        revenueSum = revenueSum + empRevenueData[j].recognized_revenue
      }
      const employeeName = uniqueEmployeeDetails.filter(
        (emplDetails) => emplDetails.employeeId === emps[i],
      )[0].employee
      let empRevObj = {
        employee: employeeName,
        revenue: Math.round(revenueSum),
      }
      employeesRevenue.push(empRevObj)
    }
    // this.constructedData = JSON.parse(JSON.stringify(employeesRevenue));
    let sortedEmpRevenues = employeesRevenue
      .sort(this.pandlService.GetSortOrder('revenue'))
      .reverse()
    empLabels = sortedEmpRevenues.map((x) => x.employee)
    revenueData = sortedEmpRevenues.map((x) => x.revenue)
    // this.pandlService.calcHeight(empLabels.length, widget.id);
    widget.details.data.datasets[0].data = revenueData
    widget.details.data.labels = empLabels
    return widget
  }

  constructHoursBreakdownByproject(rawData: any[], widget: any): void {
    let projectTotalHours: any[] = []
    let projectBillingHours = []
    let projectNonBillingHours = []
    let projectInternalHours = []
    let projectPtoHours = []
    let projectHolidayHours = []
    let projectSPHours = []

    let uniqueprojects = []
    uniqueprojects = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'project_id',
    )
    let projectLabels = []
    const uniqueProjectDetails = uniqueprojects.map((projectDetails: any) => {
      return {
        projectId: projectDetails.project_id,
        project: projectDetails.project,
      }
    })
    //console.log(uniqueprojects, 'uniqueprojects');
    let projects = []
    for (let i = 0; i < uniqueprojects.length; i++) {
      projects.push(uniqueprojects[i].project_id)
    }
    for (let i = 0; i < projects.length; i++) {
      let projectHoursData = rawData.filter(
        (data: any) => data.project_id === projects[i],
      )
      const totalhours = projectHoursData.reduce(
        (sum, currObj) =>
          sum +
          currObj.billable_hours +
          currObj.non_billable_hours +
          currObj.internal_hours +
          currObj.pto_hours +
          currObj.holiday_hours,
        0,
      )
      const projectName = uniqueProjectDetails.filter(
        (project) => project.projectId === projects[i],
      )[0].project
      let projectHours = {
        project: projectName,
        totalHours: totalhours,
        billingHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.billable_hours,
          0,
        ),
        nonBillingHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.non_billable_hours,
          0,
        ),
        internalHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.internal_hours,
          0,
        ),
        ptoHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.pto_hours,
          0,
        ),
        holidayHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.holiday_hours,
          0,
        ),
        specialHours: projectHoursData.reduce(
          (sum, currObj) => sum + currObj.special_leave_hours,
          0,
        ),
      }
      projectTotalHours.push(projectHours)
    }
    // this.constructedData = JSON.parse(JSON.stringify(projectTotalHours));
    let sortedProjectHours = projectTotalHours
      .sort(this.pandlService.GetSortOrder('totalHours'))
      .reverse()
    projectLabels = sortedProjectHours.map((x) => x.project)
    projectBillingHours = sortedProjectHours.map((x) => x.billingHours)
    projectNonBillingHours = sortedProjectHours.map((x) => x.nonBillingHours)
    projectInternalHours = sortedProjectHours.map((x) => x.internalHours)
    projectPtoHours = sortedProjectHours.map((x) => x.ptoHours)
    projectHolidayHours = sortedProjectHours.map((x) => x.holidayHours)
    projectSPHours = sortedProjectHours.map((x) => x.specialHours)
    // this.pandlService.calcHeight(projectLabels.length, widget.id);
    widget.details.data.labels = projectLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Billable') {
        dataset.data = projectBillingHours
      } else if (dataset.label === 'NonBillable') {
        dataset.data = projectNonBillingHours
      } else if (dataset.label === 'Internal') {
        dataset.data = projectInternalHours
      } else if (dataset.label === 'Holiday') {
        dataset.data = projectHolidayHours
      } else if (dataset.label === 'PTO') {
        dataset.data = projectPtoHours
      } else if (dataset.label === 'SP') {
        dataset.data = projectSPHours
      }
    })
    return widget
  }

  constructEmployeeUtilDataSet(rawData: any[], widget: any): void {
    let data: any[] = []
    let constructedData: any[] = []
    let uniqueEmps = []
    uniqueEmps = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'employee_id',
    )
    const uniqueEmployeeDetails = uniqueEmps.map((employeeDetails: any) => {
      return {
        employeeId: employeeDetails.employee_id,
        employee: employeeDetails.employee,
      }
    })
    let empLabels = []
    let emps = []
    for (let i = 0; i < uniqueEmps.length; i++) {
      if (uniqueEmps[i].employee !== null) {
        emps.push(uniqueEmps[i].employee_id)
      }
    }
    for (let i = 0; i < emps.length; i++) {
      let empUtilData = rawData.filter(
        (data: any) => data.employee_id === emps[i],
      )
      // let empUtilData = this.pandlService.filterArray(rawData, obj);
      let utilization = 0
      const billableHoursSum = empUtilData.reduce(
        (sum, currObj) => sum + currObj.billable_hours,
        0,
      )
      const totalhours = empUtilData.reduce(
        (sum, currObj) =>
          sum +
          currObj.billable_hours +
          currObj.non_billable_hours +
          currObj.internal_hours +
          currObj.pto_hours +
          currObj.holiday_hours +
          currObj.special_leave_hours,
        0,
      )
      utilization = this.pandlService.roundTo(
        (billableHoursSum / totalhours) * 100,
        2,
      )
      if (!isFinite(utilization)) {
        utilization = 0
      }
      const employeeName = uniqueEmployeeDetails.filter(
        (emplDetails) => emplDetails.employeeId === emps[i],
      )[0].employee
      let utilObj = {
        employee: employeeName,
        utilization: utilization,
      }
      constructedData.push(utilObj)
    }
    let sortedData = _.orderBy(constructedData, ['utilization', 'employee'])
    // this.constructedData = JSON.parse(JSON.stringify(constructedData));
    data = sortedData.map((x) => x.utilization)
    empLabels = sortedData.map((x) => x.employee)
    // this.pandlService.calcHeight(empLabels.length, widget.id);
    widget.details.data.datasets[0].data = data
    widget.details.data.labels = empLabels
    return widget
  }

  utilByLevelsGrid(rawData: any[]) {
    const extractedDetails = {
      dataList: [],
      dataTotals: {},
      dataHeaders: [],
    }
    let utilByLevelsGridData = []
    const yearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'yearmonth',
    )
    const uniqueYearMonths =
      yearMonths && yearMonths.length
        ? yearMonths.map((ele: any) => {
            return ele.yearmonth
          })
        : []
    const jobCodes = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'Job_Code',
    )
    const uniquejobCodes =
      jobCodes && jobCodes.length
        ? jobCodes.map((ele: any) => {
            return ele.Job_Code
          })
        : []
    //console.log(uniquejobCodes);
    let totalJOBcodehours = {}
    let totalJOBCODEBillinghours = {}
    let totalUtilization = {}
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      let utilByLevelsObj = {}

      utilByLevelsObj['Year Month'] = uniqueYearMonths[i]
      for (let j = 0; j < uniquejobCodes.length; j++) {
        let obj = {
          yearmonth: uniqueYearMonths[i],
          Job_Code: uniquejobCodes[j],
        }
        let yearMonthLevelData = []
        yearMonthLevelData = this.pandlService.filterArray(rawData, obj)
        let utilization = 0
        let billableHoursSum = 0
        let nonBillableHoursSum = 0
        let internalHoursSum = 0
        let ptoHoursSum = 0
        let holidayHoursSum = 0
        let totalBillablehours = 0
        let totalnonBillableHoursSum = 0
        let totalinternalHoursSum = 0
        let totalptoHoursSum = 0
        let totalholidayHoursSum = 0
        for (let k = 0; k < yearMonthLevelData.length; k++) {
          billableHoursSum =
            billableHoursSum + yearMonthLevelData[k].billable_hours
          nonBillableHoursSum =
            nonBillableHoursSum + yearMonthLevelData[k].non_billable_hours
          internalHoursSum =
            internalHoursSum + yearMonthLevelData[k].internal_hours
          ptoHoursSum = ptoHoursSum + yearMonthLevelData[k].pto_hours
          holidayHoursSum =
            holidayHoursSum + yearMonthLevelData[k].holiday_hours
        }
        let totalhours =
          billableHoursSum +
          nonBillableHoursSum +
          internalHoursSum +
          holidayHoursSum +
          ptoHoursSum
        utilization = this.pandlService.roundTo(
          (billableHoursSum / totalhours) * 100,
          0,
        )
        if (!isFinite(utilization)) {
          utilization = 0
        }
        if (totalJOBcodehours[uniquejobCodes[j]]) {
          totalJOBcodehours[uniquejobCodes[j]] =
            totalhours + totalJOBcodehours[uniquejobCodes[j]]
        } else {
          totalJOBcodehours[uniquejobCodes[j]] = totalhours + 0
        }
        if (totalJOBCODEBillinghours[uniquejobCodes[j]]) {
          totalJOBCODEBillinghours[uniquejobCodes[j]] =
            billableHoursSum + totalJOBCODEBillinghours[uniquejobCodes[j]]
        } else {
          totalJOBCODEBillinghours[uniquejobCodes[j]] = billableHoursSum + 0
        }

        utilByLevelsObj[uniquejobCodes[j].toString()] = utilization
      }
      utilByLevelsGridData.push(utilByLevelsObj)
    }
    let columnKeys = []
    const filteredCard: any = EmployeePandLdataCards.find((x) => x.id === 3)
    if (filteredCard) {
      const columns: any[] = filteredCard.widgets[0].columns
      columnKeys = columns.map((ele: any) => {
        return ele.key
      })
    }
    if (columnKeys.length) {
      columnKeys.filter((key: string) => {
        if (key !== 'Year Month') {
          const utilization = this.pandlService.roundTo(
            (totalJOBCODEBillinghours[key] / totalJOBcodehours[key]) * 100,
            2,
          )
          if (utilization) {
            totalUtilization[key] = utilization
          } else if (utilization == 0) {
            totalUtilization[key] = '0'
          } else {
            totalUtilization[key] = ''
          }
        } else {
          totalUtilization[key] = 'Total'
        }
      })
    }
    const utilByLevelsColumnDefs = this.pandlService.generateColumns(
      utilByLevelsGridData,
    )
    let utilByLevelsGridColumns = utilByLevelsColumnDefs.map((x) => x.field)
    extractedDetails.dataList = utilByLevelsGridData
    extractedDetails.dataTotals = totalUtilization
    return extractedDetails
  }
}
