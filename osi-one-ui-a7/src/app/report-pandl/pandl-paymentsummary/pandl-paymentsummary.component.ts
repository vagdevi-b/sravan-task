import { Component,OnInit} from '@angular/core';
import { Subscription } from "rxjs";
import { PandlService } from '../../shared/services/pandl.service';
import { PaymentPandLdataCards } from '../../shared/constants/payment-tab.constants';
import * as _ from 'lodash'
declare var $: any;
@Component({
  selector: 'app-pandl-paymentsummary',
  templateUrl: './pandl-paymentsummary.component.html',
  styleUrls: ['../../../../src/assets/css/light.css'],
})
export class PandlPaymentsummaryComponent implements OnInit {
  // destroy$: Subject<boolean> = new Subject<boolean>();

  // @ViewChild('gridWidget') gridWidget: GridWidgetComponent;
  cardsList = PaymentPandLdataCards
  showFilters: boolean
  buttonClass: string = 'btn btn-custom-filter btn-custom-filter--floated'
  // @ViewChild('sourceCanvas') sourceCanvasRef: ElementRef<HTMLCanvasElement>;
  // @ViewChild('targetCanvas') targetCanvasRef: ElementRef<HTMLCanvasElement>;
  subscriptions: Subscription [] = [];
  chartData: any = [];
  cardsData: any = [];
  FilterSummaryData: any = [];
  year: any = [];
  yearsdata;
  currenYear;
  innovoiceExpences: any = [];
  payments: any = [];
  showLoading: boolean = false;
  paymentsAgainestDue: any = [];
  expensePayments: any = [];
  inovoicedServices: any = [];
  constructor( private pandlsvc: PandlService) { }

  ngOnInit() {
    if (localStorage.getItem('yearFilter') === null) {
      this.getyeardata();
    }
    this.subscriptions.push(this.pandlsvc.getRunPaymentDataTriggered().subscribe((data: Boolean) => {
      if (data) {
        this.cardsData = [];
      }
    }));
    this.subscriptions.push(this.pandlsvc.getDataofPayment().subscribe(data => {
      this.cardsData = [];
      if (data) {
        this.cardsData = data['P and L'];
        if (localStorage.getItem('triggerValue') &&
          parseInt(localStorage.getItem('triggerValue')) !=
          parseInt(sessionStorage.getItem('valueTrigger'))
        ) {
          this.SummaryData()
          localStorage.setItem('triggerValue', '0')
          sessionStorage.setItem('valueTrigger', '0')
        }
      }else{
        this.SummaryData();
      }
    }, err => {
      //console.log(err);
      //$('#loadingEditSubmitModal').modal('hide');
    }));
  }
  getyeardata() {
    this.yearsdata = []
    this.pandlsvc.getYearsList().subscribe(
      (response) => {
        const yearsList = _.orderBy(response.Years, ['year'], ['desc'])
        this.yearsdata = yearsList
        let filter = _.orderBy(this.yearsdata, ['year'], ['asce'])
        if (localStorage.getItem('yearFilter') === null) {
          this.currenYear = [filter.reduce((sum, currObj) => currObj.year, 0)]
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  showfilters() {
    this.showFilters = true
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated hidden'
  }

  closingFilters(event) {
    this.buttonClass = 'btn btn-custom-filter btn-custom-filter--floated'
    this.showFilters = event
  }
  // getPandLData(event) {
  //   // console.log(event);
  //   if (event) {
  //     // this.getdata();
  //   }
  // }
  constructReqbody() {
    let currenYear
    if (localStorage.getItem('yearFilter') === null) {
      currenYear = new Date().getFullYear()
      // this.getyeardata();
      let obj = {
        year: [currenYear] ,
        projectOrg: [],
        projectSubPrac: [],
        projectPractice: [],
        customer: [],
        project: [],
        employee: [],
        employeeOrg: [],
        employeeBu: [],
        employeePractice: [],
        employeeSubPrac: [],
        yearMonth:[],
        sowIds:[]
      }
      return obj
    } else if (localStorage.getItem('payload') === null) {
      {
        currenYear = JSON.parse(localStorage.getItem('yearFilter'))
        // this.getyeardata();
        let obj = {
          year: currenYear,
          projectOrg: [],
          projectSubPrac: [],
          projectPractice: [],
          customer: [],
          project: [],
          employee: [],
          employeeOrg: [],
          employeeBu: [],
          employeePractice: [],
          employeeSubPrac: [],
          yearMonth:[],
          sowIds:[]
        }
        return obj
      }
    } else {
      currenYear = JSON.parse(localStorage.getItem('yearFilter'))
      let obj = JSON.parse(localStorage.getItem('payload'))
      return obj
    }
  }
 
  SummaryData() {
    $('#loadingEditSubmitModal').modal('show')
    this.cardsData = []
    let body = this.constructReqbody()
    setTimeout(() => {
    this.pandlsvc.PaymentSummary(body).subscribe(
      (data) => {
        // this.cardsData = data['P and L'];
        this.cardsData = data['P and L']
        $('#loadingEditSubmitModal').modal('hide')
      },
      (err) => {
        $('#loadingEditSubmitModal').modal('hide')
      },
    )},200)
  }
  // filterObject() {
  //   let obj = {
  //     "year": this.year,
  //     "Invoiced_Expense": this.innovoiceExpences,
  //     "Payments": this.payments,
  //     "Payments_Against_Invoice": this.paymentsAgainestDue,
  //     "Exp_Payments": this.expensePayments,
  //     "Invoiced_Service": this.inovoicedServices,
  //   }
  //   return obj;
  // }
  filterArray(array, filters) {
    const filterKeys = Object.keys(filters)
    return array.filter((eachObj) => {
      return filterKeys.every((eachKey) => {
        if (!filters[eachKey].length) {
          return true // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey])
      })
    })
  }
  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1
      } else if (a[prop] < b[prop]) {
        return -1
      }
      return 0
    }
  }
  getUniqueDataAfterFilter(data, keyword) {
    // Declare a new array
    let newArray = []

    // Declare an empty object
    let uniqueObject = {}

    // Loop for the array elements
    for (let i in data) {
      // Extract the title
      let objTitle = data[i][keyword]

      // Use the title as the index
      uniqueObject[objTitle] = data[i]
    }

    // Loop to push unique object into array
    for (let i in uniqueObject) {
      let obj = uniqueObject[i]
      newArray.push(obj)
    }

    // Display the unique objects
    let uniqueArray = newArray.sort(this.GetSortOrder(keyword))
    let filtered = uniqueArray.filter(function (el) {
      return el[keyword] != null
    })
    return filtered
  }

  refresh(value?: any) {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe()
    })
  }
}
// Chart['elements'].Rectangle.prototype.draw = function () {

