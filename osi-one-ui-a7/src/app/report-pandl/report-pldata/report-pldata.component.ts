import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { PandlService } from '../../shared/services/pandl.service';
import { Subject, Subscription } from 'rxjs';
import  *  as  Feather  from  'feather-icons';
import {
  Router, NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';
import {DataPandLDataCards} from '../../shared/constants/data-tab.constants';
import { GridWidgetComponent } from '../../shared/component/grid-widget/grid-widget.component';

declare var $: any;
@Component({
  selector: 'app-report-pldata',
  templateUrl: './report-pldata.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPldataComponent implements OnInit {
  // @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('gridWidget') gridWidget: GridWidgetComponent;
  cardsList = DataPandLDataCards;
  gridData: any = [];
  yearMonthGridData: any = [];
  projectsGrid: any = [];
  projectsGridTotal: any = [];
  revenueTotal: any = 0;
  spinner: boolean;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  showFilters: boolean;
  showLoading: boolean = false;
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated';
  subscriptions: Subscription [] = [];
  constructor(private pAndLsvc: PandlService, private router: Router) { }

  ngOnInit() {
    //$('#loadingEditSubmitModal').modal('show');
    // this.spinner = true;
    // this.getdata();
    // this.setDtOptions();
  }

  ngAfterViewInit()  {
    Feather.replace();
  }

 
  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden';
  }

  closingFilters(event) {
    // console.log(event);
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated';
    this.showFilters = event;
  }

  // ngAfterViewInit() {
  //   this.router.events
  //     .subscribe((event) => {
  //       if (event instanceof NavigationStart) {
  //         console.log('nav start');
  //         //$('#loadingEditSubmitModal').modal('show');
  //       }
  //       else if (
  //         event instanceof NavigationEnd ||
  //         event instanceof NavigationCancel
  //       ) {
  //         console.log('nav end');
  //         //$('#loadingEditSubmitModal').modal('hide');
  //       }
  //     });
  //   this.dtTrigger.next();

  // }
  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    // this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
  
  getPandLData(event) {
    // console.log(event);
    if (event) {
      // this.getdata();
      //this.setDtOptions();

      // this.rerender();
    }
  }

  // rerender() {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }
 

  refresh(value?: any) {
    //$('#loadingEditSubmitModal').modal('show');
    this.yearMonthGridData = [];
    // this.yearMonthGrid();
    //$('#loadingEditSubmitModal').modal('hide');
  }

}
