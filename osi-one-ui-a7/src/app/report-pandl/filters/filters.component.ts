import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { PandlService } from '../../shared/services/pandl.service'
import * as _ from 'lodash'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'

declare var $: any
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['../../../../src/assets/css/light.css'],
})
export class FiltersComponent implements OnInit {
  showfilters: boolean = false
  callPandL: boolean = true
  callPayment: boolean = true
  callProject: boolean = true
  display:boolean=true
  dropdownSettings = {}
  projectOrgDropDownSettings = {}
  projectPracticeDropDownSettings = {}
  projectSubPracticeDropDownSettings = {}
  customerDropDownSettings = {}
  projectDropDownSettings = {}
  employeeOrgDropDownSettings = {}
  employeeBuDropDownSettings = {}
  employeePracticeDropDownSettings = {}
  employeeDropDownSettings = {}
  employeeSubPracticeDropDownSettings = {}
  dropdownList: any = []
  yearselected: any = []
  year: any = []
  yearsdata: DropdownFilterDataModel[]
  // monthsdata:DropdownFilterMonthModel[]
  monthsdata:any[]=[]
  projectorg: any = []
  projectorgs: any = []
  projectprct: any = []
  projectsubprct: any = []
  customer: any = []
  project: any = []
  employeeorg: any = []
  employeebu: any = []
  employeeprct: any = []
  employeesubprct: any = []
  employee: any = []
  projectpractices: any = []
  projectsubpractices: any = []
  customers: any = []
  projects: any = []
  monthselected:any=[]
  employeeorgs: any = []
  employeeBUs: any = []
  employeepractices: any = []
  employeesubpractices: any = []
  employees: any = []

  //selected ngmodels of dropdowns
  projorg: any = []
  projectpractice: any = []
  projectsubpractice: any = []
  custmer: any = []
  prject: any = []
  employeorg: any = []
  employebu: any = []
  employeepractice: any = []
  employeesubpractice: any = []
  employe: any = []

