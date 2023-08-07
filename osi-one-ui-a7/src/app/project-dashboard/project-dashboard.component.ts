import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit {

  constructor() { }

  navBar : String = 'myprojects';
  ngOnInit() {
  }

  onNavClick(param) {
    this.navBar = param;
  }

}
