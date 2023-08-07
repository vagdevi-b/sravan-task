import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppConstants } from '../../shared/app-constants';
import { Router } from '@angular/router';
import { LoginService } from '../sidebar/login.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss']
})
export class MegaMenuComponent implements OnInit {
  @Input() toggleMegaMenu: boolean;
  @Input() widgets;
  @Output() toggleWidgetMenu = new EventEmitter();
  @Output() closeMegamenu = new EventEmitter<boolean>();
  menuList = [];
  oldList = [];
  widList = [];
  list1 = [];
  list2 = [];
  list3 = [];
  list4 = [];

  constructor(
    private router: Router,
    private loginService: LoginService
    ) { }

  ngOnInit() {
    this.getMenuItems();
  }

  closeWidget() {
    this.toggleMegaMenu = false;
    this.toggleWidgetMenu.emit(false);
    this.closeMegamenu.emit(this.toggleMegaMenu);
  }

  routeTo(url) {
    if (url !== undefined) {
      const cc = $.inArray(url, AppConstants.a5NavigationURLs) !== -1;
      if (!cc) {
        localStorage.removeItem('photoPath');
        localStorage.removeItem('menuTree');
        localStorage.removeItem('userName');
        localStorage.removeItem('orgCode');
        window.location.href = AppConstants.uiUrl + AppConstants.a1ContextPath + '/#' + url;
      } else {
        this.router.navigate([url]);
        if (url.includes('Timesheet')) {
          localStorage.setItem('reportArea', 'Timesheet');
        } else if (url.includes('Expenses')) {
          localStorage.setItem('reportArea', 'Expenses');
        } else if (url.includes('Employee')) {
          localStorage.setItem('reportArea', 'Employee');
        } else if (url.includes('Project')) {
          localStorage.setItem('reportArea', 'Project');
        } else if (url.includes('Invoice')) {
          localStorage.setItem('reportArea', 'Invoice');
        } else if (url.includes('Leaves')) {
          localStorage.setItem('reportArea', 'Leaves');
        } else if (url.includes('P&L')) {
          localStorage.setItem('reportArea', 'P&L');
        }
      }
      this.closeWidget();
    }
  }

  getMenuItems() {
    if(localStorage.getItem('menuTree') == undefined){
      this.loginService.getMenus().then(() => {
        const menuTree1 = JSON.parse(localStorage.getItem('menuTree'));
        if(menuTree1) {
          for (let i = 0; i < menuTree1.length; i++) {
            menuTree1[i]['icon'] = this.getIconsName(menuTree1[i]['title']);
            this.menuList.push(menuTree1[i]);
          }
          this.menuList = this.sortMenuList(this.menuList);
        }
      });
    }else{
      const menuTree1 = JSON.parse(localStorage.getItem('menuTree'));
      if(menuTree1) {
        for (let i = 0; i < menuTree1.length; i++) {
          menuTree1[i]['icon'] = this.getIconsName(menuTree1[i]['title']);
          this.menuList.push(menuTree1[i]);
        }
        this.sortMenuList(this.menuList);
      }
    }
  }

  getIconsName(str) {
    const iconName =  str.replace(/\s+/g, '-').toLowerCase();
    return `assets/icons/${iconName}.png`;
  }
  sortMenuList(menuList){
    let sortedList=[];
    let oldCount=0;
    let newCount=0;
    if(sortedList.length == 0){
      sortedList.push(menuList[0]);
    }
    for (var i = 1; i < menuList.length; i++) {
      if(menuList[i].subMenuId == undefined || sortedList[sortedList.length-1].subMenuId == undefined){
        sortedList.push(menuList[i]);
      }else if(sortedList[sortedList.length-1].subMenuId != undefined && sortedList[sortedList.length-1].children.length <= menuList[i].children.length){
        sortedList.push(menuList[i]);
      }else{
        var updatedList=[];
      for (var j = 0; j <sortedList.length; j++) {
        if(sortedList[j].subMenuId == undefined){
          updatedList.push(sortedList[j]);
        }else if(sortedList[j].subMenuId != undefined && sortedList[j].children.length<= menuList[i].children.length){
          updatedList.push(sortedList[j]);
        }else{
        updatedList.push(menuList[i]);
        for( var k=j;k<sortedList.length; k++){
          updatedList.push(sortedList[k]);
        }
        j=sortedList.length;
        }
        
      }
      sortedList = updatedList;
      }
    }
    this.menuList = sortedList;
    return this.menuList;
  }
}