  panelData: any = []
  totalrevenue: any = 0
  totalcost: any = 0
  spinner: boolean = false
  selectedmonth: any
  yearmonth: any
  constructor(
    private pandlsvc: PandlService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getyeardata()
    this.monthsdata=["01","02","03","04","05","06","07","08","09","10","11","12"]
  //  this.monthsdata=[{month_id:0o1,month:0o1},
  //   {month_id:0o2,month:0o2},
  //   {month_id:0o3,month:0o3},
  //   {month_id:0o4,month:0o4},
  //   {month_id:0o5,month:0o5},
  //   {month_id:"06",month:"06"},
  //   {month_id:"07",month:"07"},
  //   {month_id:"08",month:"08"},
  //   {month_id:"09",month:"09"},
  //   {month_id:"10",month:"10"},
  //   {month_id:11,month:11},
  //   {month_id:12,month:12}
  // ]
    if(this.router.url.includes('pandlproject')){
      this.display=false;
    }
    this.dropdownSettings = this.getdropdownsettings('year_id', 'year')
    this.projectOrgDropDownSettings = this.getdropdownsettings(
      'project_id',
      'project_org',
    )
    this.projectPracticeDropDownSettings = this.getdropdownsettings(
      'project_id',
      'project_practice',
    )
    this.projectSubPracticeDropDownSettings = this.getdropdownsettings(
      'project_id',
      'project_sub_practice',
    )
    this.employeeOrgDropDownSettings = this.getdropdownsettings(
      'employee_id',
      'employee_org',
    )
    this.employeeBuDropDownSettings = this.getdropdownsettings(
      'employee_id',
      'employee_bu',
    )
    this.employeePracticeDropDownSettings = this.getdropdownsettings(
      'employee_id',
      'employee_practice',
    )
    this.employeeSubPracticeDropDownSettings = this.getdropdownsettings(
      'employee_id',
      'employee_sub_practice',
    )
    this.customerDropDownSettings = this.getdropdownsettings(
      'customer_id',
      'customer',
    )
    this.projectDropDownSettings = this.getdropdownsettings(
      'project_id',
      'project',
    )
    this.employeeDropDownSettings = this.getdropdownsettings(
      'employee_id',
      'employee',
    )
    this.getPreservedFilters()

    if (
      this.yearsdata === null ||
      this.yearsdata === undefined ||
      this.yearsdata.length === 0
    ) {
      this.projectorg = []
      this.projectprct = []
      this.projectsubprct = []
      this.customer = []
      this.project = []
      this.employeeorg = []
      this.employeebu = []
      this.employeeprct = []
      this.employeesubprct = []
      this.employee = []
     
      this.getDataOFPandL()
      // if (
      //   localStorage.getItem('employeeFilterData') === undefined ||
      //   localStorage.getItem('employeeFilterData') === null ||
      //   localStorage.getItem('employeeFilterData') === 'null' ||
      //   localStorage.getItem('employeeFilterData').length <= 2

      // ) {
      //   this.getPanelData();
      // }
    } else {
      // let body = {
      //   year : this.yearselected.map(x => x.year)
      // }
      // this.spinner = true;
      // this.pandlsvc.getPanelData(body).subscribe(response => {

      //   this.panelData = response.PanelData;
      //   this.spinner = false;
      // });
      // this.yearselected = [
      //   {
      //     year_id : 2021,
      //     year :2021
      //   }
      // ];
      this.year = this.yearselected.map((x) => x.year)

      if (
        localStorage.getItem('employeeFilterData') === undefined ||
        localStorage.getItem('employeeFilterData') === null ||
        localStorage.getItem('employeeFilterData') === 'null' ||
        localStorage.getItem('employeeFilterData').length <= 2
      ) {
        this.getPanelData()
      }
      this.getyeardata()

      // if (this.panelData.length<=0){
      //   this.getPanelData();
      // }

      this.projectorgs = this.projorg.map((x) => x.project_org)
      this.projectpractices = this.projectpractice.map(
        (x) => x.project_practice,
      )
      this.projectsubpractices = this.projectsubpractice.map(
        (x) => x.project_sub_practice,
      )
      this.customers = this.custmer.map((x) => x.customer_id)
      this.projects = this.prject.map((x) => x.project_id)
      this.employeeorgs = this.employeorg.map((x) => x.employee_org)
      this.employeeBUs = this.employebu.map((x) => x.employee_bu)
      this.employeepractices = this.employeepractice.map(
        (x) => x.employee_practice,
      )
      this.employeesubpractices = this.employeesubpractice.map(
        (x) => x.employee_sub_practice,
      )
      this.employees = this.employe.map((x) => x.employee_id)
    }
    // console.log(this.panelData);
    // if(localStorage.getItem('panelData')!=undefined||localStorage.getItem('panelData').length>=1){

    // }
  }
  @Output() closefilters = new EventEmitter<boolean>()
  @Output() callPandLData = new EventEmitter<boolean>()
  @Output() callPaymentData = new EventEmitter<boolean>()
  @Output() callProjectData = new EventEmitter<boolean>()
  closeFilters() {
    this.closefilters.emit(this.showfilters)
  }
  getdropdownsettings(id, textfield) {
    let tmpsetings = {}
    tmpsetings = {
      singleSelection: textfield === 'year' ? true : false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: textfield === 'year' ? false : true,
      idField: id,
      textField: textfield,
      itemsShowLimit: 1,
      classes: 'myclass custom-class',
    }
    return tmpsetings
  }

