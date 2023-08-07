import { Component, OnInit } from '@angular/core';
import { PmoAdminService } from '../../../shared/services/pmo-admin.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequestService } from '../../../shared/services/leaveRequest.service';
declare var $: any;

@Component({
  selector: 'app-pmo-timesheet',
  templateUrl: './pmo-timesheet.component.html',
  styleUrls: ['./pmo-timesheet.component.css']
})
export class PmoTimesheetComponent implements OnInit {
  pmoTimesheetForm: FormGroup;
  employeeList: any = [];
  projectsList: any = [];
  employeeDetail: any = { id: 0 };
  empTimesheetList: any = [];
  employeeTimesheet: any = [];
  employeeLength: boolean = false;
  empId: any;
  empOrgId: any;
  projectLength: boolean = false;
  projectId: any;
  searchedPrjText: any;
  searchedText: any;
  empTimesheetListG: any;
  empTimesheetListF: any;
  searchParam: any = { "empId": '', "empName": '', "empOrg": '', "prjId": '', "prjName": '', "status": '', "noOfWeeks": '' };

  constructor(
    private fb: FormBuilder,
    private pmoService: PmoAdminService,
    private _leaveRequestService: LeaveRequestService,
    private router: Router,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.createPMOTimesheetForm();
    // this.getEmployees();
    // this.getProjects();
    let searchParams = this.pmoService.getFilterParamDetails();
    if (searchParams) {
      this.pmoTimesheetForm.get('employeeId').setValue(searchParams.empName);
      this.pmoTimesheetForm.get('projectId').setValue(searchParams.prjName);
      this.empId = searchParams.empId;
      this.empOrgId = searchParams.empOrg;
      this.projectId = searchParams.prjId
      this.pmoTimesheetForm.get('status').setValue(searchParams.status);
      this.pmoTimesheetForm.get('startDate').setValue(searchParams.noOfWeeks);
      this.getEmployessTimeSheetSummary();
    }
  }

