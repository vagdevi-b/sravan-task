import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { PandlDetailsTabService } from '../../services/pandl-details-tab.service'
import { PandlEmployeeTabService } from '../../services/pandl-employee-tab.service'
import { PandlSummaryTabService } from '../../services/pandl-summary-tab.service'
import { PandlDataTabService } from '../../services/pandl-data-tab.services'
import { PaymentsTabService } from '../../services/payments-tab.services'
import { PandlUtilizationTabService } from '../../services/pandl-utilization-tab.services'
import { PandlService } from '../../services/pandl.service'
import { CanvasChartComponent } from '../canvas-chart/canvas-chart.component'
import { DataTableExternalComponent } from '../data-table-external/data-table-external.component'
import { Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import * as moment from 'moment'
import { UtilityService } from '../../services/utility.service'
declare var $: any

@Component({
  selector: 'app-grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['../../../../assets/css/light.css'],
})
export class GridWidgetComponent implements OnInit {
  @ViewChild('canvasComponent') canvasComponent: CanvasChartComponent
  @ViewChild('dataTableExternalComponent')
  dataTableExternalComponent: DataTableExternalComponent
  @Input() widget: any = {}
  widgetData: any = {}
  data: any
  showSearch: boolean = true
  searchValue: any = ''
  // paymentData:any;
  subscriptions: Subscription[] = []
  extractedDataDeatails: any = {
    actualDataList: [],
    dataList: [],
    dataTotals: {},
    dataHeaders: [],
    isFullScreenReq: false,
    isFiltered: false,
  }
  gridColumns: any[] = []
  loading: boolean = true
  constructor(
    private pAndLsvc: PandlService,
    private pandlDetailsService: PandlDetailsTabService,
    private pandlDataService: PandlDataTabService,
    private pandlSummaryTabService: PandlSummaryTabService,
    private pandlEmployeeTabService: PandlEmployeeTabService,
    private pandlUtilizationService: PandlUtilizationTabService,
    private paymentService: PaymentsTabService,
    private router: Router,
    public datepipe: DatePipe,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.loadWidget()
    this.subscriptions.push(
      this.pAndLsvc.getRunPandLDataTriggered().subscribe((data: Boolean) => {
        if (data && !this.router.url.includes('paymentsummary')) {
          this.data = []
          this.loading = true
        }
      }),
    )
    this.subscriptions.push(
      this.pAndLsvc.getDataofPandL().subscribe(
        (data) => {
          // this.data = [];
          if (data && !this.router.url.includes('paymentsummary')) {
            this.data = data['P and L']
            setTimeout(() => {
              this.loadData()
            }, 500)
          } else {
            this.loading = false
          }
        },
        (err) => {
          console.log(err)
          this.loading = false
        },
      ),
    )

    this.subscriptions.push(
      this.pAndLsvc
        .getRunPaymentDataTriggered()
        .subscribe((paymentData: Boolean) => {
          if (paymentData && this.router.url.includes('paymentsummary')) {
            this.data = []
            this.loading = true
          }
        }),
    )
    this.subscriptions.push(
      this.pAndLsvc.getDataofPayment().subscribe(
        (paymentData) => {
          // this.paymentData = [];
          if (paymentData && this.router.url.includes('paymentsummary')) {
            this.data = paymentData['P and L']
            setTimeout(() => {
              this.loadData()
            }, 500)
          } else {
            this.loading = false
          }
        },
        (err) => {
          console.log(err)
          this.loading = false
        },
      ),
    )
  }

  loadWidget(): void {
    if (this.widget) {
      this.widgetData = this.widget
    }
  }

  loadData(): void {
    this.loading = true
    this.getData()
    this.loading = false
  }

  getData(): void {
    if (this.widget) {
      if (this.widget.type === 'table') {
        this.widgetData = this.widget
        this.gridColumns = this.widget.columns
        if (this.widget.id === 'PandLDetailsCustomerGrid') {
          this.extractedDataDeatails = this.pandlDetailsService.getCustomerGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLDetailsProjectGrid') {
          this.extractedDataDeatails = this.pandlDetailsService.getprojectGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLDetailsEmployeeGrid') {
          this.extractedDataDeatails = this.pandlDetailsService.getEmpGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLDetailsEmployeeOrganizationGrid') {
          this.extractedDataDeatails = this.pandlDetailsService.getEmpOrgGridData(
            this.data,
          )
        } else if (
          this.widget.id === 'PandLDetailsMonthlyEmployeeRevenueGrid'
        ) {
          this.extractedDataDeatails = this.pandlDetailsService.getYearMonthGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLEmployeeUtilizationByLevels') {
          this.extractedDataDeatails = this.pandlEmployeeTabService.utilByLevelsGrid(
            this.data,
          )
        } else if (this.widget.id === 'PandLUtilizationEmployeeGrid') {
          this.extractedDataDeatails = this.pandlUtilizationService.getEmpUtilGridData(
            this.data,
          )
        } else if (
          this.widget.id === 'PandLUtilizationEmployeeOrganizationGrid'
        ) {
          this.extractedDataDeatails = this.pandlUtilizationService.getEmpOrgUtilGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLUtilizationProjectnGrid') {
          this.extractedDataDeatails = this.pandlUtilizationService.getProjUtilGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLYearmonthEmployeeGrid') {
          this.extractedDataDeatails = this.pandlUtilizationService.getYearMonthUtilGridData(
            this.data,
          )
        } else if (this.widget.id === 'PandLDataGrid') {
          this.extractedDataDeatails = this.pandlDataService.yearMonthGrid(
            this.data,
          )
        }
        this.extractedDataDeatails['actualDataList'] = JSON.parse(
          JSON.stringify(this.extractedDataDeatails['dataList']),
        )
      } else {
        if (this.widget.id === 'employeeUtilChartId') {
          this.widgetData = this.pandlEmployeeTabService.constructEmployeeUtilDataSet(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'hoursBreakdownByProjectId') {
          this.widgetData = this.pandlEmployeeTabService.constructHoursBreakdownByproject(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'revenuBreakdownByEmployeeId') {
          this.widgetData = this.pandlEmployeeTabService.constructRevenuBreakdownByEmployee(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'yearMonthId') {
          this.widgetData = this.pandlEmployeeTabService.constructYearMonth(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'hoursBreakdownChartId') {
          this.widgetData = this.pandlEmployeeTabService.constructHoursBreakdown(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PandLDetailsEmployeeOrganizationChart') {
          this.widgetData = this.pandlDetailsService.getEmpOrgcharts(
            this.data,
            this.widget,
          )
        }
        if (this.widget.id === 'PandLSummaryYearMonth') {
          this.widgetData = this.pandlSummaryTabService.getSummaryYearMonthCharts(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PandLSummaryProjectOrganization') {
          this.widgetData = this.pandlSummaryTabService.getProjectOrgcharts(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PandLSummaryEmployeeOrganization') {
          this.widgetData = this.pandlSummaryTabService.getSummaryEmpOrgcharts(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PandLSummaryEmployeePractise') {
          this.widgetData = this.pandlSummaryTabService.getEmpRevenue(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PaymentSummaryOrgCostRevenue') {
          this.widgetData = this.paymentService.getProjectOrgcharts(
            this.data,
            this.widget,
          )
        } else if (this.widget.id === 'PaymentSummaryYearMonthCostRevenue') {
          this.widgetData = this.paymentService.getSummaryYearMonthCharts(
            this.data,
            this.widget,
          )
        }
      }
    }
  }

  downloadData(): void {
    let fileName: string = ''
    switch (this.widget.id) {
      case 'PandLDetailsCustomerGrid':
        fileName = 'customersData'
        break
      case 'PandLDetailsProjectGrid':
        fileName = 'ProjectsData'
        break
      case 'PandLDetailsMonthlyEmployeeRevenueGrid':
        fileName = 'yearMonthData'
        break
      case 'PandLDetailsEmployeeGrid':
        fileName = 'employeeData'
        break
      case 'PandLDetailsEmployeeOrganizationChart':
        fileName = 'employeeOrganizationData'
        break
      case 'PandLDetailsEmployeeOrganizationGrid':
        fileName = 'employeeOrganizationData'
        break
      case 'PandLUtilizationEmployeeGrid':
        fileName = 'employeeUtilizationData'
        break
      case 'PandLUtilizationEmployeeOrganizationGrid':
        fileName = 'employeeUtilizationOrganizationData'
        break
      case 'PandLUtilizationProjectnGrid':
        fileName = 'employeeProjectData'
        break
      case 'PandLYearmonthEmployeeGrid':
        fileName = 'employeeYearMonthUtilizationData'
        break
      case 'PandLDataGrid':
        fileName = 'employeeSowData'
    }
    let date = new Date()
    // let latest_date =moment().format("D/M/YYYY, h:m:s a");
    let latest_date = this.datepipe.transform(date, 'ddMMyyyyhhmmss')
    let hour = date.getHours()
    let minuts = date.getMinutes()
    let seconds = date.getSeconds()
    this.pAndLsvc.exportToCsv(
      this.dataTableExternalComponent.gridData,
      fileName + latest_date,
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe()
    })
  }

  searchValueChanges(value: any): void {
    let filteredRecords: any[] = []
    this.searchValue = value
    if (Number(value)) {
      this.searchValue = Number(value)
    }
    let summaryTotalData
    let duplicateDataTotals: any = JSON.parse(
      JSON.stringify(this.extractedDataDeatails.dataTotals),
    )
    let duplicateExtractedDetails: any = JSON.parse(
      JSON.stringify(this.extractedDataDeatails),
    )
    filteredRecords = this.utilityService.filterObjectBySearchValue(duplicateExtractedDetails.actualDataList, this.searchValue);
    // if (
    //   duplicateExtractedDetails &&
    //   duplicateExtractedDetails.actualDataList.length &&
    //   this.searchValue
    // ) {
    //   // duplicateExtractedDetails.isFiltered = true
    //   duplicateExtractedDetails.actualDataList.filter((record: any) => {
    //     const recordValueslist: any[] = Object.values(record)
    //     if (recordValueslist.length) {
    //       recordValueslist.filter((element, index) => {
    //         if (typeof element === 'string' && typeof(this.searchValue)==='string') {
    //           if (
    //             element.toLowerCase().includes(this.searchValue.toLowerCase())
    //           ) {
    //             filteredRecords.push(record)
    //           }
    //         } else if(typeof element === 'number' && typeof(this.searchValue)==='number'){
    //           if (element === this.searchValue) {
    //             filteredRecords.push(record)
    //           }
    //         }
    //       })
    //     }
    //   })
    // } else {
    //   filteredRecords = duplicateExtractedDetails.actualDataList
    //   // duplicateExtractedDetails.isFiltered = false
    // }
    this.extractedDataDeatails = {}
    if (
      this.widget.id === 'PandLDetailsCustomerGrid' ||
      this.widget.id === 'PandLDetailsProjectGrid' ||
      this.widget.id === 'PandLDetailsEmployeeOrganizationGrid'
    ) {
      this.extractedDataDeatails.dataTotals = {}
      summaryTotalData = this.pandlDetailsService.getCustomerGridDataTotals(
        filteredRecords,
      )
      this.extractedDataDeatails.dataTotals = {}
    } else if (this.widget.id === 'PandLDetailsEmployeeGrid') {
      this.extractedDataDeatails.dataTotals = {}
      summaryTotalData = this.pandlDetailsService.getEmpGridDataTotals(
        filteredRecords,
      )
      this.extractedDataDeatails.dataTotals = {}
    } else if (this.widget.id === 'PandLDetailsMonthlyEmployeeRevenueGrid') {
      this.extractedDataDeatails.dataTotals = {}
      summaryTotalData = this.pandlDetailsService.getEmpRevenueGridDataTotals(
        filteredRecords,
      )
      this.extractedDataDeatails.dataTotals = {}
    }else if (this.widget.id === 'PandLUtilizationEmployeeGrid') {
      this.extractedDataDeatails.dataTotals = {}
      summaryTotalData = this.pandlUtilizationService.getUtilGridDataTotals(
        filteredRecords,
      )
      this.extractedDataDeatails.dataTotals = {}
    }
    else if (this.widget.id === 'PandLUtilizationProjectnGrid') {
      this.extractedDataDeatails.dataTotals = {}
      summaryTotalData = this.pandlUtilizationService.getProjectGridDataSummaryTotals(
        filteredRecords,
      )
      this.extractedDataDeatails.dataTotals = {}
    } 
    else if (this.widget.id === 'PandLYearmonthEmployeeGrid') {
      summaryTotalData = this.pandlUtilizationService.getYearMonthUtilGridDataTotals(
        filteredRecords,
      )
    }
     else {
      summaryTotalData = duplicateDataTotals
    }
    duplicateExtractedDetails.dataList = filteredRecords
    this.extractedDataDeatails = duplicateExtractedDetails
    this.extractedDataDeatails.dataTotals = summaryTotalData
  }
}
