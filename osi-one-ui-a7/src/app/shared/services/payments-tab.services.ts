import { Injectable, OnDestroy } from '@angular/core'
import { PandlService } from './pandl.service'
import * as _ from 'lodash'
import { PaymentSummaryService } from './paymentsummary.service'
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class PaymentsTabService {
  destroy$: Subject<boolean> = new Subject<boolean>()
  FilterSummaryData: any = []
  subscriptions: Subscription[] = []
  constructor(
    private pandlService: PandlService,
    private paymentService: PaymentSummaryService,
  ) {}
  ngOnInit() {
    this.getdata()
  }

  getdata() {
    this.FilterSummaryData = []
    this.subscriptions.push(
      this.pandlService
        .getRunPaymentDataTriggered()
        .subscribe((FilterSummaryData: Boolean) => {
          if (FilterSummaryData) {
            this.FilterSummaryData = []
          }
        }),
    )
    this.subscriptions.push(
      this.pandlService
        .getDataofPayment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (FilterSummaryData) => {
            this.FilterSummaryData = []
            if (FilterSummaryData) {
              this.FilterSummaryData = FilterSummaryData['P and L']
            }
          },
          (err) => {
            //console.log(err);
            //$('#loadingEditSubmitModal').modal('hide');
          },
        ),
    )
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
      // let filterObj = {
      //   "project_org": projOrgLabels[i]
      // }
      // projOrgChartData = this.pandlService.filterArray(rawData, filterObj);
      projOrgChartData = rawData.filter(
        (data) => data.project_org === projOrgLabels[i],
      )
      let costsum = 0
      let revenuesum = 0
      for (let j = 0; j < projOrgChartData.length; j++) {
        costsum = costsum + projOrgChartData[j].Project_Cost
        revenuesum = revenuesum + projOrgChartData[j].Project_Revenue
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
  getSummaryYearMonthCharts(rawData: any[], widget: any) {
    let yearMonthLabels = []
    let yearMonthCostData = []
    let yearMonthRevenueData = []
    let inovoiceServicesData = []
    let paymentsData = []
    let marginData = []
    let uniqueYearMonths = []
    uniqueYearMonths = this.pandlService.getUniqueDataAfterFilter(
      rawData,
      'month',
    )
    // console.log(uniqueYearMonths, 'yearmonths');
    for (let i = 0; i < uniqueYearMonths.length; i++) {
      // let obj = {
      //   "month": uniqueYearMonths[i].month
      // }

      let yearMonthChartData = rawData.filter(
        (data) => data.month === uniqueYearMonths[i].month,
      )
      let costsum = 0
      let revenuesum = 0
      let marginsum = 0
      let invoicedServices = 0
      let payments = 0
      for (let j = 0; j < yearMonthChartData.length; j++) {
        costsum = costsum + yearMonthChartData[j].Project_Cost
        revenuesum = revenuesum + yearMonthChartData[j].Project_Revenue
        invoicedServices =
          invoicedServices + yearMonthChartData[j].Invoiced_Service_USD
        payments = payments + yearMonthChartData[j].Payments_USD
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
      inovoiceServicesData.push(Math.round(invoicedServices))
      paymentsData.push(Math.round(payments))
    }

    widget.details.data.labels = yearMonthLabels
    widget.details.data.datasets.forEach((dataset: any) => {
      if (dataset.label === 'Cost') {
        dataset.data = yearMonthCostData
      } else if (dataset.label === 'Revenue') {
        dataset.data = yearMonthRevenueData
      } else if (dataset.label === 'Invoiced Services') {
        dataset.data = inovoiceServicesData
      } else if (dataset.label === 'Payments') {
        dataset.data = paymentsData
      }
    })
    return widget
  }
}