  createPMOTimesheetForm() {
    this.pmoTimesheetForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      status: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      startDate: ['4', [Validators.required]]
    });
  }

  onStatusChange(): any {
    this.empTimesheetList = this.employeeTimesheet;
    let status = this.pmoTimesheetForm.get('status').value;
    if (status === 'G' && this.empTimesheetList) {
      this.empTimesheetListG = this.empTimesheetList.filter((item) => {
        return item.status === status;
      });
      this.empTimesheetListF = this.empTimesheetList.filter((item) => {
        return item.status === 'F';
      });
      this.empTimesheetList = this.empTimesheetListG.concat(this.empTimesheetListF);
    }
    else if (status !== 'G' && status !== '' && this.empTimesheetList) {
      this.empTimesheetList = this.empTimesheetList.filter((item) => {
        return item.status === status;
      });
    }
    else {
      this.empTimesheetList = this.employeeTimesheet;
    }
  }

  getEmployessTimeSheetSummary(): any {
    this.onStatusChange();
    let userId = this.empId && this.pmoTimesheetForm.get('employeeId').value ? this.empId : null;
    let orgId = this.empOrgId ? this.empOrgId : null;
    let noOfWeeks = this.pmoTimesheetForm.get('startDate').value;
    let projectId = this.projectId && this.pmoTimesheetForm.get('projectId').value ? this.projectId : null;

    // let userId = this.pmoTimesheetForm.get('employeeId').value ? this.pmoTimesheetForm.get('employeeId').value : null;
    // let projectId = this.pmoTimesheetForm.get('projectId').value ? this.pmoTimesheetForm.get('projectId').value : null;
    // let orgId = null;
    // let selectedEmp = this.employeeList.filter((item) => {
    //   return item.employeeId == userId;
    // });
    // orgId = selectedEmp != 0 && selectedEmp[0].orgId ? selectedEmp[0].orgId : null;

    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getEmployeeTimesheetDetails(userId, orgId, noOfWeeks, projectId).subscribe((response) => {
      response.forEach(function(item) {
          item.hours = parseFloat(item.hours.toFixed(2));
      })
      this.employeeTimesheet = response;
      this.empTimesheetList = response;
      this.empTimesheetList = this.empTimesheetList.sort((a, b) => <any>new Date(b.weekStartDate) - <any>new Date(a.weekStartDate));
      this.onStatusChange();
      $('#loadingEditSubmitModal').modal('hide');
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get employee timesheet details!');
    });
  }

  getEmployeeDetails(event): any {
    this.employeeLength = false;
    let empSearchString = this.pmoTimesheetForm.get('employeeId').value ? this.pmoTimesheetForm.get('employeeId').value : null;
    this.searchedText = empSearchString;
    if ((event.keytab == 13 || event.type == "blur") && empSearchString != "") {
      this.employeeList = [];
      if (empSearchString) {
        $('#loadingEditSubmitModal').modal('show');
        this._leaveRequestService.getMailSuggestion(empSearchString).subscribe(response => {
          this.employeeList = response;
          $('#loadingEditSubmitModal').modal('hide');
          if (this.employeeList.length > 1) {
            this.pmoTimesheetForm.get('employeeId').setValue('');
            $('#employeeList').modal({ show: true });
          }
          else if (this.employeeList.length === 0) {
            this.employeeLength = true;
          }
          else {
            this.empId = this.employeeList[0].employeeId;
            this.empOrgId = this.employeeList[0].orgId;
            this.pmoTimesheetForm.get('employeeId').setValue(this.employeeList[0].fullName);
            this.getEmployessTimeSheetSummary();
          }
        }, (errorResponse) => {
          $('#loadingEditSubmitModal').modal('hide');
          this.toasterService.error('Unable to get employee details!');
        });
      }
    }
  }

  filteredEmployeeSearch(search: any) {
    if (search) {
      $('#loadingEditSubmitModal').modal('show');
      this._leaveRequestService.getMailSuggestion(search).subscribe
        (response => {
          this.employeeList = response;
          $('#loadingEditSubmitModal').modal('hide');
        }, (errorResponse) => {
          $('#loadingEditSubmitModal').modal('hide');
          this.toasterService.error('Unable to get employee details!');
        });
    }
  }

  selectedEmployee(empName: any, empOrgId: any, employeeId: any) {
    this.empOrgId = empOrgId;
    this.empId = employeeId;
    this.pmoTimesheetForm.get('employeeId').setValue(empName);
    $('#employeeList').modal('hide');
    this.getEmployessTimeSheetSummary();
  }


  getProjectDetails(event): any {
    this.projectLength = false;
    let empSearchString = this.pmoTimesheetForm.get('employeeId').value ? this.pmoTimesheetForm.get('employeeId').value : null;
    let projectSearchString = this.pmoTimesheetForm.get('projectId').value ? this.pmoTimesheetForm.get('projectId').value : null;
    let status = this.pmoTimesheetForm.get('status').value;
    this.searchedPrjText = projectSearchString;
    if ((event.keytab === 13 || event.type === 'blur') && projectSearchString !== '') {
      let body = {
        filterProjectName: projectSearchString,
        filterOrgName: "",
        filterCustName: '',
        // filterProjectManager:"",
        filterStartDateStart: "",
        filterStartDateEnd: "",
        filterEndDateStart: "",
        filterEndDateEnd: "",
        filterCreationDateStart: "",
        filterCreationDateEnd: "",
        // filterProjectType:"",
        filterStatus: ''
      };
      this.projectsList = [];
      if (projectSearchString && body.filterProjectName) {
        $('#loadingEditSubmitModal').modal('show');
        this.pmoService.getProjectBySuggestion(body).subscribe
          (response => {
            this.projectsList = response;
            $('#loadingEditSubmitModal').modal('hide');
            if (this.projectsList.length > 1) {
              this.pmoTimesheetForm.get('projectId').setValue('');
              $('#projectList').modal({ show: true });
            }
            else if (this.projectsList.length === 0) {
              this.projectLength = true;
            }
            else {
              this.projectId = this.projectsList[0].projectId;
              this.pmoTimesheetForm.get('projectId').setValue(this.projectsList[0].projectName);
              this.getEmployessTimeSheetSummary();
            }
          }, (errorResponse) => {
            $('#loadingEditSubmitModal').modal('hide');
            this.toasterService.error('Unable to get project details!');
          });
      } else {
        this.getEmployessTimeSheetSummary();
      }
    }
  }

  filteredProjectSearch(search: any) {
    let body = {
      filterProjectName: search,
      filterOrgName: "",
      filterCustName: "",
      // filterProjectManager:"",
      filterStartDateStart: "",
      filterStartDateEnd: "",
      filterEndDateStart: "",
      filterEndDateEnd: "",
      filterCreationDateStart: "",
      filterCreationDateEnd: "",
      // filterProjectType:"",
      filterStatus: ""
    };
    if (search && body.filterProjectName) {
      $('#loadingEditSubmitModal').modal('show');
      this.pmoService.getProjectBySuggestion(body).subscribe
        (response => {
          this.projectsList = response;
          $('#loadingEditSubmitModal').modal('hide');
        }, (errorResponse) => {
          $('#loadingEditSubmitModal').modal('hide');
          this.toasterService.error('Unable to get project details!');
        });
    }
  }

  selectedProject(prjName: any, prjId: any) {
    this.projectId = prjId;
    this.pmoTimesheetForm.get('projectId').setValue(prjName);
    $('#projectList').modal('hide');
    this.getEmployessTimeSheetSummary();
  }

  employeeTs(selectedTimesheet: any) {
    this.searchParam = {
      "empId": selectedTimesheet.employeeId,
      "empName": this.pmoTimesheetForm.get('employeeId').value,
      "empOrg": selectedTimesheet.orgId,
      "prjId": this.projectId ? this.projectId : null,
      "prjName": selectedTimesheet.projectName && this.projectId ? selectedTimesheet.projectName : '',
      "status": this.pmoTimesheetForm.get('status').value,
      "noOfWeeks": this.pmoTimesheetForm.get('startDate').value
    }
    this.pmoService.setSelectedTimesheetDetails(selectedTimesheet);
    this.pmoService.setFilterParamDetails(this.searchParam);
    if (selectedTimesheet.status == "O" || selectedTimesheet.status == "F" || selectedTimesheet.status == "G") {
      this.router.navigate(['/pmotimesheetsubmission']);
    } else {
      this.router.navigate(['/pmotimesheetview']);
    }
  }

  getEmployees(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getEmployees().subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.employeeList = response;
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get employee details!');
    });
  }

  getProjects(): any {
    $('#loadingEditSubmitModal').modal('show');
    this.pmoService.getProjects().subscribe((response) => {
      $('#loadingEditSubmitModal').modal('hide');
      response = response.sort(function sortAll(a, b) {
        return a.projectName > b.projectName ? 1 : a.projectName < b.projectName ? -1 : 0;
      });
      this.projectsList = response;
    }, (errorResponse) => {
      $('#loadingEditSubmitModal').modal('hide');
      this.toasterService.error('Unable to get project details!');
    });
  }

}
