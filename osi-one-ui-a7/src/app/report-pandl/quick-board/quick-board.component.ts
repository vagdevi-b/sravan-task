import { Component, Input, OnInit } from '@angular/core';
import { ShortNumberhPipe } from '../../shared/pipes/short-number.pipe';
import { PandlService } from '../../shared/services/pandl.service';

@Component({
  selector: 'app-quick-board',
  templateUrl: './quick-board.component.html',
  styleUrls: ['../../../../src/assets/css/light.css']
})
export class QuickBoardComponent implements OnInit {
  cardDetailsList: any[] = [];
  rawData: any[] = [];
  decimalValuesCount = 2;
  @Input('rawData')
  set setRawData(value: any[]) {
    this.rawData = value;
    this.calculateCostRevenueMargin();
  } 
  constructor(
   
  ) { }

  ngOnInit() {
  }

  getCardDetails(): any {
    return [
      {
        id: 1,
        title: 'Cost',
        value: '0'
      },
      {
        id: 2,
        title: 'Revenue',
        value: '0'
      },
      {
        id: 3,
        title: 'Margin',
        value: '0%'
      },
      {
        id: 4,
        title: 'Utilization',
        value: '0%'
      }
    ];
  }

  calculateCostRevenueMargin(): void {
    let totalcost: any = 0;
    let totalrevenue: any =0;
    let margin = 0;
    let totalbillinghours = 0;
    let totalnonbillinghours =0;
    let totalinternalhours = 0;
    let totalholidayhours = 0;
    let totalptohours = 0;
    let utilization = 0;
    this.cardDetailsList = this.getCardDetails();
    if (this.rawData) {
      totalcost = this.rawData.reduce((sum, currObj) => sum + currObj.recognized_cost, 0);
      totalrevenue = this.rawData.reduce((sum, currObj) => sum + currObj.recognized_revenue, 0);
      margin = 0;
      totalbillinghours = this.rawData.reduce((sum, currObj) => sum + currObj.billable_hours, 0);;
      totalnonbillinghours = this.rawData.reduce((sum, currObj) => sum + currObj.non_billable_hours, 0);
      totalinternalhours = this.rawData.reduce((sum, currObj) => sum + currObj.internal_hours, 0);
      totalholidayhours = this.rawData.reduce((sum, currObj) => sum + currObj.holiday_hours, 0);
      totalptohours = this.rawData.reduce((sum, currObj) => sum + currObj.pto_hours, 0);
      let totalspecialleavehours = this.rawData.reduce((sum, currObj) => sum + currObj.special_leave_hours, 0);
      
      if(totalcost===0 && totalrevenue===0){
        margin=0;
      }
      if(totalcost!=0 && totalrevenue===0){
        margin=-100;
      }
      else
     { margin = 100 * (totalrevenue - totalcost) / totalrevenue;}
      if (!isFinite(margin)) {
        margin = 0;
      }
      let totalhours = totalbillinghours + totalnonbillinghours + totalinternalhours + totalholidayhours + totalptohours + totalspecialleavehours;
      utilization = (totalbillinghours / totalhours) * 100;
      if (!isFinite(utilization)) {
        utilization = 0;
      }
  
      //adding k or m to total cost and revenue
      // totalcost = ShortNumberhPipe.prototype.transform(totalcost, this.decimalValuesCount);
      // totalrevenue = ShortNumberhPipe.prototype.transform(totalrevenue, this.decimalValuesCount);
    }
 
    this.cardDetailsList.forEach((card: any) => {
      if (card.title === 'Cost') {
        card.value = totalcost ? ShortNumberhPipe.prototype.transform(totalcost, this.decimalValuesCount) : 0;
      } else if (card.title === 'Revenue') {
        card.value = totalrevenue ? ShortNumberhPipe.prototype.transform(totalrevenue, this.decimalValuesCount) : 0;
      }else if (card.title === 'Margin') {
        card.value = (margin ? margin.toFixed(this.decimalValuesCount) : 0) + '%';
      } else if (card.title === 'Utilization') {
        card.value = (utilization ? utilization.toFixed(this.decimalValuesCount) : 0) + '%';
      }
    })
  }

}
