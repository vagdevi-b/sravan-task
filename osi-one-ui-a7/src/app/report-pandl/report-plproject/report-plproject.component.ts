import { Component, OnInit } from '@angular/core'
import { PandlService } from '../../shared/services/pandl.service'
import { Subscription } from 'rxjs'
import * as Feather from 'feather-icons'
import { ShortNumberhPipe } from '../../shared/pipes/short-number.pipe'
import {
  ProjectBodyItems,
  ProjectHeaders,
} from '../../shared/constants/projects-tab.constants'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { ToastrService } from 'ngx-toastr'
import * as moment from 'moment'

declare var $: any
@Component({
  selector: 'app-report-plproject',
  templateUrl: './report-plproject.component.html',
  styleUrls: ['../../../../src/assets/css/light.css'],
})
export class ReportPlprojectComponent implements OnInit {
  totalcost: any = 0
  totalrevenue: any = 0
  margin: any = 0
  utilization: any = 0
  gridData: any = []
  projectDropDownSettings: any = {}
  project: any = []
  prject: any = []
  projectManager: any
  disableApplyButton: boolean = true
  salesPerson: any
  projectOrg: any
  customer: any
  totalHours: any = 0
  totalUtilization: any = 0
  totalBillablehours: any = 0
  totalnonBillableHours: any = 0
  totalBillableExpenses: any = 0
  totalNonBillableExpenses: any = 0
  estimatedCost: any = 0
  chartData: any = []
  projectsData = []
  yearsdata = []
  currenYear = []
  estimatedrevenue: any = 0
  estimatedHours: any = 0
  estimatedmargin: any = 0
  showFilters: boolean
  clearData: boolean = true
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated'
  subscriptions: Subscription[] = []
  projectHeaderItems: any[] = []
  projectBodyItems: any[] = []
  projectHeaderItemsDefault: any[] = [
    {
      title: ProjectHeaders.PM,
      value: '',
    },
    {
      title: ProjectHeaders.SP,
      value: '',
    },
    {
      title: ProjectHeaders.PO,
      value: '',
    },
    {
      title: ProjectHeaders.CU,
      value: '',
    },
  ]
  projectBodyItemsDefault: any[] = [
    {
      title: 'Cost',
      value: 0,
    },
    {
      title: 'Revenue',
      value: 0,
    },
    {
      title: 'Hours',
      value: 0,
    },
    {
      title: 'Margin',
      value: 0,
    },
    {
      title: 'Estimated Cost',
      value: 0,
    },
    {
      title: 'Estimated Revenue',
      value: 0,
    },
    {
      title: 'Estimated Hours',
      value: 0,
    },
    {
      title: 'Estimated Margin',
      value: 0,
    },
    {
      title: 'Billable Hours',
      value: 0,
    },
    {
      title: 'Non Billable Hours',
      value: 0,
    },
    {
      title: 'Billable Expenses',
      value: 0,
    },
    {
      title: 'Non Billable Expenses',
      value: 0,
    },
    {
      title: 'SOW Start Date',
      value: 0,
    },
    {
      title: 'SOW End Date',
      value: 0,
    },
    {
      title: 'Utilization',
      value: 0,
    },
    {
      title: 'Project Status',
      value: 0,
    },
  ]
  rawData: any[]
  obj: {}
  payLoad: any = []
  selectedSOW: any[]
  sow: any[]
  sowData: any[]
  selectedData: any
  selecteProjectId: any
  selectedSowId: any
  startDate: any
  endDate: any
  responseData: any
  status: any
  sowList: any
  constructor(
    private pAndLsvc: PandlService,
    private router: Router,
    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    if (localStorage.getItem('yearFilter') === null) {
      this.getyeardata()
    } else {
      this.currenYear.push(JSON.parse(localStorage.getItem('yearFilter')))
    }

   
    this.projectDropDownSettings = {
      singleSelection: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      idField: 'project_id',
      textField: 'project',
      itemsShowLimit: 1,
      classes: 'myclass custom-class',
    }
    this.subscriptions.push(
      this.pAndLsvc
        .getRunPandLDataProjectsTriggered()
        .subscribe((data: Boolean) => {
          if (data) {
            this.onLoadEvent()
          }
        }),
    )
    this.subscriptions.push(
      this.pAndLsvc.getDataofPandLProjects().subscribe(
        (response) => {
          this.gridData = []
          if (response) {
            if (this.clearData) {
              this.onFilterDeSelect('')
            }
           
            this.onLoadEvent()
            this.showProjectsInFilter()
           
            if (
              localStorage.getItem('triggerValue')&&
              localStorage.getItem('triggerValue') !=
              sessionStorage.getItem('valueTriggerProjects')
            ) {
              if (this.clearData) {
                this.onFilterDeSelect('')
              }
              this.onLoadEvent()
              localStorage.setItem('triggerValue', '0')
              sessionStorage.setItem('valueTriggerProjects', '0')
            }
            this.clearData = true
          } else {
            this.onLoadEvent()
          }
        },
        (err) => {
          console.log(err)
        },
      ),
    )

    this.onLoadEvent()
    this.showProjectsInFilter()
    this.setprojectHeaders()
    this.setProjectBody()
  }
  ngAfterViewInit() {
    Feather.replace()
  }
  onLoadEvent() {
    if (
      localStorage.getItem('projectFilter') != 'null' &&
      localStorage.getItem('projectFilter').length > 2
    ) {
      let selectedpProjects = JSON.parse(localStorage.getItem('projectFilter'))
      let selectedUniqueProjects = this.pAndLsvc.getUniqueDataAfterFilter(
        selectedpProjects,
        'project',
      )
      this.gridData = []
      for (let i = 0; i < selectedUniqueProjects.length; i++) {
        if (selectedUniqueProjects[i].project_id !== null) {
          this.gridData.push(selectedUniqueProjects[i].project)
        }
        let projects = JSON.parse(localStorage.getItem('projectFilterData'))
        let uniqueProjects = this.pAndLsvc.getUniqueDataAfterFilter(
          projects,
          'project',
        )
        this.rawData = []
        for (let i = 0; i < uniqueProjects.length; i++) {
          this.rawData.push(uniqueProjects[i])
        }
      }
    } else if (localStorage.getItem('projectFilterData').length > 2) {
      let projects = JSON.parse(localStorage.getItem('projectFilterData'))
      let uniqueProjects = this.pAndLsvc.getUniqueDataAfterFilter(
        projects,
        'project',
      )
      this.gridData = []
      this.rawData = []
      for (let i = 0; i < uniqueProjects.length; i++) {
        if (uniqueProjects[i].project_id !== null) {
          this.gridData.push(uniqueProjects[i].project)
          this.rawData.push(uniqueProjects[i])
        }
      }
    } else {
      // this.getdata();
    }
  }
  showProjectsInFilter() {
    let uniqueProjects = []
    // this.project = []
    this.project = this.gridData
    // this.pAndLsvc.getUniqueDataAfterFilter(
    //   this.gridData,
    //   'project',
    // )
  }
  onFilterSelect(item: any) {
    this.selectedData = this.rawData.filter(
      (data: any) => data.project === item,
    )

    this.selectedData.forEach((element) => {
      this.obj = {}

      this.selecteProjectId = element.project_id
    })
    this.pAndLsvc.getSowList(this.selecteProjectId).subscribe((response) => {
      let stringValue
      let sowselect = []
      this.sowList = response
      response.forEach((element) => {
        stringValue = element.sowNumber.toString()
        sowselect.push(stringValue)
        this.sowData = sowselect
      })
    })

    // this.selectedData.forEach((element) => {

    //   console.log(sowselect)
    // })
    //
    // console.log(this.sowData)
    this.onSowDeSelect('')
  }
  onFilterDeSelect(item: any) {
    this.disableApplyButton = true
    this.prject = []
    this.sow = []
    this.projectHeaderItems = [
      {
        title: ProjectHeaders.PM,
        value: '',
      },
      {
        title: ProjectHeaders.SP,
        value: '',
      },
      {
        title: ProjectHeaders.PO,
        value: '',
      },
      {
        title: ProjectHeaders.CU,
        value: '',
      },
    ]
    this.projectBodyItems = [
      {
        title: 'Cost',
        value: 0,
      },
      {
        title: 'Revenue',
        value: 0,
      },
      {
        title: 'Hours',
        value: 0,
      },
      {
        title: 'Margin',
        value: 0,
      },
      {
        title: 'Estimated Cost',
        value: 0,
      },
      {
        title: 'Estimated Revenue',
        value: 0,
      },
      {
        title: 'Estimated Hours',
        value: 0,
      },
      {
        title: 'Estimated Margin',
        value: 0,
      },
      {
        title: 'Billable Hours',
        value: 0,
      },
      {
        title: 'Non Billable Hours',
        value: 0,
      },
      {
        title: 'Billable Expenses',
        value: 0,
      },
      {
        title: 'Non Billable Expenses',
        value: 0,
      },
      {
        title: 'SOW Start Date',
        value: 0,
      },
      {
        title: 'SOW End Date',
        value: 0,
      },
      {
        title: 'Utilization',
        value: 0,
      },
      {
        title: 'Project Status',
        value: 0,
      },
    ]
  }
  onSowDeSelect(item: any) {
    this.disableApplyButton = true
    this.sow = []
  }
  onSowSelect(item: any) {
    this.selectedSowId = {}
    this.selectedSOW = []
    this.selectedSOW = this.sowList.filter(
      (data: any) => data.sowNumber === item,
    )
    this.selectedSOW.forEach((element) => {
      this.selectedSowId = element.sowId
    })
    if (this.sow.length > 0) {
      this.disableApplyButton = false
    }

    this.obj['sowIds'] = this.selectedSOW
    this.payLoad.push(this.obj)
    this.obj = {}
  }
  showData() {
    this.getdata()
  }
  constructBody() {
    if (localStorage.getItem('projectFilterData').length > 2) {
      let obj = {
        project: [this.selecteProjectId],
        sowIds: [this.selectedSowId],
        // "year" :JSON.parse(localStorage.getItem('yearFilter')),
        year: [],
        projectOrg: [],
        projectSubPrac: [],
        projectPractice: [],
        customer: [],
        employee: [],
        employeeOrg: [],
        employeeBu: [],
        employeePractice: [],
        employeeSubPrac: [],
        yearMonth: [],
      }
      return obj
    } else {
      let obj = {
        project: [],
        sowIds: [],
        year: this.currenYear,
        projectOrg: [],
        projectSubPrac: [],
        projectPractice: [],
        customer: [],
        employee: [],
        employeeOrg: [],
        employeeBu: [],
        employeePractice: [],
        employeeSubPrac: [],
        yearMonth: [],
      }
      return obj
    }
  }

