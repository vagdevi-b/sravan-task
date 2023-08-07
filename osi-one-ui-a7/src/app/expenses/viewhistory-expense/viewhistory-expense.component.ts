import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppConstants } from '../../shared/app-constants';
import { ViewExpensesService } from '../../shared/services/viewexpenses.service';
import { NavigateDataService } from '../../shared/services/navigateData.service';

declare var $: any;

@Component({
  selector: 'app-viewhistory-expense',
  templateUrl: './viewhistory-expense.component.html',
  styleUrls: ['./viewhistory-expense.component.css']
})
export class ViewhistoryExpenseComponent implements OnInit {

  private errorMessage: string;
  private appData = AppConstants;
  public rowData;

  reverse: boolean;
  rowDatas: any;
  total: number = 0;
  crntpage: number;
  balanceCrntpage: number = 0;
  sortKey: any;
  flag = false;
  expenseId: any;
  isSelectedRow: any = null;

  currentRepId: any;
  currentRepStatus: any;

  constructor(private _viewExpensesService: ViewExpensesService, private router: Router, private route: ActivatedRoute, private _navigateDataService: NavigateDataService) {

  }

  ngOnInit() {
    this._navigateDataService.currentReportId.subscribe(repId => this.currentRepId = repId);
    this._navigateDataService.currentReportStatus.subscribe(repStatus => this.currentRepStatus = repStatus);

    this.crntpage = 0;
    this.expenseId = this.route.params['_value'].expenseid;
    console.log("Audit log for expenseid : ", this.expenseId);

    this.rowData = this.getExpenseAuditData();
  }

  sorting(key) {
    if (this.rowData != null) {
      if (this.flag) {
        if (key === 'lastUpdatedDate') {
          this.flag = false
          this.rowData.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return -(dateA.getTime() - dateB.getTime());
          });
        } else {
          this.flag = false
          this.rowData.sort((a, b) => {
            if (a[key] > b[key]) return -1;
            if (a[key] < b[key]) return 1;
            return 0;
          })
        }
      } else {
        if (key === 'lastUpdatedDate') {
          this.flag = true
          this.rowData.sort((a, b) => {
            const dateA = new Date(a[key]);
            const dateB = new Date(b[key]);
            return dateA.getTime() - dateB.getTime();
          });
        } else {
          this.flag = true
          this.rowData.sort((a, b) => {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
          })
        }
      }
    }
  }

  selectedRow() {
    this.isSelectedRow = null;
  }

  isRowClicked(data) {
    this.isSelectedRow = data;
  }

  getExpenseAuditData() {
    const rowData: any[] = [];
    this._viewExpensesService.getExpenseAuditData(this.expenseId).subscribe(response => {
      this.rowDatas = response
      this.rowData = this.rowDatas.reverse();
      this.total = this.rowData.length;
    },
      error => this.errorMessage = <any>error);
  }

  cancel() {
    console.log("reportId from Parent : ", this.currentRepId);
    console.log("reportStatus from Parent : ", this.currentRepStatus);

    if(this._navigateDataService.isRouteFromPmoPage){
      this._navigateDataService.isRouteFromPmoPage = false;
      this.router.navigate(['../../pmo-manage-expenses/', this.currentRepId, this.currentRepStatus], { relativeTo: this.route });
    }else{
      if  (this.currentRepStatus  ==  'Open'  ||  this.currentRepStatus  ==  'Rejected') {
        this.router.navigate(['../../edit-expense',  this.currentRepId,  this.currentRepStatus], {  relativeTo:  this.route  });
      }  else  if (this.currentRepStatus  ==  'Approved'  ||  this.currentRepStatus  ==  'Submitted') {
        this.router.navigate(['../../review-expense',  this.currentRepId,  this.currentRepStatus], {  relativeTo:  this.route  });
      } else if (this.currentRepStatus  ==  'Reimbursed' ) {
        if(this.route.snapshot.url[1].toString() == 'viewhistory-expense') {
          this.router.navigate(['../../reimbursed-expense',  this.currentRepId,  this.currentRepStatus], {  relativeTo:  this.route  });
        } else if(this.route.snapshot.url[1].toString() == 'pmo-viewhistory-expense') {
          this.router.navigate(['../../pmo-reimbursed-expense/', this.currentRepId, this.currentRepStatus], { relativeTo: this.route });
        }
      }
    }
    
  }

}
