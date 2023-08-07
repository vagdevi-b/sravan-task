import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  SystemJsNgModuleLoader,
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

import { object } from 'underscore'
import { UtilityService } from '../../../shared/services/utility.service'

@Component({
  selector: 'app-report-employee-table',
  templateUrl: './report-employee-table.component.html',
  styleUrls: ['../../../../../src/assets/css/light.css'],
  providers: [PaginationService],
})
export class ReportEmployeeTableComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>()
  @ViewChild(DataTableDirective) dtElement: DataTableDirective
  showFilters: boolean
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated'
  chartData: any[] = []

  hoursEmpMonthGridData: any = []
  hoursEmpMonthGridColumns: any = []
  hoursEmpMonthGridColumnsData: any = []
  gridObj = {}
  columnDefs = []
  filteredcolumnDefs = []
  rowData = []
  hoursEmpMonthGridTotalObjArray = []
  yearMonths: any[] = []
  uniqueYearMonths: any[] = []
  employees: any[]
  uniqueEmps: any[]
  tableDisable: boolean = true;
  projects: any[]
  uniqueProjects: any[]
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
  download: any[] = []
  dataDownload: any[] = []
  searchValue: any;
  gridData: any[] = [];
  duplicatedata: any = []
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
    this.hoursEmpMonthGridColumns = []
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
    // this.getdata();
    this.setDtOptions()
  }

  ngAfterViewInit() {
    this.getdata()
    Feather.replace()
    this.dtTrigger.next()
    // this.rerender();
  }

  getdata() {
    if (this.chartData.length) {
      this.getBasicDetails()
      this.constructEmployeeData()
    } else {
      this.hoursEmpMonthGridColumns = []
      this.hoursEmpMonthGridData = []
      this.hoursEmpMonthGridTotalObjArray = []
    }
  }
  showfilters() {
    this.showFilters = true
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden'
  }

  closingFilters(event) {
    // console.log(event);
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated'
    this.showFilters = event
  }

  filterArray(array, filters) {
    // console.log(filters,'filters');
    const filterKeys = Object.keys(filters)
    return array.filter((eachObj) => {
      return filterKeys.every((eachKey) => {
        if (!filters[eachKey].length) {
          return true // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey])
      })
    })
  }

  getUniqueDataAfterFilter(data, keyword) {
    let newArray = []
    newArray = _.uniqBy(data, keyword)
    let uniqueArray = newArray.sort(this.GetSortOrder(keyword))
    let filtered = uniqueArray.filter((item) => item[keyword] != null)
    return filtered
  }
  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1
      } else if (a[prop] < b[prop]) {
        return -1
      }
      return 0
    }
  }

  getProjectDetails(employeeName: any): any[] {
    let projectData = []
    const employeeRecords: any[] = this.chartData.filter(
      (ele: any) => ele.employee === employeeName,
    )
    projectData = this.getProjEmpYearMonthData(employeeName, employeeRecords)
    return projectData
  }

  constructEmployeeData(): void {
    this.isDataReady = false
    for (let i = 0; i < this.uniqueEmps.length; i++) {
      this.gridObj['Employee'] = this.uniqueEmps[i]
      const employeeRecords: any[] = this.chartData.filter(
        (ele: any) => ele.employee === this.uniqueEmps[i],
      )
      // this.projectEmpYMData = this.getProjEmpYearMonthData(this.uniqueEmps[i], employeeRecords);
      // this.gridObj['project'] = this.projectEmpYMData;
      this.gridObj['project'] = []
      for (let j = 0; j < this.uniqueYearMonths.length; j++) {
        let obj = {
          employee: this.uniqueEmps[i],
          yearmonth: this.uniqueYearMonths[j],
        }
        let yearMonthEmpData = []
        yearMonthEmpData = this.filterArray(employeeRecords, obj)
        if (yearMonthEmpData.length) {
          let sum = 0
          if (this.title === 'Month On Month Revenue') {
            sum = yearMonthEmpData.reduce(
              (sum, currObj) => sum + currObj.recognized_revenue,
              0,
            )
          } else {
            sum = yearMonthEmpData.reduce(
              (sum, currObj) =>
                sum + currObj.billable_hours + currObj.non_billable_hours,
              0,
            )
          }
          this.gridObj[this.uniqueYearMonths[j]] = sum
            ? this.pAndLsvc.roundTo(sum, 0)
            : 0
        } else {
          this.gridObj[this.uniqueYearMonths[j]] = 0
        }
      }
      this.gridObj['isCollapse'] = true
      this.hoursEmpMonthGridData.push(this.gridObj)
      this.dataDownload = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData))
      this.gridObj = {}
    }
    this.columnDefs = this.generateColumns(this.hoursEmpMonthGridData)
    let tableColumns = this.columnDefs.filter(function (el) {
      return el['field'] != 'project' && el['field'] != 'isCollapse'
    })
    this.hoursEmpMonthGridColumns = tableColumns.map((x) => x.field)

    this.rowData = this.hoursEmpMonthGridData

    //footer totals
    this.hoursEmpMonthGridTotalObjArray = []
    for (let i = 0; i < this.hoursEmpMonthGridColumns.length; i++) {
      let prop = this.hoursEmpMonthGridColumns[i]
      if (prop !== 'Employee') {
        let totalSum = 0
        if (this.title === 'Month On Month Revenue') {
          totalSum = this.hoursEmpMonthGridData.reduce(
            (sum, currObj) => sum + currObj[prop],
            0,
          )
        } else {
          totalSum = this.hoursEmpMonthGridData.reduce(
            (sum, currObj) => sum + currObj[prop],
            0,
          )
        }
        this.hoursEmpMonthGridTotalObjArray.push(totalSum);

      }
    }
    this.pageNumber = 1
    this.gridData = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData));
    this.setPage(this.pageNumber, this.gridData);
    this.isDataReady = true
  }

  getProjEmpYearMonthData(empName, employeeRecords) {
    let projectData = []
    let ProjObj = {}
    const employeeprojects = this.getUniqueDataAfterFilter(
      employeeRecords,
      'project',
    )
    const employeeUniqueProjects =
      employeeprojects && employeeprojects.length
        ? employeeprojects.map((ele: any) => {
          return ele.project
        })
        : []
    for (let j = 0; j < employeeUniqueProjects.length; j++) {
      for (let i = 0; i < this.uniqueYearMonths.length; i++) {
        let filterObj = {
          employee: empName,
          project: employeeUniqueProjects[j],
          yearmonth: this.uniqueYearMonths[i],
        }
        let projEmpYearMonthData = []
        projEmpYearMonthData = this.filterArray(employeeRecords, filterObj)
        if (projEmpYearMonthData && projEmpYearMonthData.length) {
          ProjObj['Employee'] = employeeUniqueProjects[j]
          let sum = 0
          if (this.title === 'Month On Month Revenue') {
            sum = projEmpYearMonthData.reduce(
              (sum, currObj) => sum + currObj.recognized_revenue,
              0,
            )
          } else {
            sum = projEmpYearMonthData.reduce(
              (sum, currObj) =>
                sum + currObj.billable_hours + currObj.non_billable_hours,
              0,
            )
          }
          ProjObj[this.uniqueYearMonths[i]] = sum
            ? this.pAndLsvc.roundTo(sum, 0)
            : 0
        } else {
          ProjObj[this.uniqueYearMonths[i]] = 0
        }
      }
      if (Object.keys(ProjObj).length !== 0) {
        projectData.push(ProjObj)
      }
      ProjObj = {}
    }

    return projectData
  }

  getBasicDetails(): void {
    this.yearMonths = this.getUniqueDataAfterFilter(this.chartData, 'yearmonth')
    this.uniqueYearMonths =
      this.yearMonths && this.yearMonths.length
        ? this.yearMonths.map((ele: any) => {
          return ele.yearmonth
        })
        : []
    this.employees = this.getUniqueDataAfterFilter(this.chartData, 'employee')
    this.uniqueEmps =
      this.employees && this.employees.length
        ? this.employees.map((ele: any) => {
          return ele.employee
        })
        : []
    this.projects = this.getUniqueDataAfterFilter(this.chartData, 'project')
    this.uniqueProjects =
      this.projects && this.projects.length
        ? this.projects.map((ele: any) => {
          return ele.project
        })
        : []
  }

  generateColumns(data: any[]) {
    let columnDefinitions = []

    data.map((object) => {
      Object.keys(object).map((key) => {
        let mappedColumn = {}
        if (key === 'employee') {
          mappedColumn = {
            headerName: key.toUpperCase(),
            field: key,
          }
        } else {
          // const tokenizedKeys: any[] = key.includes('hours') || key.includes('revenue') ? key.split('-') : [];
          mappedColumn = {
            headerName: key.toUpperCase(),
            field: key,
            sortable: true,
          }
        }
        columnDefinitions.push(mappedColumn)
      })
    })
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter(
      (column, index, self) =>
        index ===
        self.findIndex((colAtIndex) => colAtIndex.field === column.field),
    )
    let sortedColumns = columnDefinitions.sort(this.GetSortOrder('field'))
    return sortedColumns.reverse()
  }

  downloadData() {
    this.dataDownload.map((item) => {
      delete item.project
      delete item.isCollapse
      return item
    })

    let date = new Date()
    let latest_date = this.datepipe.transform(date, 'ddMMyyyyhhmmss')
    switch (this.title) {
      case 'Month On Month Revenue':
        this.pAndLsvc.exportToCsv(
          this.dataDownload,
          'monthOnMonthRevenue' + latest_date,
        )
        break
      case 'Hours By Employee & Month':
        this.pAndLsvc.exportToCsv(
          this.dataDownload,
          'hoursByEmployee' + latest_date,
        )
        break
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
    // $('#loadingEditSubmitModal').modal('show');
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
    this.pageNumber = this.pageNumber + 1
    this.gridData = JSON.parse(JSON.stringify(this.hoursEmpMonthGridData));
    this.setPage(this.pageNumber, this.gridData);
    // $('#loadingEditSubmitModal').modal('hide');
    // if (this.pagination) {
    //   this.pagination.setPage(1);
    // }
  }

  setDtOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      footerCallback: function (row, data: any, start, end, display) {
        var api = this.api(),
          data

        // Remove the formatting to get integer data for summation
        var intVal = function (i) {
          // console.log(i);
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

        // Total over all pages
        // let total = api
        //     .column( 8 )
        //     .data()
        //     .reduce( function (a, b) {
        //         return intVal(a) + intVal(b);
        //     }, 0 );

        // Total over this page
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
        // Update footer
        $(api.column(6).footer()).html('Total')
        $(api.column(7).footer()).html(pageTotalCost.toLocaleString())
        $(api.column(8).footer()).html(pageTotalRevenue.toLocaleString())
        $(api.column(9).footer()).html(pageMargin.toString())
      },
    }
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy()
      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    })
  }
  searchValueChanges(value: any): void {
    this.tableDisable = false;
    let filteredRecords: any[] = []
    this.searchValue = value
    if (Number(value)) {
      this.searchValue = Number(value)
    }
    let duplicatesummaryTableHeaderColumns: any = JSON.parse(
      JSON.stringify(this.displayList),
    )
    filteredRecords = this.utilityService.filterObjectBySearchValue(this.hoursEmpMonthGridData, this.searchValue);
    this.duplicatedata = JSON.parse(JSON.stringify(filteredRecords));

    this.filteredcolumnDefs = this.generateColumns(this.duplicatedata)
    let filteredtableColumns = this.filteredcolumnDefs.filter(function (el) {
      return el['field'] != 'project' && el['field'] != 'isCollapse' && el['field'] != 'Employee'
    })
    this.hoursEmpMonthGridColumnsData = filteredtableColumns.map((x) => x.field)


    this.duplicatedata.map((item) => {
      delete item.Employee;
      delete item.project;
      delete item.isCollapse;
      return item
    })
    this.hoursEmpMonthGridTotalObjArray = []
    for (let i = 0; i < this.hoursEmpMonthGridColumnsData.length; i++) {
      let prop = this.hoursEmpMonthGridColumnsData[i]
      if (prop) {
        let totalSum = 0
        if (this.title === 'Month On Month Revenue') {
          totalSum = this.duplicatedata.reduce(
            (sum, currObj) => sum + currObj[prop],
            0,
          )
        } else {
          totalSum = this.duplicatedata.reduce(
            (sum, currObj) => sum + currObj[prop],
            0,
          )
        }
        this.hoursEmpMonthGridTotalObjArray.push(totalSum);

      }


    }



    this.displayList = []
    duplicatesummaryTableHeaderColumns = filteredRecords
    this.gridData = JSON.parse(JSON.stringify(filteredRecords));
    this.pageNumber = 0;
    this.pageNumber = this.pageNumber + 1
    this.setPage(this.pageNumber, this.gridData);

  }
  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe()
    })
  }
}