  refresh(value?: any) {
    $('#loadingEditSubmitModal').modal('show')
    this.getdata()
    $('#loadingEditSubmitModal').modal('hide')
  }
  onSelectAll(item: any) {}
  setprojectHeaders(): void {
    this.projectHeaderItems = JSON.parse(
      JSON.stringify(this.projectHeaderItemsDefault),
    )
  }
  setProjectBody(): void {
    this.projectBodyItems = JSON.parse(
      JSON.stringify(this.projectBodyItemsDefault),
    )
  }
  showDataOfSelectedProject(selectedProject) {
    let projectData = []
    projectData = this.responseData.filter(
      (data: any) => data.project_id === selectedProject,
    )
    this.setprojectHeaders()
    this.setProjectBody()
    let cost = 0
    let revenue = 0
    let margin = 0
    let utilization = 0
    let billinghours = 0
    let nonbillinghours = 0
    let internalhours = 0
    let holidayhours = 0
    let ptohours = 0
    let specialleavehours = 0
    let estimatedcost = 0
    let estimatedrevenue = 0
    let estimatedhours = 0
    let estimatedmargin = 0
    let billableexpenses = 0
    let nonbillableexpenses = 0
    // let startDate;
    // let endDate;
    for (let i = 0; i < projectData.length; i++) {
      cost = cost + projectData[i].recognized_cost
      revenue = revenue + projectData[i].recognized_revenue
      billinghours = billinghours + projectData[i].billable_hours
      nonbillinghours = nonbillinghours + projectData[i].non_billable_hours
      internalhours = internalhours + projectData[i].internal_hours
      holidayhours = holidayhours + projectData[i].holiday_hours
      ptohours = ptohours + projectData[i].pto_hours
      specialleavehours = specialleavehours + projectData[i].special_leave_hours
      estimatedcost = projectData[i].estimated_cost
      estimatedrevenue = projectData[i].estimated_revenue
      estimatedhours = projectData[i].estimated_hours
      billableexpenses = billableexpenses + projectData[i].billable_expenses
      nonbillableexpenses =
        nonbillableexpenses + projectData[i].non_billable_expenses
    }
    if (cost === 0 && revenue === 0) {
      margin = 0
    } else if (cost != 0 && revenue === 0) {
      margin = -100
    } else {
      margin = (100 * (revenue - cost)) / revenue
    }
    if (isNaN(margin) || margin === Infinity || margin === -Infinity) {
      margin = 0
    }
    let totalhours =
      billinghours + nonbillinghours + internalhours + holidayhours + ptohours
    utilization = this.pAndLsvc.roundTo((billinghours / totalhours) * 100, 2)
    if (
      isNaN(utilization) ||
      utilization === Infinity ||
      utilization === -Infinity
    ) {
      utilization = 0
    }
    if (estimatedcost === 0 && estimatedrevenue === 0) {
      estimatedmargin = 0
    } else if (estimatedcost != 0 && estimatedrevenue === 0) {
      estimatedmargin = -100
    } else {
      estimatedmargin =
        (100 * (estimatedrevenue - estimatedcost)) / estimatedrevenue
    }
    if (
      isNaN(estimatedmargin) ||
      estimatedmargin === Infinity ||
      estimatedmargin === -Infinity
    ) {
      estimatedmargin = 0
    }
    this.totalcost = ShortNumberhPipe.prototype.transform(cost, 2)
    this.totalrevenue = ShortNumberhPipe.prototype.transform(revenue, 2)
    this.margin = this.pAndLsvc.roundTo(margin, 2)
    this.utilization = this.pAndLsvc.roundTo(utilization, 2)
    this.totalBillablehours = billinghours.toLocaleString()
    this.totalnonBillableHours = nonbillinghours.toLocaleString()
    this.totalHours = (billinghours + nonbillinghours).toLocaleString()
    this.totalBillableExpenses = ShortNumberhPipe.prototype.transform(
      billableexpenses,
      2,
    )
    this.totalNonBillableExpenses = ShortNumberhPipe.prototype.transform(
      nonbillableexpenses,
      2,
    )
    this.estimatedCost = ShortNumberhPipe.prototype.transform(estimatedcost, 2)
    this.estimatedrevenue = ShortNumberhPipe.prototype.transform(
      estimatedrevenue,
      2,
    )
    this.estimatedHours = estimatedhours.toLocaleString()
    this.estimatedmargin = this.pAndLsvc.roundTo(estimatedmargin, 2)
    this.projectManager = projectData[0].project_manager
    this.salesPerson = projectData[0].sales_person
    this.startDate = projectData[0].sow_start_date
    this.endDate = projectData[0].sow_end_date
    this.status = projectData[0].project_status
    this.projectOrg = projectData[0].project_org
    this.customer = projectData[0].customer
    this.projectHeaderItems.forEach((element: any) => {
      if (element.title === ProjectHeaders.PM) {
        element.value = projectData[0].project_manager
      } else if (element.title === ProjectHeaders.SP) {
        element.value = projectData[0].sales_person
      } else if (element.title === ProjectHeaders.PO) {
        element.value = projectData[0].project_org
      } else if (element.title === ProjectHeaders.CU) {
        element.value = projectData[0].customer
      }
    })
    this.projectBodyItems.forEach((element: any) => {
      if (element.title === ProjectBodyItems.COST) {
        element.value = this.totalcost
      } else if (element.title === ProjectBodyItems.REVENUE) {
        element.value = this.totalrevenue
      } else if (element.title === ProjectBodyItems.Hours) {
        element.value = this.totalHours
      } else if (element.title === ProjectBodyItems.Margin) {
        element.value = this.margin + '%'
      } else if (element.title === ProjectBodyItems.Utilization) {
        element.value = this.utilization + '%'
      } else if (element.title === ProjectBodyItems.ESTIMATED_COST) {
        element.value = this.estimatedCost
      } else if (element.title === ProjectBodyItems.ESTIMATED_REVENUE) {
        element.value = this.estimatedrevenue
      } else if (element.title === ProjectBodyItems.ESTIMATED_HOURS) {
        element.value = this.estimatedHours
      } else if (element.title === ProjectBodyItems.ESTIMATED_MARGIN) {
        element.value = this.estimatedmargin + '%'
      } else if (element.title === ProjectBodyItems.BILLABLE_HOURS) {
        element.value = this.totalBillablehours
      } else if (element.title === ProjectBodyItems.NON_BILLABLE_HOURS) {
        element.value = this.totalnonBillableHours
      } else if (element.title === ProjectBodyItems.BILLABLE_EXPENSES) {
        element.value = this.totalBillableExpenses
      } else if (element.title === ProjectBodyItems.NON_BILLABLE_EXPENSES) {
        element.value = this.totalNonBillableExpenses
      } else if (element.title === ProjectBodyItems.Start_Date) {
        element.value = moment(this.startDate).format('MM/DD/YYYY')
      } else if (element.title === ProjectBodyItems.End_Date) {
        element.value = moment(this.endDate).format('MM/DD/YYYY')
      } else if (element.title === ProjectBodyItems.Status) {
        element.value = this.status
      }
    })
  }
  showfilters() {
    this.showFilters = true
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden'
  }

