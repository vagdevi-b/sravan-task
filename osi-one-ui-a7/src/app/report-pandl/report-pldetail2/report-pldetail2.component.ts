// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-report-pldetail2',
//   templateUrl: './report-pldetail2.component.html',
//   styleUrls: ['./report-pldetail2.component.css']
// })
// export class ReportPldetail2Component implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }



import { Component, OnInit, ViewChild } from '@angular/core';
import { PandlService } from '../../shared/services/pandl.service';
import *  as  Feather from 'feather-icons';
import { Subscription } from 'rxjs';
import { DetailsPandLdataCards } from '../../shared/constants/details-tab.contants';
import { GridWidgetComponent } from '../../shared/component/grid-widget/grid-widget.component';
declare var $: any;
@Component({
  selector: 'app-report-pldetail2',
  templateUrl: './report-pldetail2.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class ReportPldetail2Component implements OnInit {
  @ViewChild('gridWidget') gridWidget: GridWidgetComponent;
  cardsList = DetailsPandLdataCards;
  showFilters: boolean;
  dtOptions: DataTables.Settings = {};
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated pldetail_2';
  spinner: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private pAndLsvc: PandlService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    Feather.replace();
  }

  getdata() {
    // this.subscriptions.push(this.pAndLsvc.getDataofPandL().subscribe(data => {
    //   // this.gridData = data['P and L'];
    //   // $('#loadingEditSubmitModal').modal('show');
    // }, err => {
    //   console.log(err);
    //   $('#loadingEditSubmitModal').modal('hide');
    // }));
  }


  showfilters() {
    this.showFilters = true;
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated pldetail_2 hidden';
  }

  closingFilters(event) {
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated pldetail_2';
    this.showFilters = event;
  }
  getPandLData(event) {
    // console.log(event);
    if (event) {
      this.getdata();
    }
  }



  refresh() {
    this.gridWidget.loadData();
  }



  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    });
  }
}

