import { Component, OnInit, Input } from '@angular/core'
import { ShortNumberhPipe } from '../../shared/pipes/short-number.pipe'
import { PandlService } from '../../shared/services/pandl.service'
import { QuickBoardComponent } from '../quick-board/quick-board.component'

@Component({
  selector: 'app-summary-quick-board',
  templateUrl: '../quick-board/quick-board.component.html',
  styleUrls: ['../../../../src/assets/css/light.css'],
})
export class SummaryQuickBoardComponent extends QuickBoardComponent
  implements OnInit {
  constructor() {
    super()
  }
  ngOnInit() {}
  getCardDetails(): any {
    return [
      {
        id: 1,
        title: 'Cost',
        value: '0',
      },
      {
        id: 2,
        title: 'Revenue',
        value: '0',
      },
      {
        id: 3,
        title: 'GM%',
        value: '0',
      },
      {
        id: 4,
        title: 'Invoiced Services',
        value: '0',
      },

      {
        id: 5,
        title: 'Invoiced Expenses',
        value: '0',
      },
      {
        id: 6,
        title: 'Payments Received',
        value: '0',
      },
      {
        id: 7,
        title: 'Payment Dues',
        value: '0%',
      },
      {
        id: 8,
        title: 'Expense Payments',
        value: '0%',
      },
    ]
  }
  calculateCostRevenueMargin(): void {
    let totalinvoiceExpenses: any = 0
    let totalpayment: any = 0
    let totalexpensepayments = 0
    let totalinovoicepayments = 0
    let totalcost = 0
    let totalrevenue = 0
    let totalmargin = 0
    let totalinvoicedservices = 0
    this.cardDetailsList = this.getCardDetails()
    if (this.rawData) {
      totalinvoiceExpenses = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Invoiced_Expense_USD,
        0,
      )
      totalpayment = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Payments_USD,
        0,
      )
      totalinovoicepayments = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Payments_Against_Invoice_USD,
        0,
      )
      totalexpensepayments = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Exp_Payments_Against_Invoice_USD,
        0,
      )
      totalcost = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Project_Cost,
        0,
      )
      totalrevenue = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Project_Revenue,
        0,
      )
      totalinvoicedservices = this.rawData.reduce(
        (sum, currObj) => sum + currObj.Invoiced_Service_USD,
        0,
      )
      if (totalrevenue === 0 && totalcost === 0) {
        totalmargin = 0
      } else if (totalrevenue === 0 && totalcost != 0) {
        totalmargin = -100
      } else {
        totalmargin = (100 * (totalrevenue - totalcost)) / totalrevenue
      }
      // if (!isFinite(totalmargin)) {
      //   totalmargin = 0;
      // }
    }
    this.cardDetailsList.forEach((card: any) => {
      if (card.title === 'Invoiced Expenses') {
        card.value = totalinvoiceExpenses
          ? ShortNumberhPipe.prototype.transform(
              totalinvoiceExpenses,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'Payments Received') {
        card.value = totalpayment
          ? ShortNumberhPipe.prototype.transform(
              totalpayment,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'Payment Dues') {
        card.value = totalinovoicepayments
          ? ShortNumberhPipe.prototype.transform(
              totalinovoicepayments,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'Expense Payments') {
        card.value = totalexpensepayments
          ? ShortNumberhPipe.prototype.transform(totalexpensepayments, 0)
          : 0
      } else if (card.title === 'Invoiced Services') {
        card.value = totalinvoicedservices
          ? ShortNumberhPipe.prototype.transform(
              totalinvoicedservices,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'GM%') {
        card.value = totalmargin
          ? ShortNumberhPipe.prototype.transform(
              totalmargin,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'Cost') {
        card.value = totalcost
          ? ShortNumberhPipe.prototype.transform(
              totalcost,
              this.decimalValuesCount,
            )
          : 0
      } else if (card.title === 'Revenue') {
        card.value = totalrevenue
          ? ShortNumberhPipe.prototype.transform(
              totalrevenue,
              this.decimalValuesCount,
            )
          : 0
      }
    })
  }
}
