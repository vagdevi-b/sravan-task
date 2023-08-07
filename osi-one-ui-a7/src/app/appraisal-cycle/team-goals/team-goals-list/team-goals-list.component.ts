import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import {AppConstants} from '../../../shared/app-constants';
import {Router} from '@angular/router';
import {EmployeeService} from '../../../expenses/profile/employees.service';
import {ToastrService} from 'ngx-toastr';
import {AppraisalService} from '../../../shared/services/appraisal-cycle/appraisal.service';

declare var $: any;

@Component({
  selector: 'app-team-goals-list',
  templateUrl: './team-goals-list.component.html',
  styleUrls: ['./team-goals-list.component.css'],
  providers: [EmployeeService]
})
export class TeamGoalsListComponent implements OnInit, OnChanges {
  @Input() teamGoalsList;
  @Input() selfGoalInfo;
  @Input() myTeamLength;
  @Input() projectTeamLength;
  @Input() year;
  @Input() selectedYear;
  @Input() epmsHdrId;
  imageUrl = AppConstants.imageUrl;

  indirectReportersGoalsList: any[];

  readonly EMPLOYEE_SELECT_DROPDOWN_SETTINGS = {
    'singleSelection': true,
    'allowSearchFilter': true,
    'idField': 'employeeId',
    'textField': 'employeeName',
    'closeDropDownOnSelection': true
  };

  selectedReportingEmployeeList: any[];

  employess: any;
  userDetails: any;
  orgId: any;
  employee: any;
  reportesList: any = [];

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private appraisalService: AppraisalService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit() {
    this.userDetails = localStorage.getItem('userDetails');
    this.orgId = localStorage.getItem('orgId');
    this.getEmployees();
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset indirect reporters list only if value is actually changed
    // and it is different from previous epms hdr id for which indirect
    // reporters list has been downloaded
    if (
      changes.epmsHdrId
      && changes.epmsHdrId.currentValue !== undefined
      && this.appraisalService.previousEpmsHdrId !== changes.epmsHdrId.currentValue
    ) {
      this.indirectReportersGoalsList = undefined;
      this.appraisalService.resetIndirectReportersGoalsSummary();
    }
  }

  getIndirectReportersGoalsSummary() {
    if (!this.indirectReportersGoalsList) {
      $('#loadModal').modal('show');
      this.appraisalService.previousEpmsHdrId = this.epmsHdrId;
      this.appraisalService
        .getIndirectReportersGoalsSummary(this.epmsHdrId)
        .then(response => {
            $('#loadModal').modal('hide');
            this.indirectReportersGoalsList = response;
            if (this.indirectReportersGoalsList.length === 0) {
              this.toastrService.info('No indirect reporting employees available.');
            }
          }
        ).catch(error => {
          $('#loadModal').modal('hide');

          this.toastrService.error(
          error.errorMessage
          || 'Error occurred while fetching indirect reporters goals summary.'
        );
      });
    }
  }

  navigateToViewGoalsPage() {

    const selectedEmployeeGoalSummary = this
      .indirectReportersGoalsList
      .find(
        each => each.employeeId === this
          .selectedReportingEmployeeList[0]
          .employeeId
    );

    this.onClickSetGoals(
      selectedEmployeeGoalSummary,
      true
    );
  }

  onClickSetGoals(teamGoal: any, isReadOnly?: boolean): void {

    if (!isReadOnly) {
      isReadOnly = false;
    }

    this.appraisalService.setIsGoalsPageReadOnly(isReadOnly);
    teamGoal['reportingManager'] = teamGoal['supervisorName'];
    teamGoal['epmsHdrId'] = this.selfGoalInfo['epmsHdrId'];
    teamGoal['selectedYear'] = this.selectedYear;
    localStorage.setItem('setGoals', JSON.stringify(teamGoal));
    this.router.navigate(['reviewcycle/goalsetting/']);

  }


  // getUserGoal(employee) {
  //   console.log('employee',employee);
  //   employee['reportingManager']=employee['supervisorName'];
  //   //teamGoal['supervisorId']=this.selfGoalInfo['supervisorId'];
  //   employee['epmsHdrId']=this.selfGoalInfo['epmsHdrId'];
  //   employee['selectedYear']=this.selectedYear;
  //  // localStorage.setItem('setGoals',JSON.stringify(teamGoal));
  //   this.router.navigate(['reviewcycle/goalsetting/']);
  // }

  getEmployees() {
    const {id, name } = this.userDetails;
    
    this.appraisalService.getEmployeeTimeSheets().subscribe(response => {
      this.employess = response;
      
      let reporte = {'id': id, 'name': name, 'orgId': this.orgId};
                this.employee = reporte.name;
                this.reportesList.push(reporte);
                if (response != null && response.length !== 0) {
                  response.forEach(element => {
                    reporte = {'id': element.employeeId, 'name': element.fullName, 'orgId': element.orgId};
                      this.reportesList.push(reporte);
                  });
                  // console.log('reportesList', this.reportesList);
			        	}
    }) 
  }
}
