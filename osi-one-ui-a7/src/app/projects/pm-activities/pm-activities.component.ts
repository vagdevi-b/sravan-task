import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { TimesheetService } from "../../shared/services/timesheet.service";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";
import { IProjects } from "../../shared/utilities/projectsData.model";
import { Project } from "../../shared/utilities/project";
import { CalendarData } from "../../shared/utilities/CalendarData";
import { ProjectActivities } from "../../shared/utilities/ProjectActivities";
import { ProjectActivitiesData } from "../../shared/utilities/ProjectActivitiesData";
import { CriticalIssuesComponent } from "../critical-issues/critical-issues.component";
import { ProjectStatusComponent } from "../project-status/project-status.component";
import { ProjectRisk} from "../../shared/utilities/projectRisk";
import { ProjectStatus } from "../../shared/utilities/projectStatus";
import { ProjectService } from "../project.service";
//import _ = require('underscore');
import { pluck } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from 'underscore';
import { JsonParseMode } from "@angular-devkit/core";
import { AppConstants } from "../../shared/app-constants";
import { saveAs } from 'file-saver/FileSaver';
import * as moment from 'moment';


declare var $: any;

@Component({
  selector: "app-pm-activities",
  templateUrl: "./pm-activities.component.html",
  styleUrls: ["./pm-activities.component.css"],
  providers: [DatePipe],
})
export class PmActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild("AlertSuccess") alertSuccess: ElementRef;
  @ViewChild("AlertError") alertError: ElementRef;

  //timeSheetForm: FormGroup;
  errorMessage: String;
  successMessage: String;
  projectRiskArray: ProjectRisk[] = [];
  projectStatusArray: ProjectStatus[] = [];
  projectsList: Project[] = [];
  projectsList1: Project[] = [];
  MngrprojectsList: Project[] = [];
  loggedInUser: any;
  calendarList: CalendarData[] = [];
  calendarListactive: CalendarData[] = [];
  assignedTo: string;
  reassignedTo: string;
  isActivityTabsDis: boolean = false;
  isProjectSubmited: boolean = false;
  isTerminateSave: boolean = false;
  isactive: boolean = false;
  isDisableProjActi: boolean = false;
  copyProjectActivity: any;
  isConformAlert: boolean = false;
  oldMonthId: number;
  oldSelectedYear: any;
  oldSelectedProject: string;
  isDownloadBtnEnable: boolean = false;
  deleteAccList:ProjectActivities[] = [];
  deleteUnAccList:ProjectActivities[] = [];
  deleteThisWeekAccList:ProjectActivities[] = [];
  deleteNextWeekAccList:ProjectActivities[] = [];
  deleteRiskcList:ProjectRisk[] = [];
  deleteStatusAccList:ProjectStatus[] = [];
  reCallService : Boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private projectService: ProjectService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  activetab: String;
  activeCalendarObj: any;
  wsrWeekStartDate: any;
  wsrWeekEndDate: any;
  nextWeekStartDate: any;
  nextWeekEndDate : any;
  oldActiveTab: any;
  selectedProjectId: any;
  selectedCalendarId: string;
  milestones: any;
  spinner: boolean = false;
  isObjectModified: boolean = false;
  routeprojectId: any;
  routeprojectYear: any;
  routeprojectMonth: any;
  routeprojectcalenderId: any;
  routingdate: any;
  isCalConformAlert: boolean = false;
  isprojectexist: boolean = false;
  tempCalId: any;
  tempStartDate: any;
  setValueMonth : Boolean = false;
  routeprojectDate : any;

  isChecked: boolean = false;
  name;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('params', params);
      this.routeprojectId = params.projectId;
     if(params.projectStartDate){
      var year = params.projectStartDate.split("-");
      console.log('params year', year);
      this.routeprojectYear = year[0];
      this.routeprojectMonth = year[1];
      this.routeprojectDate = year[2];
      console.log(' this.routeprojectMonth',  this.routeprojectMonth);
     }
      this.routingdate = params.projectStartDate;
      this.routeprojectcalenderId = params.calenderId;

      if (this.routeprojectId) {
        this.selectedProject.projectId = this.routeprojectId;
      }
      if (this.routeprojectYear) {
        this.selectedYear = this.routeprojectYear;
      }
      if (this.routeprojectMonth) {
        this.selectedMonth = this.routeprojectMonth;
      }
      if (params.projectStartDate) {
        if (this.selectedProject.projectId != null) {
          this.activetab = params.projectStartDate;
          console.log('activetab', this.activetab);
        }
      }
    });

    this.assignedTo = "assignedTo";
    this.reassignedTo = "reassignedTo";
    this.loggedInUser = localStorage.getItem("userId");
    this.spinner = true;
    this.projectService.getProjectsByMngrId().subscribe(
      (res) => {
        this.spinner = false;
        this.projectsList = res;
        this.projectChange(this.selectedProject.projectId);
        console.log(
          "getProjectsByProjMgnrId===" + JSON.stringify(this.projectsList)
        );
      },
      (error) => {
        this.spinner = false;
        this.toastr.error("Something went wrong please try again", "", {
          positionClass: "toast-top-center",
        });
      }
    );

    // this.selectedYear = new Date().getFullYear();
    // this.selectedMonth = new Date().getMonth();
  }

  selectedProject: Project = new Project("0", "", "", "", "");
  // projectsList = [
  //   new Project('0', '','','',''),
  //   new Project('1', 'Project1','2016-02-01','2019-04-01','C'),
  //   new Project('2', 'Project2','2018-05-01','2020-07-01','A'),
  //   new Project('3', 'Project3','2019-07-01','2020-05-01','A'),
  //   new Project('4', 'Project4','2020-01-01','','A'),
  // ];
  // calendarList = [
  //   new CalendarData("1",'2020-01-05','2020-01-11'),
  //   new CalendarData("2",'2020-01-12','2020-01-18'),
  //   new CalendarData("3",'2020-01-19','2020-01-25')
  // ];
  years = [];
  months = [];
  selectedYear: any;

  selectedMonth: any;
  endMonthOfProject: any;

  accomplishedActivities = [
    new ProjectActivities(
      "",
      "",
      "",
      "Accomplished",
      "",
      "",
      [],
      [],
      [],
      [],
      "",
      "",
      "",
      false,
      false,
      ""
    ),
  ];
  unAccomplishedActivities = [
    new ProjectActivities(
      "",
      "",
      "",
      "UnAccomplished",
      "",
      "",
      [],
      [],
      [],
      [],
      "",
      "",
      "",
      false,
      false,
      ""
    ),
  ];
  activitiesForThisWeek = [
    new ProjectActivities(
      "",
      "",
      "",
      "ThisWeek",
      "",
      "",
      [],
      [],
      [],
      [],
      "",
      "",
      "",
      false,
      false,
      ""
    ),
  ];
  activitiesForNextWeek = [
    new ProjectActivities(
      "",
      "",
      "",
      "NextWeek",
      "",
      "",
      [],
      [],
      [],
      [],
      "",
      "",
      "",
      false,
      false,
      ""
    ),
  ];

  projectActivitiesData: ProjectActivitiesData = new ProjectActivitiesData(
    "",
    "",
    "0",
    this.accomplishedActivities,
    this.unAccomplishedActivities,
    this.projectRiskArray,
    this.projectStatusArray,
    this.activitiesForThisWeek,
    this.activitiesForNextWeek
  );
  //projectActivities: ProjectActivitiesData = new ProjectActivitiesData("", "", "0", this.accomplishedActivities, this.unAccomplishedActivities, this.projectRiskArray, this.projectStatusArray, this.activitiesForThisWeek, this.activitiesForNextWeek);

  projectChange(projectId: string) {
    // if (this.isConformAlert) {
    //   if (!this.onConfirmAlert(this.oldSelectedProject, "Project")) {
    //     return this.selectedProject.projectId;
    //   }
    // }
    console.log(projectId);
    this.selectedProjectId = projectId;
    this.oldSelectedProject = projectId;
    this.years = [];
    this.months = [];

    if (this.routeprojectYear != null) {
      this.selectedYear = this.routeprojectYear;
      this.yearChange(this.selectedYear);
    } else {
      this.selectedYear = new Date().getFullYear();
    }

    if (this.routeprojectMonth != null) {
      var month = this.routeprojectMonth.split();
      this.selectedMonth = month[1];
    } else {
      this.selectedMonth = new Date().getMonth();
    }
    if (this.projectsList.length != 0) {
      this.isprojectexist = false;
      this.projectsList.forEach((project) => {
        if (projectId == project.projectId) {
          this.isprojectexist = true;
          this.selectedProject.projectId = project.projectId;
          this.selectedProject.projectName = project.projectName;
          this.selectedProject.projectStartDate = project.projectStartDate;
          this.selectedProject.projectCompletionDate =
            project.projectCompletionDate;
          this.selectedProject.projectStatus = project.projectStatus;
          this.projectActivitiesData.projectId = projectId;
        } else {
        }
      });
      if (!this.isprojectexist) {
        // this.isChecked = true;
        // // window.location.reload();
        // this.getprojectsByUserId();
      }
    } else {
      this.isChecked = true;
      // window.location.reload();
      this.getprojectsByUserId();
    }

    this.calendarList = [];
    this.isActivityTabsDis = false;
    console.log(this.selectedProject);
    let startDate = this.selectedProject.projectStartDate;
    let endDate = this.selectedProject.projectCompletionDate;
    let projectStartYear = new Date(startDate).getFullYear();
    let projectEndYear = new Date(endDate).getFullYear();
    console.log(endDate == "");
    this.years.push("");

    let endYear =
      endDate == ""
        ? new Date().getFullYear()
        : new Date().getFullYear() <= new Date(endDate).getFullYear()
        ? new Date().getFullYear()
        : new Date(endDate).getFullYear();
    for (let i = projectStartYear; i <= endYear; i++) {
      this.years.push(i);
    }
    if (this.selectedYear <= projectEndYear) {
      this.yearChange(this.selectedYear);
    }
    console.log(this.years);
    console.log(startDate + "===" + endDate);
    this.getMilestones();
  }

  getAllProjects(e: any) {
    // if (this.isConformAlert) {
    //   if (!this.onConfirmAlert(this.oldSelectedYear, "AllProjects")) {
    //     e.preventDefault();
    //     return;
    //   }
    // }
    this.isChecked = !this.isChecked;

    this.years = [];
    this.months = [];
    this.projectsList = [];
    this.calendarListactive = [];
    this.isActivityTabsDis = false;
    this.selectedProject = new Project("0", "", "", "", "");
    this.resetAllField();
    if (this.isChecked) {
      this.getprojectsByUserId();
 }else {
      this.getProjectsByProjMgnrId()

    }

  }

  yearChange(yearId: number) {
    // if (this.isConformAlert) {
    //   if (!this.onConfirmAlert(this.oldSelectedYear, "Year")) {
    //     return this.selectedYear;
    //   }
    // }
    let today: any = new Date();
    let firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
    let currentweek: any;
    let pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;

    this.selectedYear = yearId;
    this.oldSelectedYear = yearId
    console.log("selected Year::" + yearId);
    this.calendarList = [];
    this.isActivityTabsDis = false;
    let startDate = this.selectedProject.projectStartDate;
    let endDate = this.selectedProject.projectCompletionDate;
    let projectStartYear = new Date(startDate).getFullYear();
    let projectEndYear = new Date(endDate).getFullYear();
    let startMonth = new Date(startDate).getMonth() + 1;
    let endMonth = new Date(endDate).getMonth() + 1;
    this.endMonthOfProject = new Date(endDate).getMonth() + 1;
    this.months = [];
    

    if (projectStartYear == yearId && projectStartYear < projectEndYear) {
      // this.months.push(startMonth);
      for (let i = startMonth; i <= 12; i++) {
        this.months.push(i);
      }

    } else if (projectEndYear == yearId && startMonth > 1 && projectStartYear == projectEndYear) {

      for (let i = startMonth; i <= endMonth; i++) {
        this.months.push(i);
      }
    } else if (projectEndYear == yearId) {
      for (let i = 1; i <= endMonth; i++) {
        this.months.push(i);
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        this.months.push(i);
      }
    }

    currentweek = (Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)) / 4;
    this.setValueMonth = false;
    if (this.routeprojectMonth != null && this.selectedYear != null) {
      const month = this.routeprojectMonth.split('');
      if(month[0] == 1){
        this.selectedMonth = this.routeprojectMonth;
      }else{
        this.selectedMonth = month[1];
        // this.monthChange(this.selectedMonth);
      }
    } else if (this.routeprojectMonth === null) {
        this.months.forEach(element => {
          if (currentweek === element) {
            this.selectedMonth = currentweek;
            this.setValueMonth = true;
          } else if (!this.setValueMonth) {
            this.selectedMonth = element;
          }
      });
    } else {
      this.selectedMonth = new Date().getMonth() + 1;
    }

    if (this.selectedMonth <= endMonth) {
      this.monthChange(this.selectedMonth);
      this.routeprojectMonth = null;
    } else {
      this.selectedMonth = "";
    }
    console.log(this.months);
    console.log("selectedMonth in year month::" + this.selectedMonth);
    return this.selectedYear;
  }
  monthChange(monthId: any) {
    // if (this.isConformAlert) {
    //   if (!this.onConfirmAlert(this.oldMonthId, "Month")) {
    //     return this.selectedMonth;
    //   }
    // }
    this.spinner = true;
    this.oldMonthId = monthId;
    console.log("selected month::" + monthId);
    let today: any = new Date();
    let firstDayOfYear: any = new Date(today.getFullYear(), 0, 1);
    let currentweek: any;
    let pastDaysOfYear: any = (today - firstDayOfYear) / 86400000;
    currentweek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    let currentweektab: any;
    this.projectService
      .getCalendarByYearAndMonth(this.selectedYear, monthId)
      .subscribe((res) => {
        this.spinner = false;
        if (res) {
          this.calendarList = res;
          this.calendarListactive = [];
          for (var i = 0; i < this.calendarList.length; i++) {
            let activetabtoday: any = new Date(
              this.calendarList[i].weekStartDate
            );
            let firstDayOfYear: any = new Date(
              activetabtoday.getFullYear(),
              0,
              1
            );
            let pastDaysOfYear: any =
              (activetabtoday - firstDayOfYear) / 86400000;
            currentweektab = Math.ceil(
              (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
            );
            if (currentweek < currentweektab) {
              this.isactive = false;
            } else {
              this.isactive = true;
            }
            this.calendarListactive.push({
              calendarId: this.calendarList[i].calendarId,
              periodName: this.calendarList[i].periodName,
              weekEndDate: this.calendarList[i].weekEndDate,
              weekStartDate: this.calendarList[i].weekStartDate,
              isactive: this.isactive,
            });
          }

          this.isActivityTabsDis = true;

         

         
          /*if (currentweek < currentweektab) {
            let weekstartday = new Date();

            let diff =
              weekstartday.getDate() -
              weekstartday.getDay() +
              (weekstartday.getDay() === 0 ? -6 : 1);
            let day = new Date(weekstartday.setDate(diff));
            this.activetab = day.toISOString().slice(0, 10);
          } else*/ if (this.routingdate != null) {
            this.activetab = this.routingdate;
           
            
          } else {
            this.activetab = this.calendarListactive[0].weekStartDate;
           
           
          }

          this.calendarListactive.map(calObj => {
            if (calObj && calObj.weekStartDate == this.activetab) {

              this.selectedCalendarId = calObj.calendarId;
              return true;
            }

          })
          if (!this.selectedCalendarId) {

            this.selectedCalendarId = this.calendarListactive[0].calendarId;
            if (!this.activetab) {
              this.activetab = this.calendarListactive[0].weekStartDate;
            
            } else {
              this.activetab = this.routingdate;
           
            }
          }


          this.projectActivitiesData.calendarId = this.selectedCalendarId;

          this.getProjectActivityData(this.selectedProjectId, this.selectedCalendarId

          );
          this.activeCalendarObj = this.calendarListactive.filter(each => each.calendarId === this.selectedCalendarId);
          this.wsrWeekStartDate= this.activeCalendarObj[0].weekStartDate ?
          moment(this.activeCalendarObj[0].weekStartDate).format('Do MMM') : '';
          this.wsrWeekEndDate= this.activeCalendarObj[0].weekEndDate?
          moment(this.activeCalendarObj[0].weekEndDate).format('Do MMM') : '';
          this.nextWeekStartDate = moment(this.activeCalendarObj[0].weekStartDate).add(7, 'days').format('Do MMM');
          this.nextWeekEndDate = moment(this.activeCalendarObj[0].weekEndDate).add(7, 'days').format('Do MMM');
         
        }

        if (this.reCallService) {
          this.checkWeekEndDate();
        }

        this.oldActiveTab = this.activetab;
        // console.log(JSON.stringify(res))
       // 
      });
      
    return this.selectedMonth;
  }


  checkWeekEndDate() {
    const weekendDate = this.calendarListactive[3].weekEndDate;
    const date = weekendDate.split('-');
    const resDate = date[2];
    if (resDate < this.routeprojectDate) {
     const selectedmonth =  Number(this.selectedMonth);
      this.selectedMonth = selectedmonth + 1 ;
      this.monthChange(this.selectedMonth);
      this.reCallService = false;
    } else {
      return false;
    }
  }

  setActiveTab(startDate: string, id: string,e) {
    this.isCalConformAlert = false;
    this.tempCalId = id;
    this.tempStartDate = startDate;
    if(this.isConformAlert){
      this.isCalConformAlert= true;
       $("#pm-reset").modal({ show: true });
      e.preventDefault;
      return;
    }else{
      this.setCalendarId(startDate,id);
    }
    
    
  }
  setCalendarId(startDate,id){
    console.log(startDate + "===" + id);
    this.activetab = startDate;
    this.projectActivitiesData.calendarId = id;
    this.selectedCalendarId = id;
    this.getProjectActivityData(this.selectedProjectId, id);
    this.activeCalendarObj = this.calendarListactive.filter(each => each.calendarId === id);
    this.wsrWeekStartDate= this.activeCalendarObj[0].weekStartDate ?
          moment(this.activeCalendarObj[0].weekStartDate).format('Do MMM') : '';
    this.wsrWeekEndDate= this.activeCalendarObj[0].weekEndDate?
          moment(this.activeCalendarObj[0].weekEndDate).format('Do MMM') : '';
    this.nextWeekStartDate = moment(this.activeCalendarObj[0].weekStartDate).add(7, 'days').format('Do MMM');
    this.nextWeekEndDate = moment(this.activeCalendarObj[0].weekEndDate).add(7, 'days').format('Do MMM');
     
  }
  updateAccomplishedActivities(activitesList) {
    if (this.copyProjectActivity && this.copyProjectActivity.AccomplishedActivities && !this.isConformAlert) {
      this.findObjectHasModified(this.copyProjectActivity.AccomplishedActivities, activitesList);
    }
    console.log("AccomplishedActivities data response--->");
    console.log(activitesList);
    this.accomplishedActivities = activitesList;
  }
  deleteUnAccomplishedActivities(activitesList){
    this.deleteUnAccList.push(activitesList);
  }
  deleteAccomplishedActivities(activity){
    this.deleteAccList.push(activity);
  }
  deleteRiskAccomplishedActivities(activity){
    this.deleteRiskcList.push(activity);
  }
  deleteStatusAccomplishedActivities(activity){
    this.deleteStatusAccList.push(activity);
  }
  deleteThisWeekAccomplishedActivities(activity){
    this.deleteThisWeekAccList.push(activity);
  }
  deleteNextWeekAccomplishedActivities(activity){
    this.deleteNextWeekAccList.push(activity);
  }

  updateUnAccomplishedActivities(activitesList) {
    console.log("UnAccomplishedActivities data response--->");
    console.log(activitesList);
    this.unAccomplishedActivities = activitesList;
    if (this.copyProjectActivity && this.copyProjectActivity.UnAccomplishedActivities && !this.isConformAlert) {
      this.findObjectHasModified(this.copyProjectActivity.UnAccomplishedActivities, activitesList);
    }
  }
  updateProjectStatusActivities(activitesList) {
    console.log("updateProjectStatusActivities data response--->");
    this.unAccomplishedActivities = activitesList;
    if (this.copyProjectActivity && this.copyProjectActivity.ProjectStatus && !this.isConformAlert) {
      this.findProjectStatusObjModified(this.copyProjectActivity.ProjectStatus, activitesList);
    }
  }
  updateCriticalActivities(criticalList) {
    console.log("updateCriticalActivities data response--->");
    if (this.copyProjectActivity && this.copyProjectActivity.Risks && !this.isConformAlert) {
      this.findRiskObjModified(this.copyProjectActivity.Risks, criticalList);
    }
  }
  updateNextWeekActivities(nextWeekActivitesList) {
    console.log("updateNextWeekActivities data response--->");
    console.log(nextWeekActivitesList);
    this.activitiesForNextWeek = nextWeekActivitesList;
    if (this.copyProjectActivity && this.copyProjectActivity.NextWeekActivities && !this.isConformAlert) {
      this.findObjectHasModified(this.copyProjectActivity.NextWeekActivities, nextWeekActivitesList);
    }
  }
  updateThisWeekActivities(thisWeekActivitesList) {
    console.log("updateThisWeekActivities data response--->");
    console.log(thisWeekActivitesList);
    this.activitiesForThisWeek = thisWeekActivitesList;
    if (this.copyProjectActivity && this.copyProjectActivity.ThisWeekActivities && !this.isConformAlert) {
      this.findObjectHasModified(this.copyProjectActivity.ThisWeekActivities, thisWeekActivitesList);
    }
  }
  getprojectsByUserId() {
    this.spinner = true;
    this.projectService.getProjectsByUserId().subscribe(
      (res) => {
        this.spinner = false;
        this.projectsList = res;
        this.projectChange(this.selectedProject.projectId);
        console.log(JSON.stringify(this.projectsList));
      },
      (error) => {
        this.spinner = false;
        this.toastr.error("Something went wrong please try again", "", {
        });
      }
    );
  }
  getProjectsByProjMgnrId() {
    this.spinner = true;
    this.projectService.getProjectsByMngrId().subscribe(
      (res) => {
        this.spinner = false;
        this.projectsList = res;

      },
      (error) => {
        this.spinner = false;
        this.toastr.error("Something went wrong please try again", "", {
        });
      }
    );
  }

  submitProjectData(updateValue, action) {
    this.saveProjectActivityData(updateValue, action);
    //this.resetAllField();
  }



  resetAllField() {
    this.accomplishedActivities = [
      new ProjectActivities(
        "",
        "",
        "",
        "Accomplished",
        "",
        "",
        [],
        [],
        [],
        [],
        "",
        "",
        "",
        false,
        false,
        ""
      ),
    ];
    this.unAccomplishedActivities = [
      new ProjectActivities(
        "",
        "",
        "",
        "UnAccomplished",
        "",
        "",
        [],
        [],
        [],
        [],
        "",
        "",
        "",
        false,
        false,
        ""
      ),
    ];
    this.activitiesForThisWeek = [
      new ProjectActivities(
        "",
        "",
        "",
        "ThisWeek",
        "",
        "",
        [],
        [],
        [],
        [],
        "",
        "",
        "",
        false,
        false,
        ""
      ),
    ];
    this.activitiesForNextWeek = [
      new ProjectActivities(
        "",
        "",
        "",
        "NextWeek",
        "",
        "",
        [],
        [],
        [],
        [],
        "",
        "",
        "",
        false,
        false,
        ""
      ),
    ];
    this.projectStatusArray = [];
    this.projectStatusArray.push(new ProjectStatus());
    this.projectRiskArray = [];
    this.projectActivitiesData = new ProjectActivitiesData(
      "",
      "",
      "0",
      this.accomplishedActivities,
      this.unAccomplishedActivities,
      this.projectRiskArray,
      this.projectStatusArray,
      this.activitiesForThisWeek,
      this.activitiesForNextWeek
    );
    this.clearAllDeletedAccList();
  }

  saveProjectActivityData(updateValue, action) {

    this.isTerminateSave = false
    this.isConformAlert = false;
    if (this.accomplishEmptyCheck(this.projectActivitiesData.AccomplishedActivities)) {
      return
    }
    if (this.activitiesValidation(this.projectActivitiesData.AccomplishedActivities, "Accomplished")) {
      return

    }
    if (
      this.activitiesValidation(
        this.projectActivitiesData.UnAccomplishedActivities,
        "Unaccomplished"
      )
    ) {
      return;
    }

    if(this.projectStatusReasionEmpCheck(this.projectActivitiesData.ProjectStatus)){
      return
    }
    if (this.activitiesValidation(this.projectActivitiesData.ThisWeekActivities, "This week activity")) {
      return

    }
    if (
      this.activitiesValidation(
        this.projectActivitiesData.NextWeekActivities,
        "Next week activity"
      )
    ) {
      return;
    }
    this.mapDeletedActivites();
    this.spinner = true;
    window.scrollTo(0, 0);
    for (let object in this.projectActivitiesData) {

      if (object === "AccomplishedActivities" || object === "UnAccomplishedActivities" || object === "ThisWeekActivities" || object === "NextWeekActivities" || object === "Risks" || object === "ProjectStatus") {

        let value = this.projectActivitiesData[object];
        this.convertArrayToCommaSeparetedString(value, updateValue);
      }
    }
    this.convertDateToString();
    console.log(
      "*****inside shared service = ********" +
        JSON.stringify(this.projectActivitiesData)
    );
    this.projectService
      .saveProjectActivity(this.projectActivitiesData)
      .subscribe(
        (res) => {
          this.spinner = false;
          this.resetAllField();
          this.toastr.success(`project activities ${action} successfully`, "", {
          });
          this.projectActivitiesData = res;
          this.mapProjectObject(this.projectActivitiesData);

          if (action == 'Submitted') {

            //setTimeout(function(){ window.location.reload(); }, 1000);
            window.location.reload();
          }
        },
        (error) => {
          this.spinner = false;
          this.toastr.error("Something went wrong please try again", "", {
          });
        }
      );
  }
  activitiesValidation(
    accomplishedActivities: ProjectActivities[],
    type: string
  ): boolean {
    if (accomplishedActivities) {
      accomplishedActivities.map((accomplish) => {
        if (accomplish) {
          if (accomplish.activityName && accomplish.assignedTo == "") {
            this.toastr.error(`${accomplish.activityName} related assignedTo value should not be empty `, type, {
            });

            this.isTerminateSave = true;
            return;
          }
        
          if (
            accomplish.assignedTo.length > 0 &&
            accomplish.activityName == ""
          ) {
            if (accomplish.assignedToEmployees.length > 0) {
              var name = accomplish.assignedToEmployees[0].name;
            }
            this.toastr.error(`${name} activity name should not be empty `, type, {
            });

            this.isTerminateSave = true;
            return;
          }
          if (type === "Unaccomplished") {
            if (accomplish.activityName && accomplish.reason == "") {
              this.toastr.error(`${accomplish.activityName} activity reason should not be empty `, type, {
              });
              this.isTerminateSave = true;
              return;
            }
          }
        }
      });
    }
    return this.isTerminateSave;
  }
  accomplishEmptyCheck(accomplishedActivities: ProjectActivities[]): boolean {
    this.isTerminateSave = true;
    accomplishedActivities.map(accomplish => {
      if (accomplish.activityName || accomplish.assignedToEmployees.length > 0) {
        this.isTerminateSave = false
        return;
      }
    })
    if (this.isTerminateSave) {
      this.toastr.error("Please fill at least one Accomplished activity", "", {
      });
    }
    return this.isTerminateSave;
  }
  projectStatusReasionEmpCheck(projectStatusList: ProjectStatus[]) {
    if(projectStatusList){
      projectStatusList.map(project=>{
        if(project.milestonename || project.actualStartDate || project.actualEndDate){
          if(!project.reason){
            this.isTerminateSave = true;
            this.toastr.error("Reason should not be empty in project status tab ", "", {
            });
            return;
          }
          if(project.completed > 0 && project.completed > 100){
              this.isTerminateSave = true;
              this.toastr.error(`${project.milestonename} completed value should not greater than 100 `, "Project Status", {
              });
              return;
          }else{
            if(!project.completed){
              project.completed = 0;
            }
          }
        }
      })
    }
    return this.isTerminateSave
  }
  mapDeletedActivites(){
    if(this.deleteUnAccList.length > 0){
      this.projectActivitiesData.UnAccomplishedActivities = [ ...this.projectActivitiesData.UnAccomplishedActivities, ...this.deleteUnAccList];
    }
    if(this.deleteAccList.length > 0){
      this.projectActivitiesData.AccomplishedActivities = [ ...this.projectActivitiesData.AccomplishedActivities, ...this.deleteAccList];
    }
    if(this.deleteRiskcList.length > 0){
      this.projectActivitiesData.Risks = [ ...this.projectActivitiesData.Risks, ...this.deleteRiskcList];
    }
    if(this.deleteNextWeekAccList.length > 0){
      this.projectActivitiesData.NextWeekActivities = [ ...this.projectActivitiesData.NextWeekActivities, ...this.deleteNextWeekAccList];
    }
    if(this.deleteThisWeekAccList.length > 0){
      this.projectActivitiesData.ThisWeekActivities = [ ...this.projectActivitiesData.ThisWeekActivities, ...this.deleteThisWeekAccList];
    }
    if(this.deleteStatusAccList.length > 0){
      this.projectActivitiesData.ProjectStatus = [ ...this.projectActivitiesData.ProjectStatus, ...this.deleteStatusAccList];
    }
  }
  clearAllDeletedAccList(){
    this.deleteUnAccList = [];
    this.deleteAccList = [];
    this.deleteNextWeekAccList = [];
    this.deleteRiskcList = [];
    this.deleteStatusAccList = [];
    this.deleteThisWeekAccList = [];
  }

  getMilestones() {
    this.projectService.getMilestones(this.selectedProjectId).subscribe(
      (res) => {
        this.milestones = res;
        console.log(JSON.stringify(this.milestones));
      },
      (error) => {
        this.spinner = false;
        this.toastr.error("Something went wrong please try again", "", {
        });
      }
    );
  }

  getProjectActivityData(projectId, calendarId) {
    this.spinner = true;
    this.isConformAlert = false;
    this.isDownloadBtnEnable = false;
    this.resetAllField();
    this.isProjectSubmited = false;
    this.isDisableProjActi = false;
    this.projectService.getProjActivity(projectId, calendarId).subscribe(
      (res) => {
        this.spinner = false;
        if (res) {
          if (!(res.projectId == "0")) {
            this.projectActivitiesData = res;

            if (this.projectActivitiesData.AccomplishedActivities.length > 0) {
           
              if (this.projectActivitiesData.AccomplishedActivities[0].status == 'S') {
                 this.isDisableProjActi = true;
              }
              if (this.projectActivitiesData.AccomplishedActivities[0].status == 'S' || this.projectActivitiesData.AccomplishedActivities[0].status == 'N') {
                this.isDownloadBtnEnable = true;

             }
            }
            this.mapProjectObject(this.projectActivitiesData);
          } else {
            //clear data
            this.resetAllField();
            // this.projectActivitiesData = this.projectActivities;
            this.projectActivitiesData.projectId = this.selectedProjectId;
            this.projectActivitiesData.calendarId = this.selectedCalendarId;
            //this.mapProjectObject(this.projectActivitiesData);
          }

          this.copyProjectActivity = JSON.parse(JSON.stringify(this.projectActivitiesData));
        }

        // else{
        //    mark all fields empty here
        // }
      },
      (error) => {
        this.spinner = false;
        this.toastr.error("Something went wrong please try again", "", {
        });
      }
    );
   
  }
  convertDateToString() {
    this.projectActivitiesData.ProjectStatus.map((status) => {
      if (status) {
        if (!isNaN(status.actualStartDate)) {
          status.actualStartDate = this.datepipe.transform(
            status.actualStartDate,
            "yyyy-MM-dd"
          );
        } else {
          status.actualStartDate = "";
        }
        if (!isNaN(status.actualEndDate)) {
          status.actualEndDate = this.datepipe.transform(
            status.actualEndDate,
            "yyyy-MM-dd"
          );
        } else {
          status.actualEndDate = "";
        }
        if (!isNaN(status.startDate)) {
          status.startDate = this.datepipe.transform(
            status.startDate,
            "yyyy-MM-dd"
          );
        } else {
          status.startDate = "";
        }
        if (!isNaN(status.endDate)) {
          status.endDate = this.datepipe.transform(
            status.endDate,
            "yyyy-MM-dd"
          );
        } else {
          status.endDate = "";
        }
      }
    });
  }

  convertArrayToCommaSeparetedString(activities, saveOrSubmitValue) {
    if (activities) {
      activities.forEach((contact) => {
        contact.status = saveOrSubmitValue;
        let assignedto = contact[this.assignedTo];
        if (assignedto) {
          contact[this.assignedTo] = assignedto.toString();
        }
        let reassignedto = contact[this.reassignedTo];
        if (reassignedto) {
          contact[this.reassignedTo] = reassignedto.toString();
        }
      });
    }
  }

  mapProjectObject(projectData: ProjectActivitiesData) {
    if (projectData.AccomplishedActivities.length == 0) {
      projectData.AccomplishedActivities = this.accomplishedActivities;
    }
    if (projectData.UnAccomplishedActivities.length == 0) {
      projectData.UnAccomplishedActivities = this.unAccomplishedActivities;
    }
    if (projectData.Risks.length == 0) {
      projectData.Risks = this.projectRiskArray;
    }
    if (projectData.ProjectStatus.length == 0) {
      projectData.ProjectStatus = this.projectStatusArray;
    }
    if (projectData.ThisWeekActivities.length == 0) {
      projectData.ThisWeekActivities = this.activitiesForThisWeek;
    }
    if (projectData.NextWeekActivities.length == 0) {
      projectData.NextWeekActivities = this.activitiesForNextWeek;
    }
    this.accomplishedActivities = projectData.AccomplishedActivities;
    this.unAccomplishedActivities = projectData.UnAccomplishedActivities;
    this.projectRiskArray = projectData.Risks;
    this.projectStatusArray = projectData.ProjectStatus;
    this.activitiesForThisWeek = projectData.ThisWeekActivities;
    this.activitiesForNextWeek = projectData.NextWeekActivities;

    for (let object in projectData) {
      if (object === "Risks") {
        this.riskObjectMapping(projectData[object]);
      }
      var active = object.endsWith("Activities");
      if (active) {
        let activeObj = projectData[object];
        if (activeObj) {
          activeObj.forEach((active) => {
            if (active) {
              active.isInternal = active.internal;
              active.isDeleted = active.deleted;
            }
            // if (active.status === "S") {
            //   this.isProjectSubmited = true;
            // }
            if (active.assignedTo) {
              active.assignedToEmployees = active.assignedTo;
              active.assignedTo = [];
              active.assignedToEmployees.map((assigned) => {
                if (assigned && assigned.id) {
                  active.assignedTo.push(assigned.id);
                }
              });
            }
            if (active.reassignedTo) {
              active.reassignedToEmployees = active.reassignedTo;
              active.reassignedTo = [];
              active.reassignedToEmployees.map((reAssigned) => {
                if (reAssigned && reAssigned.id) {
                  active.reassignedTo.push(reAssigned.id);
                }
              });
            }
            // let assignedToIds = active.assignedTo.pluck('id');
            // active.assignedTo = assignedToIds;
            // let reAssignedToIds = active.reassignedTo.pluck('id');
            // active.reassignedTo = reAssignedToIds;
          });
        }
      }
    }
  }
  riskObjectMapping(riskArray) {
    if (riskArray.length > 0) {
      riskArray.map((risk) => {
        if (risk) {
            risk.isInternal = risk.internal;
            risk.isDeleted = risk.deleted;
          if (risk.owner) {
            risk.ownerId = risk.owner.id;
            risk.ownerName = risk.owner.name;
          }
          if (risk.types) {
            risk.typeId = risk.types.id;
            risk.typeName = risk.types.name;
          }
        }
      });
    }
  }
  

  findRiskObjModified(riskArray: ProjectRisk[], activityRisk: ProjectRisk[]) {
    if (activityRisk.length > 0) {
      if (riskArray.length == activityRisk.length) {
        riskArray.forEach((value, index) => {
          if (!_.isEqual(JSON.stringify(activityRisk[index]), JSON.stringify(value))) {
            this.isConformAlert = true;
          }
        });
      } else if (activityRisk.length > 0) {
        for (let i = riskArray.length; i < activityRisk.length; i++) {
          if (activityRisk[i].risk || activityRisk[i].typeId || activityRisk[i].ownerId || activityRisk[i].mitigationPlan || activityRisk[i].contingencyPlan || activityRisk[i].executiveAttention) {
            this.isConformAlert = true;
          }
        }
      }
    }
  }

  findProjectStatusObjModified(projectStatusArray: ProjectStatus[], activitesList: ProjectStatus[]) {
    if (projectStatusArray.length > 0) {
      if (projectStatusArray.length == activitesList.length) {
        projectStatusArray.forEach((value, index) => {
          if (!_.isEqual(JSON.stringify(activitesList[index]), JSON.stringify(value))) {
            this.isConformAlert = true;
          }
        });
      } else if (activitesList.length > 0) {
        for (let i = projectStatusArray.length; i < activitesList.length; i++) {
          if (activitesList[i].milestonename || activitesList[i].startDate || activitesList[i].endDate || activitesList[i].actualEndDate || activitesList[i].actualStartDate || activitesList[i].reason) {
            this.isConformAlert = true;
          }
        }
      }
    }
  }
  findObjectHasModified(accomplishedArray, activitesList) {
    if (accomplishedArray) {
      if (accomplishedArray.length == activitesList.length) {
        accomplishedArray.forEach((value, index) => {
          if (!_.isEqual(JSON.stringify(activitesList[index]), JSON.stringify(value))) {
            this.isConformAlert = true;
          }
        });
      } else if (activitesList.length > 0) {
        for (let i = accomplishedArray.length; i < activitesList.length; i++) {
          if (activitesList[i].activityName || activitesList[i].assignedTo.length > 0 || activitesList[i].reassignedTo.length > 0 || activitesList[i].activityDependency || activitesList[i].resion) {
            this.isConformAlert = true;
          }
        }
      }
    }
  }
  onConfirmAlert(id, type): boolean {
    const response = window.confirm("Are you sure you want to leave your changes?");
    console.log(this.selectedMonth)
    if (response) {
      this.isConformAlert = false;
    }
    else {
      if (type == 'Month') {
        this.selectedMonth = id;
      }
      if (type == 'Year') {
        this.selectedYear = id;
      }
      if (type == 'Project') {
        this.selectedProject.projectId = id;
      }
      if (type == 'Week') {
        this.activetab = id;
      }
    }
    return response;
  }

  reset(){
    $("#pm-reset").modal({ show: true });
  }
  accept(){
    if(this.isCalConformAlert){
      this.setCalendarId(this.tempStartDate,this.tempCalId)
    }else{
      window.scrollTo(0, 0);
     // this.projectActivitiesData = this.copyProjectActivity;
      //this.mapProjectObject(this.projectActivitiesData);
      this.getProjectActivityData(this.selectedProjectId, this.selectedCalendarId);
      this.toastr.success(`project activities reset successfully`, "", {
      });
    }
    
    //this.getProjectActivityData(this.selectedProjectId, this.selectedCalendarId);
    $('#pm-reset').modal('hide');
    $(".modal-backdrop").hide();
    
  }
  downloadWord(){
    if(this.projectActivitiesData  && this.projectActivitiesData.projectId && this.projectActivitiesData.calendarId){
      var pdfUrl = AppConstants.wsrPDF+this.projectActivitiesData.projectId+"/"+this.projectActivitiesData.calendarId+"_weekly_pm_activity.docx";
      window.open(pdfUrl, '_blank');
    }
  }

  downloadPdf(){
   if(this.projectActivitiesData  && this.projectActivitiesData.projectId && this.projectActivitiesData.calendarId){

    var pdfUrl = AppConstants.wsrPDF+this.projectActivitiesData.projectId+"/"+this.projectActivitiesData.calendarId+"_weekly_pm_activity.pdf";
    window.open(pdfUrl, '_blank');

    //var pdfUrl = AppConstants.pmActivityDownloadURL+this.projectActivitiesData.projectId+"/"+this.projectActivitiesData.calendarId+"_weekly_pm_activity.pdf";
    this.spinner = true;
    this.projectService.downloadPMActivityPDF(this.projectActivitiesData.projectId,this.projectActivitiesData.calendarId)
    .subscribe(res=>{
      this.spinner = false;
      var byteCharacters = atob(res.fileContent);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: 'application/pdf' });
      //var blob = new Blob([new Uint8Array(res.fileData)], { type: 'application/pdf' });
      saveAs(blob, "pm-activity.pdf")
    },
    (error) => {
      this.spinner = false;
      this.toastr.error("Something went wrong please try again", "", {
      });
    })

   }
 }
  /*createFormGroup() {
    this.timeSheetForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      fromProjectId: ['', Validators.required],
      fromProjectName: ['', Validators.required],
      fromTaskId: ['', Validators.required],
      tsFromDate: ['', Validators.required],
      tsToDate: ['', Validators.required],
      toProjectId: ['', Validators.required],
      toProjectName: ['', Validators.required],
      toTaskId: ['', Validators.required],
      toBillType: ['', Validators.required],
      fromBillType: ['', Validators.required],
    }, {
        validator: Validators.compose([
          this.dateLessThan('tsFromDate', 'tsToDate', { 'tsFromDate': true }),
        ])
      });
  }

  dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1 = c.get(dateField1).value;
      const date2 = c.get(dateField2).value;
      if ((date1 !== null && date2 !== null) && new Date(date1.year, date1.month - 1, date1.day) > new Date(date2.year, date2.month - 1, date2.day)) {
        return validatorField;
      }
      return null;
    };
  }*/

  ngOnDestroy() {
    //this.fromProjectSubscription.unsubscribe();
    //this.toProjectSubscription.unsubscribe();
  }
}