//   let ctx = this._chart.ctx;
//   let view = this._view;

//   //////////////////// edit this to change how rounded the edges are /////////////////////
//   let borderRadius = 10;

//   let left = view.x - view.width / 2;
//   let right = view.x + view.width / 2;
//   let top = view.y;
//   let bottom = view.base;

//   ctx.beginPath();
//   ctx.fillStyle = view.backgroundColor;
//   ctx.strokeStyle = view.borderColor;
//   ctx.lineWidth = view.borderWidth;

//   let barCorners = [
//     [left, bottom],
//     [left, top],
//     [right, top],
//     [right, bottom]
//   ];

//   //start in bottom-left
//   ctx.moveTo(barCorners[0][0], barCorners[0][1]);

//   for (let i = 1; i < 4; i++) {
//     let x = barCorners[1][0];
//     let y = barCorners[1][1];
//     let width = barCorners[2][0] - barCorners[1][0];
//     let height = barCorners[0][1] - barCorners[1][1];

//     //Fix radius being too big for small values
//     if (borderRadius > width / 2) {
//       borderRadius = width / 2;
//     }
//     if (borderRadius > height / 2) {
//       borderRadius = height / 2;
//     }

//     // DRAW THE LINES THAT WILL BE FILLED - REPLACING lineTo with quadraticCurveTo CAUSES MORE EDGES TO BECOME ROUNDED
//     ctx.moveTo(x + borderRadius, y);
//     ctx.lineTo(x + width - borderRadius, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
//     ctx.lineTo(x + width, y + height - borderRadius);
//     ctx.lineTo(x + width, y + height, x + width - borderRadius, y + height);
//     ctx.lineTo(x + borderRadius, y + height);
//     ctx.lineTo(x, y + height, x, y + height - borderRadius);
//     ctx.lineTo(x, y + borderRadius);
//     ctx.quadraticCurveTo(x, y, x + borderRadius, y);

//   }

//   //ctx.parentElement.style.width = width +'px';
//   //FILL THE LINES
//   ctx.fill();
// };
