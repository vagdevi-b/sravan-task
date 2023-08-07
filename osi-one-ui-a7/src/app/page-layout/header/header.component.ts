import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../shared/app-constants';
import {LoginService} from '../sidebar/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: []
})
export class HeaderComponent implements OnInit {
  userName = '';
  photoPath = '';
  toggleMegaMenu: boolean;
  defaultImg = 'assets/images/profilePic.jpg';
  imageFile: string = AppConstants.uiUrl + AppConstants.a1ContextPath + '/ems/img/osione_logo.png';
  profilePath = AppConstants.uiUrl + AppConstants.a1ContextPath + '/#/profile';

  constructor(
    private loginService: LoginService
  ) { }

  routeTo(url) {
    window.location.href = AppConstants.uiUrl + AppConstants.a1ContextPath + '/#/' + url;
  }

  ngOnInit() {
    this.toggleMegaMenu = false;

    /* then callback will be executed only after the menus fetching is completed.
     * If userName from localStorage is accessed before that, old values will be present */
    this.loginService
      .getMenus()
      .then(() => {
        this.userName = localStorage.getItem('userName');
        const profilePic = localStorage.getItem('photoPath');
        this.photoPath = (profilePic) ? profilePic : this.defaultImg;
    });
  }

  openMegaMenu() {
    this.toggleMegaMenu = true;
  }
  closeWidget($event) {
    this.toggleMegaMenu = $event;
  }

}