  getyeardata() {
    this.yearsdata = []
    this.pandlsvc.getYearsList().subscribe(
      (response) => {
        if (response && response['Years']) {
          const yearsList = _.orderBy(response.Years, ['year'], ['desc'])
          this.yearsdata = yearsList
          let filter = _.orderBy(this.yearsdata, ['year'], ['asce'])
          if (localStorage.getItem('yearFilter') === null) {
            const currenYear: number = new Date().getFullYear()
            this.yearselected = [
              {
                year_id: filter.reduce((sum, currObj) => currObj.year_id, 0),
                year: filter.reduce((sum, currObj) => currObj.year, 0),
              },
            ]
            this.year = [filter.reduce((sum, currObj) => currObj.year, 0)]

            this.getPanelData()
            this.year = this.yearselected.map((x) => x.year)
          }
          // if (localStorage.getItem('projectSubPracticeFilterData').length <= 0) {
          //   this.getPanelData();
          // }
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  onSelectAll(item: any, fromFilter: any) {
    switch (fromFilter) {
      case 'fromyear':
        this.year = item
        //this.getPanelData();
        break
      case 'fromProjectOrg':
        //this.projectorgs.push(item.project_org);
        this.projectorgs = item.map((x) => x.project_org)

        //on select make below dropdown filter object data null and then get new unique data
        this.projectpractices = []
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectpractice = []
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProjectPractice':
        //this.projectpractices.push(item.project_practice);
        this.projectpractices = item.map((x) => x.project_practice)

        //on select make below dropdown filter object data null and then get new unique data
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProjectSubPractice':
        //this.projectsubpractices.push(item.project_sub_practice);
        this.projectsubpractices = item.map((x) => x.project_sub_practice)
        //on select make below dropdown filter object data null and then get new unique data
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromCustomer':
        //this.customers.push(item.customer_id);
        this.customers = item.map((x) => x.customer_id)

        //on select make below dropdown filter object data null and then get new unique data
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProject':
        //this.projects.push(item.project_id);
        this.projects = item.map((x) => x.project_id)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeOrg':
        //this.employeeorgs.push(item.employee_org);
        this.employeeorgs = item.map((x) => x.employee_org)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeBU':
        //this.employeeBUs.push(item.employee_bu);
        this.employeeBUs = item.map((x) => x.employee_bu)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeePractice':
        //this.employeepractices.push(item.employee_practice);
        this.employeepractices = item.map((x) => x.employee_practice)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeSubPractice':
        //this.employeesubpractices.push(item.employee_sub_practice);
        this.employeesubpractices = item.map((x) => x.employee_sub_practice)
        //on select make below dropdown filter object data null and then get new unique data
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployee':
        //this.employees.push(item.employee_id);
        // console.log(this.employe)
        this.employees = item.map((x) => x.employee_id)
        this.filterData(fromFilter)
        break
      default:
        console.log('default')
    }
  }

  onDeselectAll(item: any, fromFilter: any) {
    switch (fromFilter) {
      case 'fromyear':
        this.year = item
      case 'fromProjectOrg':
        // console.log('in projectorg case')
        this.projectorgs = item
        // console.log(this.projectorgs, 'project args')
        this.filterData(fromFilter)
        break
      case 'fromProjectPractice':
        this.projectpractices = item
        this.filterData(fromFilter)
        break
      case 'fromProjectSubPractice':
        this.projectsubpractices = item
        this.filterData(fromFilter)
        break
      case 'fromCustomer':
        this.customers = item
        this.filterData(fromFilter)
        break
      case 'fromProject':
        this.projects = item
        this.filterData(fromFilter)
        break
      case 'fromEmployeeOrg':
        this.employeeorgs = item
        this.filterData(fromFilter)
        break
      case 'fromEmployeeBU':
        this.employeeBUs = item
        this.filterData(fromFilter)
        break
      case 'fromEmployeePractice':
        this.employeepractices = item
        this.filterData(fromFilter)
        break
      case 'fromEmployeeSubPractice':
        this.employeesubpractices = item
        this.filterData(fromFilter)
        break
      case 'fromEmployee':
        this.employees = item
        this.filterData(fromFilter)
        break
      default:
        console.log('default')
    }
  }
  onItemSelect(item: any) {
    this.year = this.yearselected
    this.getPanelData()
  }
onMonthSelect(item: any){
this.selectedmonth=parseInt(item);
this.monthselected=[]
this.monthselected.push(item)
this.getPanelData()
}
onMonthDeSelect(item: any){
  this.selectedmonth='';
  }
  onYearDeSelect(item: any) {
    this.year = this.yearselected
    this.getPanelData()
  }

  onFilterSelect(item: any, fromFilter: any) {
    switch (fromFilter) {
      case 'fromProjectOrg':
        //this.projectorgs.push(item.project_org);
        this.projectorgs = this.projorg.map((x) => x.project_org)

        //on select make below dropdown filter object data null and then get new unique data
        this.projectpractices = []
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectpractice = []
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProjectPractice':
        //this.projectpractices.push(item.project_practice);
        this.projectpractices = this.projectpractice.map(
          (x) => x.project_practice,
        )

        //on select make below dropdown filter object data null and then get new unique data
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProjectSubPractice':
        //this.projectsubpractices.push(item.project_sub_practice);
        this.projectsubpractices = this.projectsubpractice.map(
          (x) => x.project_sub_practice,
        )
        //on select make below dropdown filter object data null and then get new unique data
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromCustomer':
        //this.customers.push(item.customer_id);
        this.customers = this.custmer.map((x) => x.customer_id)

        //on select make below dropdown filter object data null and then get new unique data
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromProject':
        //this.projects.push(item.project_id);
        this.projects = this.prject.map((x) => x.project_id)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeOrg':
        //this.employeeorgs.push(item.employee_org);
        this.employeeorgs = this.employeorg.map((x) => x.employee_org)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeBU':
        //this.employeeBUs.push(item.employee_bu);
        this.employeeBUs = this.employebu.map((x) => x.employee_bu)
        //on select make below dropdown filter object data null and then get new unique data
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeePractice':
        //this.employeepractices.push(item.employee_practice);
        this.employeepractices = this.employeepractice.map(
          (x) => x.employee_practice,
        )
        //on select make below dropdown filter object data null and then get new unique data
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeesubpractice = []
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployeeSubPractice':
        //this.employeesubpractices.push(item.employee_sub_practice);
        this.employeesubpractices = this.employeesubpractice.map(
          (x) => x.employee_sub_practice,
        )
        //on select make below dropdown filter object data null and then get new unique data
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employe = []

        this.filterData(fromFilter)
        break
      case 'fromEmployee':
        //this.employees.push(item.employee_id);
        this.employees = this.employe.map((x) => x.employee_id)
        this.filterData(fromFilter)
        break
      default:
        console.log('default')
    }
  }

  onFilterDeSelect(item: any, fromFilter: any) {
    switch (fromFilter) {
      case 'fromProjectOrg':
        //this.projectorgs = this.removeElement(this.projectorgs,item.project_org);
        this.projectorgs = this.projorg.map((x) => x.project_org)

        //on deselect make below dropdown data null and then get new unique data
        this.projectpractices = []
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectpractice = []
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromProjectPractice':
        //this.projectpractices = this.removeElement(this.projectpractices,item.project_practice);
        this.projectpractices = this.projectpractice.map(
          (x) => x.project_practice,
        )

        //on deselect make below dropdown data null and then get new unique data
        this.projectsubpractices = []
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.projectsubpractice = []
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []

        //then filter data from constructed object from filters selected
        this.filterData(fromFilter)
        break
      case 'fromProjectSubPractice':
        //this.projectsubpractices = this.removeElement(this.projectsubpractices,item.project_sub_practice);
        this.projectsubpractices = this.projectsubpractice.map(
          (x) => x.project_sub_practice,
        )

        //on deselect make below dropdown data null and then get new unique data
        this.customers = []
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.custmer = []
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromCustomer':
        //this.customers = this.removeElement(this.customers,item.customer_id);
        this.customers = this.custmer.map((x) => x.customer_id)

        //on deselect make below dropdown data null and then get new unique data
        this.projects = []
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.prject = []
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromProject':
        //this.projects = this.removeElement(this.projects,item.project_id);
        this.projects = this.prject.map((x) => x.project_id)

        //on deselect make below dropdown data null and then get new unique data
        this.employeeorgs = []
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeorg = []
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromEmployeeOrg':
        //this.employeeorgs = this.removeElement(this.employeeorgs,item.employee_org);
        this.employeeorgs = this.employeorg.map((x) => x.employee_org)

        //on deselect make below dropdown data null and then get new unique data
        this.employeeBUs = []
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employebu = []
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromEmployeeBU':
        //this.employeeBUs = this.removeElement(this.employeeBUs,item.employee_bu);
        this.employeeBUs = this.employebu.map((x) => x.employee_bu)

        //on deselect make below dropdown data null and then get new unique data
        this.employeepractices = []
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeepractice = []
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromEmployeePractice':
        //this.employeepractices = this.removeElement(this.employeepractices,item.employee_practice);
        this.employeepractices = this.employeepractice.map(
          (x) => x.employee_practice,
        )

        //on deselect make below dropdown data null and then get new unique data
        this.employeesubpractices = []
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employeesubpractice = []
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromEmployeeSubPractice':
        //this.employeesubpractices = this.removeElement(this.employeesubpractices,item.employee_sub_practice);
        this.employeesubpractices = this.employeesubpractice.map(
          (x) => x.employee_sub_practice,
        )

        //on deselect make below dropdown data null and then get new unique data
        this.employees = []

        // remove all selected filters below the selected dropdown
        this.employe = []
        this.filterData(fromFilter)
        break
      case 'fromEmployee':
        //this.employees = this.removeElement(this.employees,item.employee_id);
        this.employees = this.employe.map((x) => x.employee_id)

        this.filterData(fromFilter)
        break
      default:
        console.log('default')
    }
  }

  removeElement(data, value) {
    //let index = data.indexOf(value);
    //data.splice(index,1);
    data = data.filter((item) => item !== value)
    return data
  }

  filterObject() {
    let obj = {
      year: this.year,
      project_org: this.projectorgs,
      project_sub_practice: this.projectsubpractices,
      project_practice: this.projectpractices,
      customer_id: this.customers,
      project_id: this.projects,
      employee_id: this.employees,
      employee_org: this.employeeorgs,
      employee_bu: this.employeeBUs,
      employee_practice: this.employeepractices,
      employee_sub_practice: this.employeesubpractices,
    }
    return obj
  }

  filterData(fromFilter: any) {
    let filters = this.filterObject()
    // this.panelData=localStorage.getItem('panelData');
    let afterfilter = this.filterArray(this.panelData, filters)
    if (fromFilter === 'fromProjectOrg') {
      if (this.projectorgs.length === 0) {
        this.projectorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_org',
        )
        this.projectprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_practice',
        )
        this.projectsubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.projectprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_practice',
        )
        this.projectsubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromProjectPractice') {
      if (this.projectpractices.length === 0) {
        this.projectprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_practice',
        )
        this.projectsubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.projectsubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromProjectSubPractice') {
      if (this.projectsubpractices.length === 0) {
        this.projectsubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromCustomer') {
      if (this.customers.length === 0) {
        this.customer = this.getUniqueDataAfterFilter(afterfilter, 'customer')
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromProject') {
      if (this.projects.length === 0) {
        this.project = this.getUniqueDataAfterFilter(afterfilter, 'project')
        localStorage.setItem('projectFilterData', JSON.stringify(this.project))
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromEmployeeOrg') {
      if (this.employeeorgs.length === 0) {
        this.employeeorg = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromEmployeeBU') {
      if (this.employeeBUs.length === 0) {
        this.employeebu = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromEmployeePractice') {
      if (this.employeepractices.length === 0) {
        this.employeeprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromEmployeeSubPractice') {
      if (this.employeesubpractices.length === 0) {
        this.employeesubprct = this.getUniqueDataAfterFilter(
          afterfilter,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      }
    } else if (fromFilter === 'fromEmployee') {
      if (this.employees.length === 0) {
        this.employee = this.getUniqueDataAfterFilter(afterfilter, 'employee')
      } else {
      }
    }
  }
  constructReqbody() {
    let yearmonthSelected=[]
    if(this.monthselected&&this.monthselected.length!=null&&this.monthselected.length!=0)
    {yearmonthSelected.push(this.year+this.monthselected);}
    else{
      yearmonthSelected.push();
    }
    let obj = {
      year: this.year,
      yearMonth:yearmonthSelected,
      projectOrg: this.projectorgs,
      projectSubPrac: this.projectsubpractices,
      projectPractice: this.projectpractices,
      customer: this.customers,
      project: this.projects,
      employee: this.employees,
      employeeOrg: this.employeeorgs,
      employeeBu: this.employeeBUs,
      employeePractice: this.employeepractices,
      employeeSubPrac: this.employeesubpractices,
      sowIds:[],
    }
    localStorage.setItem('payload', JSON.stringify(obj))
    return obj
  }

  getDataOFPandL(): void {
    this.pandlsvc.getDataofPandL().subscribe((data: any) => {
      if (!data || !data['P and L']) {
        this.getChartsData()
      }
    })
  }

  getPanelData() {
    let yearmonth
    if(this.selectedmonth)
    {yearmonth=(this.year+this.selectedmonth);}
    else{
      yearmonth=''
    }
    let body = {
      year: this.year,
      yearmonth:[yearmonth]
    }
    $('#loadingEditSubmitModal').modal('show')

    this.pandlsvc.getPanelData(body).subscribe(
      (response) => {
        this.panelData = response.PanelData
        this.projectorg = this.getUniqueDataAfterFilter(
          this.panelData,
          'project_org',
        )

        this.projectprct = this.getUniqueDataAfterFilter(
          this.panelData,
          'project_practice',
        )
        this.projectsubprct = this.getUniqueDataAfterFilter(
          this.panelData,
          'project_sub_practice',
        )
        this.customer = this.getUniqueDataAfterFilter(
          this.panelData,
          'customer',
        )
        this.project = this.getUniqueDataAfterFilter(this.panelData, 'project')
        this.employeeorg = this.getUniqueDataAfterFilter(
          this.panelData,
          'employee_org',
        )
        this.employeebu = this.getUniqueDataAfterFilter(
          this.panelData,
          'employee_bu',
        )
        this.employeeprct = this.getUniqueDataAfterFilter(
          this.panelData,
          'employee_practice',
        )
        this.employeesubprct = this.getUniqueDataAfterFilter(
          this.panelData,
          'employee_sub_practice',
        )
        this.employee = this.getUniqueDataAfterFilter(
          this.panelData,
          'employee',
        )
        // localStorage.setItem('panelData', JSON.stringify(this.panelData));

        $('#loadingEditSubmitModal').modal('hide')
      },
      (err) => {
        $('#loadingEditSubmitModal').modal('hide')
        console.log(err)
      },
    )
    // this.getPreservedFilters();
  }

  getChartsData() {
    if (this.year.length > 0) {
      if (!this.router.url.includes('paymentsummary') && sessionStorage.getItem('valueTrigger')) {
        let incrementValue = parseInt(sessionStorage.getItem('valueTrigger'))
        let stringvalue = (++incrementValue).toString()
        sessionStorage.setItem('valueTrigger', stringvalue)
      }
      if (!this.router.url.includes('pandlproject') && sessionStorage.getItem('valueTriggerProjects')) {
        let incrementValueProjects = parseInt(
          sessionStorage.getItem('valueTriggerProjects'),
        )
        let stringvalueProjects = (++incrementValueProjects).toString()
        sessionStorage.setItem('valueTriggerProjects', stringvalueProjects)
      }
      if (this.router.url.includes('pandlproject') || this.router.url.includes('paymentsummary')) {
        if( sessionStorage.getItem('panelDataTriggered')){
        let incrementValuePanelData= parseInt(
          sessionStorage.getItem('panelDataTriggered'),
        )
        let stringvaluePanelData = (++incrementValuePanelData).toString()
        sessionStorage.setItem('panelDataTriggered', stringvaluePanelData)
        }
      }
      let body = this.constructReqbody()
      if (this.router.url.includes('paymentsummary')) {
        $('#loadingEditSubmitModal').modal('show')
        setTimeout(() => { $('#loadingEditSubmitModal').modal('hide')},2000)
      
        this.pandlsvc.PaymentSummary(body).subscribe(
          (data) => {
            if (data) {
              this.callPaymentData.emit(this.callPayment)
            }
            
          },
          (err) => {
            console.log(err)
            // $('#loadingEditSubmitModal').modal('hide')
          },
        )
      } 
      else if (this.router.url.includes('pandlproject')) {
        // $('#loadingEditSubmitModal').modal('show')
        this.callProjectData.emit(this.callProject)
        $('#loadingEditSubmitModal').modal('show')
        setTimeout(()=>{
          $('#loadingEditSubmitModal').modal('hide')
        },1000)
        this.pandlsvc.getRunPandLDataProjects(body).subscribe(
          (data) => {
            if (data) {
            }
            $('#loadingEditSubmitModal').modal('hide')
          },
          (err) => {
            console.log(err)
            $('#loadingEditSubmitModal').modal('hide')
          },
        )
      } 
      else if (!this.router.url.includes('paymentsummary') && !this.router.url.includes('pandlproject')) {
        $('#loadingEditSubmitModal').modal('show')
        this.pandlsvc.getRunPandLData(body).subscribe(
          (data) => {
            $('#loadingEditSubmitModal').modal('hide')
            if (data) {
              this.callPandLData.emit(this.callPandL)
            }
          },
          (err) => {
            console.log(err)
            $('#loadingEditSubmitModal').modal('hide')
          },
        )
      }

      this.preserveFilters()
    } else {
      this.toastr.error('Please Select A Year ...')
    }
  }

  resetFilters() {
    this.yearselected=[]
    this.year=[]
    this.projectorg=[]
    this.projectprct=[]
    this.projectsubprct=[]
    this.customer=[]
    this.project=[]
    this.employeeorg=[]
this.employeebu=[]
this.employeeprct=[]
this.employeesubprct=[]
this.employee=[]
    this.projorg = []
    this.projectorgs = []
    this.projectpractice = []
    this.projectpractices = []
    this.projectsubpractices = []
    this.projectsubpractice = []
    this.custmer = []
    this.customers = []
    this.prject = []
    this.projects = []
    this.employeorg = []
    this.employeeorgs = []
    this.employebu = []
    this.employeeBUs = []
    this.employeepractice = []
    this.employeepractices = []
    this.employeesubpractice = []
    this.employeesubpractices = []
    this.employe = []
    this.employees = []
    localStorage.removeItem('projectOrgFilterData')
    localStorage.removeItem('projectPracticeFilterData')
    localStorage.removeItem('projectSubPracticeFilterData')
    localStorage.removeItem('customerFilterData')
    localStorage.removeItem('projectFilterData')
    localStorage.removeItem('employeeOrgFilterData')
    localStorage.removeItem('employeeBuFilterData')
    localStorage.removeItem('employeePracticeFilterData')
    localStorage.removeItem('employeeSubFilterData')
    localStorage.removeItem('employeeFilterData')
    localStorage.removeItem('projectOrgFilter')
    localStorage.removeItem('projectPracticeFilter')
    localStorage.removeItem('projectSubPracticeFilter')
    localStorage.removeItem('customerFilter')
    localStorage.removeItem('projectFilter')
    localStorage.removeItem('employeeOrgFilter')
    localStorage.removeItem('employeeBuFilter')
    localStorage.removeItem('employeePracticeFilter')
    localStorage.removeItem('employeeSubFilter')
    localStorage.removeItem('employeeFilter')
    localStorage.removeItem('payload')
    localStorage.removeItem('yearFilter')
    localStorage.removeItem('yearmonth')
  }
  filterArray(array, filters) {
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
    // Declare a new array
    let newArray = []

    // Declare an empty object
    let uniqueObject = {}

    // Loop for the array elements
    for (let i in data) {
      // Extract the title
      let objTitle = data[i][keyword]

      // Use the title as the index
      uniqueObject[objTitle] = data[i]
    }

    // Loop to push unique object into array
    for (let i in uniqueObject) {
      let obj = uniqueObject[i]
      newArray.push(obj)
    }

    // Display the unique objects
    let uniqueArray = newArray.sort(this.GetSortOrder(keyword))
    let filtered = uniqueArray.filter(function (el) {
      return el[keyword] != null
    })
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

  preserveFilters() {
    //preserve filters data on component close and open in another tab
    localStorage.setItem('yearmonth',JSON.stringify(this.monthselected));
    localStorage.setItem('yearFilterData', JSON.stringify(this.yearsdata))
    localStorage.setItem(
      'projectOrgFilterData',
      JSON.stringify(this.projectorg),
    )
    localStorage.setItem(
      'projectPracticeFilterData',
      JSON.stringify(this.projectprct),
    )
    localStorage.setItem(
      'projectSubPracticeFilterData',
      JSON.stringify(this.projectsubprct),
    )
    localStorage.setItem('customerFilterData', JSON.stringify(this.customer))
    localStorage.setItem('projectFilterData', JSON.stringify(this.project))
    localStorage.setItem(
      'employeeOrgFilterData',
      JSON.stringify(this.employeeorg),
    )
    localStorage.setItem(
      'employeeBuFilterData',
      JSON.stringify(this.employeebu),
    )
    localStorage.setItem(
      'employeePracticeFilterData',
      JSON.stringify(this.employeeprct),
    )
    localStorage.setItem(
      'employeeSubFilterData',
      JSON.stringify(this.employeesubprct),
    )
    localStorage.setItem('employeeFilterData', JSON.stringify(this.employee))
    localStorage.setItem('panelData', JSON.stringify(this.panelData))

    //preserve selected filters also
    let selectedyears = []
    for (let i = 0; i < this.yearselected.length; i++) {
      if (this.yearselected[i].year_id) {
        selectedyears.push(this.yearselected[i].year_id)
      } else {
        selectedyears.push(this.yearselected[i])
      }
    }
    localStorage.setItem('yearFilter', JSON.stringify(selectedyears))
    localStorage.setItem('projectOrgFilter', JSON.stringify(this.projorg))
    localStorage.setItem(
      'projectPracticeFilter',
      JSON.stringify(this.projectpractice),
    )
    localStorage.setItem(
      'projectSubPracticeFilter',
      JSON.stringify(this.projectsubpractice),
    )
    localStorage.setItem('customerFilter', JSON.stringify(this.custmer))
    localStorage.setItem('projectFilter', JSON.stringify(this.prject))
    localStorage.setItem('employeeOrgFilter', JSON.stringify(this.employeorg))
    localStorage.setItem('employeeBuFilter', JSON.stringify(this.employebu))
    localStorage.setItem(
      'employeePracticeFilter',
      JSON.stringify(this.employeepractice),
    )
    localStorage.setItem(
      'employeeSubFilter',
      JSON.stringify(this.employeesubpractice),
    )
    localStorage.setItem('employeeFilter', JSON.stringify(this.employe))
  }

  getPreservedFilters() {
    //get prserved filters data from local storage
   
    this.yearsdata = JSON.parse(localStorage.getItem('yearFilterData'))
    this.projectorg = JSON.parse(localStorage.getItem('projectOrgFilterData'))
    this.projectprct = JSON.parse(
      localStorage.getItem('projectPracticeFilterData'),
    )
    this.projectsubprct = JSON.parse(
      localStorage.getItem('projectSubPracticeFilterData'),
    )
    this.customer = JSON.parse(localStorage.getItem('customerFilterData'))
    this.project = JSON.parse(localStorage.getItem('projectFilterData'))
    this.employeeorg = JSON.parse(localStorage.getItem('employeeOrgFilterData'))
    this.employeebu = JSON.parse(localStorage.getItem('employeeBuFilterData'))
    this.employeeprct = JSON.parse(
      localStorage.getItem('employeePracticeFilterData'),
    )
    this.employeesubprct = JSON.parse(
      localStorage.getItem('employeeSubFilterData'),
    )
    this.employee = JSON.parse(localStorage.getItem('employeeFilterData'))
    // this.panelData=  JSON.parse(localStorage.getItem('filterData'));
    this.panelData = JSON.parse(localStorage.getItem('panelData'))
    //get selected filters preserved value from local storage
    let yearselected = JSON.parse(localStorage.getItem('yearFilter'))
    let tmpyearselected = []
    if (yearselected === null || yearselected === undefined) {
      //yearselected = [];
    } else {
      for (let i = 0; i < yearselected.length; i++) {
        let obj = {
          year_id: yearselected[i],
          year: yearselected[i],
        }
        tmpyearselected.push(obj)
      }
    }
    this.yearselected = tmpyearselected
    this.projorg = JSON.parse(localStorage.getItem('projectOrgFilter'))
    this.projectpractice = JSON.parse(
      localStorage.getItem('projectPracticeFilter'),
    )
    this.projectsubpractice = JSON.parse(
      localStorage.getItem('projectSubPracticeFilter'),
    )
    this.custmer = JSON.parse(localStorage.getItem('customerFilter'))
    this.prject = JSON.parse(localStorage.getItem('projectFilter'))
    this.employeorg = JSON.parse(localStorage.getItem('employeeOrgFilter'))
    this.employebu = JSON.parse(localStorage.getItem('employeeBuFilter'))
    this.employeepractice = JSON.parse(
      localStorage.getItem('employeePracticeFilter'),
    )
    this.employeesubpractice = JSON.parse(
      localStorage.getItem('employeeSubFilter'),
    )
    this.employe = JSON.parse(localStorage.getItem('employeeFilter'))
    this.monthselected=JSON.parse(localStorage.getItem('yearmonth'))
  }
  
  ngOnDestroy() {
    // this.preserveFilters();
  }
}

class DropdownFilterDataModel {
  year_id: any
  year: any
}
class DropdownFilterMonthModel {
  month_id: any
  month: any
}

