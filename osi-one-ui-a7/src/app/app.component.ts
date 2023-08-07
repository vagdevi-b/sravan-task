import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserIdleService } from 'angular-user-idle';
import { PersonalDashboardService } from './shared/services/personal-dashboard.service';
import { PandlService } from './shared/services/pandl.service';


// character(s) that separate adjacent key value pairs and
// key and value in each pair in document.cookie set by a1 code
const DOCUMENT_COOKIE_PAIR_SEPARATOR = ';';
const DOCUMENT_COOKIE_KEY_VALUE_SEPARATOR = '=';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private personalDashboardService: PersonalDashboardService,
    private titleService: Title,
    private userIdle: UserIdleService,
    // vcRef is used in LoadingService
    public vcRef: ViewContainerRef,
    private pandlService: PandlService
  ) { }

  ngOnInit() {
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .map(() => this.activatedRoute)
    .map((route) => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      // if (this.pandlService && this.router.url && !this.pandlService.pAndLRoutes.includes(this.router.url)) {
      //   this.pandlService.runPandLData$.next(null);
      // }
      return route;
    })
    .filter((route) => route.outlet === 'primary')
    .mergeMap((route) => route.data)
    .subscribe((event) => this.titleService.setTitle(event['title']));

    const parsedCookie = this.parseDocumentCookie(
      DOCUMENT_COOKIE_PAIR_SEPARATOR, DOCUMENT_COOKIE_KEY_VALUE_SEPARATOR
    );

    // a1 code sets the token in local storage when user logs in so this is not required
    // but while testing in local we use 2 different ports for a1 and a5 so token set by a1 is not visible to a5
    localStorage.setItem('token', parsedCookie['Auth_Token']);

    localStorage.setItem('proxyUserId', parsedCookie['Proxy_User_Id']);
    localStorage.setItem('userId', parsedCookie['userId']);

    // When we navigate from a1 to a7, the url requested is in document.cookie.
    // navigating to it
    this.router.navigate([parsedCookie['requestedUrl']]);

    // Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
        this.router.navigate(['logout']);
    });
    this.getEmployeeRoles();
  }

  getEmployeeRoles() {
    this.personalDashboardService.getEmployeeRoles().subscribe((resp) => {
      const { Department, Grade, Id, Name } = resp.Employee[0];
      const depArr = Department.split('.');
      const userDetails = {
        grade: Grade,
        id: Id,
        name: Name,
        practice: depArr[2],
        subPractice: depArr[3]
      };
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
    });
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  /**
   * from a1 code, some info like requested url, proxyUserId
   * will be set in document.cookie variable for a7 to use
   *
   * This method will parse that and return the object
   * Ex: {
   *   requestedUrl: '',
   *   Proxy_User_Id: null,
   *   token: ''
   * }
   *
   * @param pairSeparator
   * character(s) that separate key and value
   *
   * @param keyValueSeparator
   * character(s) that separates adjacent key value pairs
   *
   * @return parsed object from the document.cookie string
   *
   * */
  parseDocumentCookie(pairSeparator: string, keyValueSeparator: string): any {
    const decodedDocumentCookie = decodeURIComponent(document.cookie);

    // key values parsed from document.cookie will be stored
    const parsedCookie = {};

    let key;
    let value;
    let separatorIndex;

    decodedDocumentCookie.split(pairSeparator).forEach(pair => {
      pair = pair.trim();
      separatorIndex = pair.indexOf(keyValueSeparator);

      // if the separator doesn't exist in that pair,
      // it will not be included in parsedCookie
      if (separatorIndex !== -1) {
        key = pair.substring(0, separatorIndex);
        value = pair.substring(separatorIndex + 1);
        parsedCookie[key] = value;
      }
    });

    return parsedCookie;
  }

}
