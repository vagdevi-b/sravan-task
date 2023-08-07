import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { PandlService } from '../../../shared/services/pandl.service'
import * as Feather from 'feather-icons'
import { Subject, Subscription } from 'rxjs'
import * as _ from 'lodash'
import { DataTableDirective } from 'angular-datatables'
import { PaginationService } from '../../../shared/services/pagination.service'
import { RequistionsService } from '../../../shared/services/requistions.service'
import { DatePipe } from '@angular/common'
import { UtilityService } from '../../../shared/services/utility.service'

@Component({
  selector: 'app-paymentsummary-table',
  templateUrl: './paymentsummary-table.component.html',
  styleUrls: ['../../../../../src/assets/css/light.css'],
  providers: [PaginationService],
})
export class PaymentsummaryTableComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>()
  @ViewChild(DataTableDirective) dtElement: DataTableDirective
  showFilters: boolean
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated'
  chartData: any[] = []

  hoursEmpMonthGridData: any = []
  summaryTableHeaderColumns: any = [];
  monthLevelAttributes: any[] = [
    'Year Month',
    'Project Manager',
    'Sales Person',
    'Status',
    'monthlyCost',
    'monthlyRevenue',
    'monthlyGm',
    'monthlyinvoicedServices',
    'monthlyInvoiceExpenses',
    'monthlyPayments',
    'monthlyDues'
  ];
  gridObj = {}
  columnDefs = []
  rowData = []
  hoursEmpMonthGridTotalObjArray = []
  yearMonths: any[] = []
  uniqueYearMonths: any[] = []
  employees: any[]
  uniqueEmps: any[]
  projects: any[]
  uniqueProjects: any[]
  projectmanager: any[] = []
  uniqueprojectmanager: any[] = []
  salesperson: any[] = []
  uniquesalesperson: any[] = []
  projectstatus: any[] = []
  uniqueprojectstatus: any[] = []
  sow: any[] = []
  uniquesow: any[] = []
  projectEmpYMData: any[] = []
  subscriptions: Subscription[] = []
  displayList: any[] = []
  isDataReady: boolean
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject()
  pageNumber = 0
  pager: any
  sortType: string
  selectedHeaderTh: string
  dataDownload: any[] = [];
  listOfLeftAlignedHeaders = [
    'Project',
    'SOW #',
    'Project Manager',
    'Sales Person',
    'Status',
  ]
  searchValue: any
  originaldata: any;
  gridData: any[] = [];
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if (
      (event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight ||
        event.target.offsetHeight + event.target.scrollTop >=
        event.target.scrollHeight - 1) &&
      this.pageNumber <= this.pager.totalPages
    ) {
      this.pageNumber = this.pageNumber + 1
      this.setPage(this.pageNumber, this.gridData);
    }
  }

  setPage(page: number, originalDataList: any[]): void {
    let list = [];
    if (originalDataList && originalDataList.length) {
      this.pager = this.paginationService.getPager(
        originalDataList.length,
        page,
        40
      );
      list = originalDataList.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
    }
    list.forEach(element => {
      this.displayList.push(element);
    });
  }

  // setPage(page: number): void {
  //   let list = []
  //   if (this.hoursEmpMonthGridData && this.hoursEmpMonthGridData.length) {
  //     this.pager = this.paginationService.getPager(
  //       this.hoursEmpMonthGridData.length,
  //       page,
  //       40,
  //     )
  //     list = this.hoursEmpMonthGridData.slice(
  //       this.pager.startIndex,
  //       this.pager.endIndex + 1,
  //     )
  //   }
  //   list.forEach((element) => {
  //     this.displayList.push(element)
  //   })
  //   this.originaldata=JSON.parse(JSON.stringify(this.displayList))
  // }

  @Input('rawData')
  set setRawData(value: any) {
    this.chartData = []
    this.hoursEmpMonthGridTotalObjArray = []
    this.summaryTableHeaderColumns = []
    this.hoursEmpMonthGridData = []
    if (value) {
      this.chartData = value
    }
    if (this.title) {
      this.getdata()
    }
  }

  @Input('tableName') title: string = ''

  constructor(
    private pAndLsvc: PandlService,
    private paginationService: PaginationService,
    protected requistionSvc: RequistionsService,
    public datepipe: DatePipe,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    // this.setDtOptions()
  }

  ngAfterViewInit() {
    this.getdata()
    Feather.replace()
    this.dtTrigger.next()
  }

  getdata() {
    if (this.chartData.length) {
      this.getBasicDetails();
      this.constructYearMonthData();
    } else {
      this.summaryTableHeaderColumns = []
      this.hoursEmpMonthGridData = []
      this.hoursEmpMonthGridTotalObjArray = []
    }
  }
  showfilters() {
    this.showFilters = true
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden'
  }






  constructYearMonthData(): void {
    this.isDataReady = false
    const uniqueYearMonth: any[] = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'yearmonth',
    )
    const uniqueProjects: any[] = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'project_id',
    )
    let totalcost=0;
    let totalrevenue=0;
    let totalmargin=0
    let totalinvoicedservices=0
    let totalinvoicedexpenses=0
    let totalpayments=0
    let totaldues=0
   
    let revenue= 0;
      let margin= 0;
      let invoicedservices= 0;
      let invoicedexpenses= 0;
      let payments= 0;
      let dues= 0;
    for (let projectIndex = 0; projectIndex < uniqueProjects.length; projectIndex++) {
      let projectmanagerdata
      let salespersondata
      let projectstatusdata
      let paymentsdata
      let cost = 0;
      let revenue= 0;
      let margin= 0;
      let invoicedservices= 0;
      let invoicedexpenses= 0;
      let payments= 0;
      let dues= 0;
    
     

      let project: any = {
        'Project': '',
        'Project Manager': '',
        'Sales Person': '',
        'Status': '',
        'Cost': '',
        'Revenue': '',
        'GM%': '',
        'Invoiced Services': '',
        'Invoiced Expences': '',
        'Payments': '',
        'Dues': '',
        'YearMonthDetails': [],
        'isCollapse': true
      };
      const projectRelatedSowsList: any[] = this.chartData.filter((data: any) => data.project_id === uniqueProjects[projectIndex].project_id);
      if (projectRelatedSowsList.length) {
        const projectName: string = projectRelatedSowsList[0].project;
        projectmanagerdata = projectRelatedSowsList[0].project_manager;
        salespersondata = projectRelatedSowsList[0].sales_person;
        projectstatusdata = projectRelatedSowsList[0].project_status;
        project['Project'] = projectName ? projectName : '';
        project['Project Manager'] = projectmanagerdata ? projectmanagerdata : '';
        project['Sales Person'] = salespersondata ? salespersondata : '';
        project['Status'] = projectstatusdata ? projectstatusdata : '';
      }
      for (let yearMonth = 0; yearMonth < uniqueYearMonth.length; yearMonth++) {
        const filteredProjectAndYearMonthList: any[] = projectRelatedSowsList.filter((data: any) => data.yearmonth === uniqueYearMonth[yearMonth].yearmonth);
        if (filteredProjectAndYearMonthList.length) {
          let monthlyMargin;
          let montlyProjectDetails: any = {
            'Year Month': '',
            'Project Manager': '',
            'Sales Person': '',
            'Status': '',
            'monthlyCost': '',
            'monthlyRevenue': '',
            'monthlyGm': '',
            'monthlyinvoicedServices': '',
            'monthlyInvoiceExpenses': '',
            'monthlyPayments': '',
            'monthlyDues': '',
            'invoiceData': '',
            'isCollapse': true
          };
          montlyProjectDetails['Year Month']= uniqueYearMonth[yearMonth].yearmonth;
          montlyProjectDetails['monthlyPayments'] = filteredProjectAndYearMonthList.reduce((sum, currObj) => sum + currObj.Payments_USD, 0)
          montlyProjectDetails['invoiceData'] = filteredProjectAndYearMonthList.reduce(
            (sum, currObj) => sum + currObj.Invoice_Details,
            '',
          );
          montlyProjectDetails['invoiceData'] = montlyProjectDetails['invoiceData'] ? montlyProjectDetails['invoiceData'].trim() : montlyProjectDetails['invoiceData'];
          montlyProjectDetails['monthlyInvoiceExpenses'] = filteredProjectAndYearMonthList.reduce(
            (sum, currObj) => sum + currObj.Invoiced_Expense_USD,
            0,
          )
          montlyProjectDetails['monthlyinvoicedServices'] = filteredProjectAndYearMonthList.reduce(
            (sum, currObj) => sum + currObj.Invoiced_Service_USD,
            0,
          )
          montlyProjectDetails['monthlyDues'] = filteredProjectAndYearMonthList.reduce(
            (sum, currObj) => sum + currObj.Payments_Against_Invoice_USD,
            0,
          );
          montlyProjectDetails['monthlyCost'] = filteredProjectAndYearMonthList.reduce((sum, currObj) => sum + currObj.Project_Cost, 0)
          montlyProjectDetails['monthlyRevenue'] = filteredProjectAndYearMonthList.reduce((sum, currObj) => sum + currObj.Project_Revenue, 0)
          if (montlyProjectDetails['monthlyCost'] === 0 && montlyProjectDetails['monthlyRevenue'] === 0) {
            monthlyMargin = 0
          } else if (montlyProjectDetails['monthlyCost'] != 0 && montlyProjectDetails['monthlyRevenue'] === 0) {
            monthlyMargin = -100
          } else {
            monthlyMargin = (100 * (montlyProjectDetails['monthlyRevenue'] - montlyProjectDetails['monthlyCost'])) / montlyProjectDetails['monthlyRevenue']
          }
          if (!isFinite(monthlyMargin)) {
            monthlyMargin = 0
          }
          montlyProjectDetails['monthlyGm']= this.pAndLsvc.roundTo(monthlyMargin, 0);
          

          project['YearMonthDetails'].push(montlyProjectDetails);
          cost = cost + montlyProjectDetails['monthlyCost'];
          revenue = revenue + montlyProjectDetails['monthlyRevenue'];
          invoicedservices = invoicedservices + montlyProjectDetails['monthlyinvoicedServices'];
          invoicedexpenses = invoicedexpenses + montlyProjectDetails['monthlyInvoiceExpenses'];
          payments = payments + montlyProjectDetails['monthlyPayments'];
          dues = dues + montlyProjectDetails['monthlyDues'];
        
        
        } 
        
      }
      totalcost=totalcost+cost;
        totalrevenue=totalrevenue+revenue
          totalinvoicedservices=totalinvoicedservices+invoicedservices
          totalinvoicedexpenses=totalinvoicedexpenses+invoicedexpenses
          totalpayments=totalpayments+payments
          totaldues=totaldues+dues
      if (totalcost === 0 && totalrevenue === 0) {
        totalmargin = 0
      } else if (totalcost != 0 && totalrevenue === 0) {
        totalmargin = -100
      } else {
        totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
      }
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
      project['Cost'] = this.pAndLsvc.roundTo(cost, 0);
      project['Revenue'] = this.pAndLsvc.roundTo(revenue, 0);
      project['GM%'] = this.pAndLsvc.roundTo(margin, 0);
      project['Invoiced Services'] = this.pAndLsvc.roundTo(invoicedservices, 0);
      project['Invoiced Expences'] = this.pAndLsvc.roundTo(invoicedexpenses, 0);
      project['Payments'] = this.pAndLsvc.roundTo(payments, 0);
      project['Dues'] = this.pAndLsvc.roundTo(dues, 0);


      project['isCollapse'] = true;
        this.hoursEmpMonthGridData.push(project);
        this.dataDownload = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData))
        // this.gridObj = {}
  
        this.columnDefs = this.generateColumns(this.hoursEmpMonthGridData)
        let tableColumns = this.columnDefs.filter(function (el) {
          return el['field'] != 'YearMonthDetails' && el['field'] != 'isCollapse'
        })
        this.summaryTableHeaderColumns = tableColumns.map((x) => x.field)
       
    }
    // for (let yearMonth = 0; yearMonth < uniqueYearMonth.length; yearMonth++) {
    //   for (let project = 0; project < uniqueProjects.length; project++) {
    //     let projectsList: any = this.chartData.filter(
    //       (data) =>
    //         data.yearmonth === uniqueYearMonth[yearMonth].yearmonth &&
    //         data.project_id === uniqueProjects[project].project_id
    //     )
    //     if (projectsList.length) { //Removing empty projects from list
    //       projects.push(projectsList);
    //     }

    //   }
    // }
    // for (let project = 0; project < projects.length; project++) {
    //   year = projects[project].reduce((sum, currObj) => currObj.year, 0)
    //   month = projects[project].reduce((sum, currObj) => currObj.month, 0)
    //   yearmonthdata = year + '/' + month
    //   sowdata = projects[project].reduce((sum, currObj) => currObj.sow_number, 0)
    //   projectmanagerdata = projects[project].reduce(
    //     (sum, currObj) => currObj.project_manager,
    //     0,
    //   )
    //   salespersondata = projects[project].reduce(
    //     (sum, currObj) => currObj.sales_person,
    //     0,
    //   )
    //   projectstatusdata = projects[project].reduce(
    //     (sum, currObj) => currObj.project_status,
    //     0,
    //   )
    //   projectdata = projects[project].reduce((sum, currObj) => currObj.project, 0)
    //   payments = projects[project].reduce((sum, currObj) => sum + currObj.Payments_USD, 0)
    //   paymentsdata = projects[project].reduce(
    //     (sum, currObj) => currObj.Invoice_Details,
    //     0,
    //   )
    //   invoicedexpenses = projects[project].reduce(
    //     (sum, currObj) => sum + currObj.Invoiced_Expense_USD,
    //     0,
    //   )
    //   invoicedservices = projects[project].reduce(
    //     (sum, currObj) => sum + currObj.Invoiced_Service_USD,
    //     0,
    //   )
    //   cost = projects[project].reduce((sum, currObj) => sum + currObj.Project_Cost, 0)
    //   revenue = projects[project].reduce((sum, currObj) => sum + currObj.Project_Revenue, 0)
    //   if (cost === 0 && revenue === 0) {
    //     margin = 0
    //   } else if (cost != 0 && revenue === 0) {
    //     margin = -100
    //   } else {
    //     margin = (100 * (revenue - cost)) / revenue
    //   }
    //   if (!isFinite(margin)) {
    //     margin = 0
    //   }
    //   this.gridObj['YearMonth'] = yearmonthdata
    //   this.gridObj['Project'] = projectdata
    //   this.gridObj['SOW #'] = sowdata
    //   this.gridObj['Project Manager'] = projectmanagerdata
    //   this.gridObj['Sales Person'] = salespersondata
    //   this.gridObj['Project Status'] = projectstatusdata
    //   this.gridObj['Inovoice_details'] = paymentsdata
    //   this.gridObj['Cost'] = this.pAndLsvc.roundTo(cost, 0)
    //   this.gridObj['Revenue'] = this.pAndLsvc.roundTo(revenue, 0)
    //   this.gridObj['GM%'] = this.pAndLsvc.roundTo(margin, 0)
    //   this.gridObj['Invoiced Services'] = this.pAndLsvc.roundTo(
    //     invoicedservices,
    //     0,
    //   )
    //   this.gridObj['Invoiced Expenses'] = this.pAndLsvc.roundTo(
    //     invoicedexpenses,
    //     0,
    //   )
    //   this.gridObj['Payments'] = this.pAndLsvc.roundTo(payments, 0)
    //   this.gridObj['isCollapse'] = true;
    //   this.hoursEmpMonthGridData.push(this.gridObj);
    //   this.dataDownload = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData))
    //   this.gridObj = {}

    //   this.columnDefs = this.generateColumns(this.hoursEmpMonthGridData)
    //   let tableColumns = this.columnDefs.filter(function (el) {
    //     return el['field'] != 'project' && el['field'] != 'isCollapse'
    //   })
    //   this.summaryTableHeaderColumns = tableColumns.map((x) => x.field)
    //   this.rowData = this.hoursEmpMonthGridData
    // }
    let obj={
      total:'',
      status:'',
      sales:'',
      manager:'',
      cost:totalcost,
      revenue:totalrevenue,
      margin:totalmargin,
      invoicedservices:totalinvoicedservices,
      invoicedexpensed:totalinvoicedexpenses,
      payments:totalpayments,
      dues:totaldues
    }
    // this.hoursEmpMonthGridTotalObjArray .push(obj);
    this.hoursEmpMonthGridTotalObjArray.push('','','',totalcost,totalrevenue,totalmargin,totalinvoicedservices,totalinvoicedexpenses,totalpayments,totaldues)
    // this.hoursEmpMonthGridTotalObjArray = []
    // this.hoursEmpMonthGridTotalObjArray .push('');
    // this.hoursEmpMonthGridTotalObjArray .push('');
    // this.hoursEmpMonthGridTotalObjArray .push('');
    // this.hoursEmpMonthGridTotalObjArray .push(totalcost);
    // this.hoursEmpMonthGridTotalObjArray .push(totalrevenue);
    // this.hoursEmpMonthGridTotalObjArray .push(totalmargin);
    // this.hoursEmpMonthGridTotalObjArray .push(totalinvoicedservices);
    // this.hoursEmpMonthGridTotalObjArray .push(totalinvoicedexpenses);
    // this.hoursEmpMonthGridTotalObjArray .push(totalpayments);
    // this.hoursEmpMonthGridTotalObjArray .push(totaldues);
    this.pageNumber = 1
    this.gridData = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData));
    this.setPage(this.pageNumber, this.gridData);
    this.isDataReady = true
  }
  getBasicDetails(): void {
    this.yearMonths = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'month',
    )
    this.uniqueYearMonths =
      this.yearMonths && this.yearMonths.length
        ? this.yearMonths.map((ele: any) => {
          return ele.month
        })
        : []
    this.projects = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'project',
    )
    this.uniqueProjects =
      this.projects && this.projects.length
        ? this.projects.map((ele: any) => {
          return ele.project
        })
        : []
    this.sow = this.pAndLsvc.getUniqueDataAfterFilter(this.chartData, 'sow')
    this.uniquesow =
      this.sow && this.sow.length
        ? this.sow.map((ele: any) => {
          return ele.sow_number
        })
        : []
    this.projectmanager = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'project_manager',
    )
    this.uniqueprojectmanager =
      this.projectmanager && this.projectmanager.length
        ? this.projectmanager.map((ele: any) => {
          return ele.project_manager
        })
        : []
    this.salesperson = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'sales_person',
    )
    this.uniquesalesperson =
      this.salesperson && this.salesperson.length
        ? this.salesperson.map((ele: any) => {
          return ele.sales_person
        })
        : []
    this.projectstatus = this.pAndLsvc.getUniqueDataAfterFilter(
      this.chartData,
      'project_status',
    )
    this.uniqueprojectstatus =
      this.projectstatus && this.projectstatus.length
        ? this.projectstatus.map((ele: any) => {
          return ele.project_status
        })
        : []
  }

  generateColumns(data: any[]) {
    let columnDefinitions = []
    data.map((object) => {
      Object.keys(object).map((key) => {
        let mappedColumn = {}
        mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
        }
        columnDefinitions.push(mappedColumn)
      })
    })
    columnDefinitions = columnDefinitions.filter(
      (column, index, self) =>
        index ===
        self.findIndex((colAtIndex) => colAtIndex.field === column.field),
    )
    return columnDefinitions
  }

  downloadData() {
    this.dataDownload.map((item) => {
      // delete item.project;
      delete item.isCollapse;
      delete item.YearMonthDetails;
      return item
    })
    let date = new Date()
    let latest_date = this.datepipe.transform(date, 'ddMMyyyyhhmmss')
    switch (this.title) {
      case 'Project Revenue':
        this.pAndLsvc.exportToCsv(
          this.dataDownload,
          'projectRevenue' + latest_date,
        )
        break
      // Commented as not required
      // case 'Hours By Employee & Month':
      //   this.pAndLsvc.exportToCsv(
      //     this.dataDownload,
      //     'hoursByEmployee' + latest_date,
      //   )
      //   break
    }
  }

  changePagedItems(list: any): void {
    this.displayList = list
  }

  refresh() {
    this.getdata()
  }
  getClass(field): any {
    return this.requistionSvc.getClass(
      field,
      this.sortType,
      this.selectedHeaderTh,
    )
  }

  sort(sortKey: any): void {
    let sortResult: any
    this.selectedHeaderTh = sortKey
    sortResult = this.requistionSvc.sort(
      sortKey,
      this.hoursEmpMonthGridData,
      this.sortType,
    )
    this.hoursEmpMonthGridData = sortResult['result']
    this.sortType = sortResult['sortType']
    this.pageNumber = 0
    this.displayList = []
    this.pageNumber = this.pageNumber + 1;
    this.gridData = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData));
    this.setPage(this.pageNumber, this.gridData);
  }

  setDtOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      footerCallback: function (row, data: any, start, end, display) {
        var api = this.api(),
          data

        var intVal = function (i) {
          if (typeof i === 'string') {
            return parseInt(i.replace(/\D/g, ''))
          } else if (typeof i === 'number') {
            return i
          }
        }

        let roundTo = function (num: number, places: number) {
          let factor = 10 ** places
          let roundednum = Math.round(num * factor) / factor
          if (isFinite(roundednum)) {
            return roundednum
          } else {
            return 0
          }
        }

        let pageTotalCost = api
          .column(7, { page: 'current' })
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b)
          }, 0)

        let pageTotalRevenue = api
          .column(8, { page: 'current' })
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b)
          }, 0)
        let pageMargin = roundTo(
          (100 * (pageTotalRevenue - pageTotalCost)) / pageTotalRevenue,
          2,
        )
        $(api.column(6).footer()).html('Total')
        $(api.column(7).footer()).html(pageTotalCost.toLocaleString())
        $(api.column(8).footer()).html(pageTotalRevenue.toLocaleString())
        $(api.column(9).footer()).html(pageMargin.toString())
      },
    }
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy()
      this.dtTrigger.next()
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
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
    let duplicatesummaryTableHeaderColumns: any = JSON.parse(
      JSON.stringify(this.displayList),
    )
    filteredRecords = this.utilityService.filterObjectBySearchValue(this.hoursEmpMonthGridData,this.searchValue);
    // if (
    //   this.hoursEmpMonthGridData &&
    //   this.hoursEmpMonthGridData.length&&
    //   this.searchValue
    // ) {
    //   this.hoursEmpMonthGridData.filter((record: any) => {
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
    // }
    // else {
    //   filteredRecords = this.originaldata
    // }
    this.displayList = []
    duplicatesummaryTableHeaderColumns = filteredRecords
    let totalrevenue=0;
    let totalmargin=0
    let totalinvoicedservices=0
    let totalinvoicedexpenses=0
    let totalpayments=0
    let totaldues=0
    let totalcost=0;
    filteredRecords.forEach(element => {
 
    
    let cost = 0;
    let revenue= 0;
    let margin= 0;
    let invoicedservices= 0;
    let invoicedexpenses= 0;
    let payments= 0;
    let dues= 0;

    cost=element.Cost
    revenue=element.Revenue
    invoicedservices=element['Invoiced Services']
    invoicedexpenses=element['Invoiced Expences']
    payments=element.Payments
    dues=element.Dues
    if (cost === 0 && revenue === 0) {
      margin = 0
    } else if (cost != 0 && revenue === 0) {
      margin = -100
    } else {
      margin = (100 * (revenue - cost)) / revenue
    }
    totalcost=totalcost+cost;
    totalrevenue=totalrevenue+revenue
      totalinvoicedservices=totalinvoicedservices+invoicedservices
      totalinvoicedexpenses=totalinvoicedexpenses+invoicedexpenses
      totalpayments=totalpayments+payments
      totaldues=totaldues+dues
      if (totalcost === 0 && totalrevenue === 0) {
        totalmargin = 0
      } else if (totalcost != 0 && totalrevenue === 0) {
        totalmargin = -100
      } else {
        totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
      }
    })
    this.hoursEmpMonthGridTotalObjArray=[],
    this.hoursEmpMonthGridTotalObjArray.push('','','',totalcost,totalrevenue,totalmargin,totalinvoicedservices,totalinvoicedexpenses,totalpayments,totaldues)
    // this.displayList = duplicatesummaryTableHeaderColumns
    this.gridData = JSON.parse(JSON.stringify(filteredRecords));
    this.pageNumber = 0;
    this.pageNumber = this.pageNumber + 1
    this.setPage(this.pageNumber, this.gridData);
  }
  isValueTypeString(value: any): boolean {
    if (value && typeof value === 'string') {
      return true;
    }
    return false;
  } 
}
