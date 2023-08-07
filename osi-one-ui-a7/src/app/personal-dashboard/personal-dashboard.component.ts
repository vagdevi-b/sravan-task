import { Component, OnInit, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PersonalDashboardService } from '../shared/services/personal-dashboard.service';
import { GridService } from '../dashboard-grid/grid.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { WidgetListComponent } from '../dashboard-grid/widget-list/widget-list.component';

@Component({
  selector: 'app-personal-dashboard',
  templateUrl: './personal-dashboard.component.html',
  styleUrls: ['./personal-dashboard.component.css']
})
export class PersonalDashboardComponent implements OnInit {
  timesheetToApproveBy: string = 'resource';
  sysDate: any;
  dashboardWidgetList: any = [];
  showLoader: boolean = false;

  constructor(private personalDashboardService: PersonalDashboardService, private datePipe: DatePipe,
    private gridService: GridService, private modalService: NgbModal, private injector: Injector) { }

  ngOnInit() {
    console.log('user Details ----', localStorage.getItem('userDetails'));
    this.getWidgetList();
  }

  getWidgetList() {
    this.showLoader = true;
    this.gridService.getEmpWidgets().subscribe(resp => {
      this.showLoader = false;
      this.dashboardWidgetList = resp.filter(item => item.widget.dashboardType === 'Home' && item.isVisible);
      // calling api's to Load Widget inner details
      this.loadWidgetData();
    }, () => {
      this.showLoader = false;
    });
  }

  getStatusDescription(status, statusCodes) {
    const currentDesc = statusCodes.find(item => item.statusCode === status).statusDesc;
    return currentDesc === "Void" ? 'Overdue' : currentDesc === 'Draft' ? 'Saved' : currentDesc;
  }

  loadWidgetData() {
    this.sysDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.personalDashboardService.getLeavesList().subscribe(resp => {
      this.updateWidgetData('My Leaves', resp);
    })

    this.personalDashboardService.getStatusCodes('status_alias2').subscribe(statusCodes => {
      this.personalDashboardService.getWeeklyStatus(this.sysDate).subscribe(resp => {
        resp = resp.map(item => {
          const { weekStartDate, status } = item;
          return {
            ...item,
            statusDesc: this.getStatusDescription(status, statusCodes),
            formattedWeekStartDate: `${this.datePipe.transform(new Date(weekStartDate), 'dd-MMM-yy')}`
          }
        })
        this.updateWidgetData('My Timesheets', resp);
      })
    })

    this.personalDashboardService.getResourcePendingTimeSheets().subscribe(resp => {
      this.updateWidgetData('Resources Pending Timesheets', resp);
    });

    this.onGetWeeklyProjectStatus(this.sysDate);

    this.personalDashboardService.getEmployeeLeavesByRM().subscribe(resp => {
      if (resp) {
      resp = resp.map(item => {
        const { fromDate, toDate } = item;
        return {
          ...item,
          leavePeriod: `${this.datePipe.transform(new Date(fromDate), 'dd-MMM-yyyy')} - ${this.datePipe.transform(new Date(toDate),
             'dd-MMM-yyyy')}`
        };
      });
    }
      this.updateWidgetData('Leaves To Approve', resp);
    });

    this.personalDashboardService.getExpensesToApprove().subscribe(resp => {
      this.updateWidgetData('Expenses to Approve', resp);
    });

    this.personalDashboardService.getInvoicesForApproval().subscribe(resp => {
      resp = resp.map(item => {
        const { invoiceCreatedDate } = item;
        return {
          ...item,
          formattedInvoiceCreatedDate: `${this.datePipe.transform(new Date(invoiceCreatedDate), 'dd-MMM-yyyy')}`
        };
      });
      this.updateWidgetData('Invoices To Approve', resp);
    });

    this.personalDashboardService.getExpiringProjects().subscribe(resp => {
      resp = resp.map(item => {
        const { projectCompletionDate } = item;
        return {
          ...item,
          formattedProjectCompletionDate: `${this.datePipe.transform(new Date(projectCompletionDate), 'dd-MMM-yyyy')}`
        }
      })
      this.updateWidgetData('Projects About To Expire', resp);
    })

    this.bindTimesheetsToApproveData();
  }

  bindTimesheetsToApproveData() {
    if (this.timesheetToApproveBy == 'resource') {
      this.personalDashboardService.getTimeSheetApprovalResources().subscribe(resp => {
        resp = resp.map(item => {
          const { week_start_date } = item;
          return {
            ...item,
            formattedWeekStartDate: `${this.datePipe.transform(new Date(week_start_date), 'dd-MMM-yy')}`
          }
        })
        this.updateTimesheetToApproveWidgetData(resp);
      })
    } else if (this.timesheetToApproveBy == 'project') {
      this.personalDashboardService.getProjectResourceDetails(this.sysDate).subscribe(resp => {
        this.updateTimesheetToApproveWidgetData(resp);
      })
    }
  }

  updateTimesheetToApproveWidgetData(resp) {
    this.dashboardWidgetList = this.dashboardWidgetList.map(item => {
      if (item.widget.name === 'Timesheets To Approve') {
        const preferences = JSON.parse(item.widget.preferences);
        item.data = resp;
        item.headers = preferences.data[this.timesheetToApproveBy];
        item.subWidgetType = this.timesheetToApproveBy;
      }
      return item;
    })
  }

  updateWidgetData(type, resp, configData?: any) {
    this.dashboardWidgetList = this.dashboardWidgetList.map(item => {
      if (item.widget.name === type) {
        item.data = resp;
        const preferences = JSON.parse(item.widget.preferences);
        item.headers = preferences.data
        if (configData) {
          item = {
            ...configData,
            ...item
          }
        }
      }
      return item;
    });
  }

  onChangeTimeSheetApproveBy(type) {
    this.timesheetToApproveBy = type;
    this.updateWidgetData('Timesheets To Approve', null);
    this.bindTimesheetsToApproveData();
  }

  openConfigDashboardModel() {
    const wList = this.modalService.open(WidgetListComponent, {
      backdrop: 'static',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {
          data: this.dashboardWidgetList,
          dashBoardType: 'Home'
        }
      }], this.injector)
    });

    wList.result.then(resp => {
      if (resp) {
        this.getWidgetList();
      }
    });
  }

  onRemoveCurrentWidget(item) {
    const { id, widget, seqNum, widgetCol } = item;
    const payload = {
      "widgetCol": widgetCol,
      "seqNum": seqNum,
      "isVisible": false,
      "widget": {
        "id": widget.id
      },
      "id": id
    }
    this.showLoader = true;
    this.gridService.createWidget(payload).subscribe(item => {
      this.showLoader = false;
      this.getWidgetList();
    }, (err) => {
      this.showLoader = false;
    });
  }

  onGetWeeklyProjectStatus(date) {
    const formattedDate = this.datePipe.transform(new Date(date), 'yyyy-MM-dd');
    this.personalDashboardService.getWeeklyprojectStatus(formattedDate).subscribe(resp => {
      resp = resp.map(item => {
        const { status } = item;
        return {
          ...item,
          status: status === '' ? 'Pending' : status === 'N' ? 'Saved' : status === 'S' ? 'Submitted' : ''
        }
      })
      this.updateWidgetData('Weekly Project Status', resp, { weekStartDate: formattedDate });
    })
  }

}
