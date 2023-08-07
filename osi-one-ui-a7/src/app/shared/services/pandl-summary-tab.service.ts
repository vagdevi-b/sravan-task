import { Injectable } from '@angular/core'
import { PandlService } from './pandl.service'
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class PandlSummaryTabService {
  constructor(private pandlService: PandlService) {}

  getSummaryYearMonthCharts(rawData: any[], widget: any) {
    let yearMonthLabels = []
    let yearMonthCostData = []
    let yearMonthRevenueData = []
    let marginData = []
    let uniqueYearMonths = []
    uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'yearmonth',
    )
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
      } else if (costsum === 0 && revenuesum === 0) {
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
      if (dataset.label === 'Cost') {
        dataset.data = yearMonthCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = yearMonthRevenueData
      } else if (dataset.label === 'Margin %') {
        dataset.data = marginData
      }
    })
    return widget
  }

  getProjectOrgcharts(rawData: any[], widget: any) {
    let projOrgCostData = []
    let projOrgRevenueData = []
    let projOrgs = []
    projOrgs = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'project_org',
    )
    let projOrgLabels = []
    for (let i = 0; i < projOrgs.length; i++) {
      projOrgLabels.push(projOrgs[i].project_org)
    }
    let projOrgChartData = []
    let constructedData = []
    for (let i = 0; i < projOrgLabels.length; i++) {
      const data = {
        label: projOrgLabels[i],
        cost: 0,
        revenu: 0,
      }
      let filterObj = {
        project_org: projOrgLabels[i],
      }
      projOrgChartData = this.pandlService.filterArray(rawData, filterObj)
      let costsum = 0
      let revenuesum = 0
      for (let j = 0; j < projOrgChartData.length; j++) {
        costsum = costsum + projOrgChartData[j].recognized_cost
        revenuesum = revenuesum + projOrgChartData[j].recognized_revenue
      }
      data.cost = Math.round(costsum)
      data.revenu = Math.round(revenuesum)
      constructedData.push(data)
    }
    constructedData = _.orderBy(
      constructedData,
      ['cost', 'revenu'],
      ['desc', 'desc'],
    )
    projOrgLabels = constructedData.map((data: any) => {
      return data.label
    })
    projOrgCostData = constructedData.map((data: any) => {
      return data.cost
    })
    projOrgRevenueData = constructedData.map((data: any) => {
      return data.revenu
    })
    widget.details.data.labels = projOrgLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Cost') {
        dataset.data = projOrgCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = projOrgRevenueData
      }
    })
    return widget
  }

  getSummaryEmpOrgcharts(rawData: any[], widget: any) {
    let empOrgCostData = []
    let empOrgRevenueData = []
    let empOrgs = []
    empOrgs = this.pandlService.getUniqueDataAfterFilter(
      rawData,
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
      empOrgChartData = this.pandlService.filterArray(rawData, filterObj)
      let costsum = 0
      let revenuesum = 0
      for (let j = 0; j < empOrgChartData.length; j++) {
        costsum = costsum + empOrgChartData[j].recognized_cost
        revenuesum = revenuesum + empOrgChartData[j].recognized_revenue
      }
      data.cost = Math.round(costsum)
      data.revenu = Math.round(revenuesum)
      constructedData.push(data)
      // empOrgCostData.push(Math.round(costsum));
      // empOrgRevenueData.push(Math.round(revenuesum));
    }
    constructedData = _.orderBy(
      constructedData,
      ['cost', 'revenu'],
      ['desc', 'desc'],
    )
    empOrgLabels = constructedData.map((data: any) => {
      return data.label
    })
    empOrgCostData = constructedData.map((data: any) => {
      return data.cost
    })
    empOrgRevenueData = constructedData.map((data: any) => {
      return data.revenu
    })
    widget.details.data.labels = empOrgLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Cost') {
        dataset.data = empOrgCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = empOrgRevenueData
      }
    })
    return widget
  }

  getEmpRevenue(rawData: any[], widget: any) {
    let yearMonthCostData = []
    let yearMonthRevenueData = []
    let uniqueYearMonths = []
    uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'employee_practice',
    )
    let yearMonthLabels = []
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      if (uniqueYearMonths[i].employee_practice !== null) {
        yearMonthLabels.push(uniqueYearMonths[i].employee_practice)
      }
    }
    let yearMonthChartData = []
    let constructedData = []
    for (let i = 0; i < yearMonthLabels.length; i++) {
      const data = {
        label: yearMonthLabels[i],
        cost: 0,
        revenu: 0,
      }
      let obj = {
        employee_practice: yearMonthLabels[i],
      }
      yearMonthChartData = this.pandlService.filterArray(rawData, obj)
      let costsum = 0
      let revenuesum = 0
      // let marginsum = 0;
      for (let j = 0; j < yearMonthChartData.length; j++) {
        costsum = costsum + yearMonthChartData[j].recognized_cost
        revenuesum = revenuesum + yearMonthChartData[j].recognized_revenue
        // marginsum =this.pandlService.roundTo(100 * (revenuesum -costsum) / revenuesum, 2) ;
      }
      data.cost = Math.round(costsum)
      data.revenu = Math.round(revenuesum)
      constructedData.push(data)
      // yearMonthCostData.push(Math.round(costsum));
      // yearMonthRevenueData.push(Math.round(revenuesum));
      // this.marginData.push(Math.round(marginsum));
    }
    constructedData = _.orderBy(
      constructedData,
      ['cost', 'revenu'],
      ['desc', 'desc'],
    )
    yearMonthLabels = constructedData.map((data: any) => {
      return data.label
    })
    yearMonthCostData = constructedData.map((data: any) => {
      return data.cost
    })
    yearMonthRevenueData = constructedData.map((data: any) => {
      return data.revenu
    })
    widget.details.data.labels = yearMonthLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Cost') {
        dataset.data = yearMonthCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = yearMonthRevenueData
      }
    })
    return widget
  }
}
