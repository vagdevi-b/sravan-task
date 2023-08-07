import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pandl-nav-bar',
  templateUrl: './pandl-nav-bar.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class PandlNavBarComponent implements OnInit {

  @Output() refreshEmitter = new EventEmitter<boolean>();
  pandlNavBarItems = [];
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.setNavBarDetails();
  }

  setNavBarDetails(): void {
    this.pandlNavBarItems = [
      {
        title: 'Summary',
        url: 'reports/PAndL'
      },
      {
        title: 'Details',
        url: 'pandldetail'
      },
      {
        title: 'Utilization',
        url: 'pandlutilization'
      },
      // {
      //   title: 'Data',
      //   url: 'pandldata'
      // },
      {
        title: 'Project',
        url: 'pandlproject'
      },
     
      {
        title: 'Payments',
        url: 'paymentsummary'
      },
      {
        title: 'Employee',
        url: 'pandlemployee'
      },
      // {
      //   title: 'Details1',
      //   url: 'pandldetail1'
      // },
      // {
      //   title: 'Details2',
      //   url: 'pandldetail2'
      // },
    ];
  }

  refresh(): void {
    this.refreshEmitter.emit(true);
  }

}