  closingFilters(event) {
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated'
    this.showFilters = event
  }

  getyeardata() {
    this.yearsdata = []
    this.pAndLsvc.getYearsList().subscribe(
      (response) => {
        const yearsList = _.orderBy(response.Years, ['year'], ['desc'])
        this.yearsdata = yearsList
        let filter = _.orderBy(this.yearsdata, ['year'], ['asce'])
        if (localStorage.getItem('yearFilter') === null) {
          this.currenYear = [filter.reduce((sum, currObj) => currObj.year, 0)]
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }
  getdata() {
    let body = this.constructBody()
    this.clearData = false
    $('#loadingEditSubmitModal').modal('show')
    this.pAndLsvc.getRunPandLDataProjects(body).subscribe(
      (data) => {
        if(data['P and L'])
       { this.responseData = data['P and L']}
       else{
        this.responseData=[];
       }
        $('#loadingEditSubmitModal').modal('hide')
        this.showProjectsInFilter()
        // this.onFilterDeSelect('')
        if(!this.responseData.length)
        // if(!this.responseData)
        { this.toastr.warning('No Data Found.')}
        this.showDataOfSelectedProject(this.selecteProjectId)
        $('#loadingEditSubmitModal').modal('hide')
      },
      (err) => {
        console.log(err)
        this.toastr.error('Error Occurred.')
        $('#loadingEditSubmitModal').modal('hide')
      },
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe()
    })
  }
}
