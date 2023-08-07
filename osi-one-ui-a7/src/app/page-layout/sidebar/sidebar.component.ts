import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { AppConstants } from '../../shared/app-constants';
import { LoginService } from './login.service';
import { FavouriteSettingsComponent } from '../favourite-settings/favourite-settings.component';
import * as _ from 'underscore';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: []
})
export class SidebarComponent implements OnInit {
  public favItems = [];
  public menuList = [];
  public menuTree: any = [];
  public menuTree1: any = [];
  public imageFile = '';
  public userName = '';
  public photoPath = '';
  token = '';
  showInfo = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private injector: Injector,
    private loginService: LoginService) { }

  ngOnInit() {
    if (this.router.url === '/logout' || !localStorage.getItem('token')) {
      this.deleteBrowserCookies();
      localStorage.removeItem('proxyUserId');
      window.location.href = AppConstants.uiUrl + AppConstants.a1ContextPath + '/#/logout';
    } else {
      this.getMenuData();

      // the code in the then callback will be executed after the menuTree, orgId etc
      // have been set in localStorage
      this.loginService.getMenus()
        .then(() => {
          const profilePic = localStorage.getItem('photoPath');
          this.photoPath = (profilePic) ? profilePic : './assets/images/profilePic.jpg';
          this.userName = localStorage.getItem('userName');
        });
    }
  }

  getIconsName(str) {
    const iconName = str.replace(/\s+/g, '-').toLowerCase();
    return `assets/icons/${iconName}.png`;
  }

  routeTo(url) {
    if (url !== undefined) {
      const cc = AppConstants.a5NavigationURLs.indexOf(url) !== -1;
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
    }
  }

  deleteBrowserCookies() {
    localStorage.removeItem('menuTree');
    document.cookie = 'Auth_Token=; Proxy_User_Id=; path=/; domain=' + AppConstants.cookieDomain + '; expires=' + new Date(0).toUTCString();
  }
  openModal(): void {
    const dialogRef = this.modalService.open(FavouriteSettingsComponent, {
      centered: true,
      backdrop: 'static',
      injector: Injector.create([{
        provide: ModalOptions,
        useValue: {
          data: this.menuTree1
        }
      }], this.injector)
    });
    dialogRef.componentInstance.closeParentModal.subscribe(result => {
      if (result) {
        // updating sidebar after saving edited menu favourites
        this.getMenuData();
      }
    });
  }
  setFavourites() {
    this.favItems = [];
    this.menuList = _.clone(this.menuTree);
    this.menuList.forEach(pitem => {
      if (pitem.groupTitle !== 'My Home' && pitem.isFavourite === true) {
        this.favItems.push(pitem);
      }
    });
  }

  getMenuData() {
    this.loginService.getNewMenus()
      .then(() => {
        this.menuTree1 = JSON.parse(localStorage.getItem('favMenu'));
        this.favItems = [];

        for (let i = 0; i < this.menuTree1.length; i++) {
          this.menuTree1[i]['icon'] = this.getIconsName(this.menuTree1[i]['groupTitle']);
          if (this.menuTree1[i].groupTitle !== 'My Home' && this.menuTree1[i].isFavourite === true) {
            this.favItems.push(this.menuTree1[i]);
          }
        }
      });
  }

}
