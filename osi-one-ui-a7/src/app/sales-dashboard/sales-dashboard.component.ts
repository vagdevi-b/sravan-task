import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent implements OnInit {
  navBar: any = 'salesReport';

  constructor() { }

  ngOnInit() {
  }

  onNavClick(param) {
    this.navBar = param;
    // if (params === "accural") {
    //   this.disableOnAccural = true;
    // } else {
    //   this.disableOnAccural = false;
    // }
  }

}
