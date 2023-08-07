
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
import { ViewExpenseComponent } from './view-expense/view-expense.component';
import { ApproveExpenseComponent } from './approve-expense/approve-expense.component';

import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { ManagerExpenseComponent } from './manager-expense/manager-expense.component';
import { ManagerApproveComponent } from './manager-approve/manager-approve.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { ExpensePaymentComponent } from './expense-payment/expense-payment.component';
import { ManagerApprovalHistoryComponent } from './manager-expense/manager-approval-history.component';
import { PmoExpenseComponent } from './pmo-expense/pmo-expense.component';
import { PmoManageExpenseComponent } from './pmo-manage-expense/pmo-manage-expense.component';
import { ReimbursedExpenseComponent } from './reimbursed-expense/reimbursed-expense.component';
import { ReviewExpenseComponent } from './review-expense/review-expense.component';
import { ReviewManagerExpenseComponent } from './review-expense/review-manager-expense.component';
import { ViewManagerApprovalHistoryExpenseComponent } from './viewhistory-expense/view-manager-approval-history-expense.component';
import { ViewhistoryExpenseComponent } from './viewhistory-expense/viewhistory-expense.component';
import { DetailsUploadComponent } from './details-upload/details-upload.component';
import { FormUploadComponent } from './form-upload/form-upload.component';
import { ListUploadComponent } from './list-upload/list-upload.component';

const routes: Routes = [
    {
        path: '',
        // component: ExpensesComponent,
        children: [
            {
                path: 'view-expenses', component: ViewExpenseComponent,
                data: {
                    title: "View Expense"
                }
            },
            {
                path: 'create-expense', component: CreateExpenseComponent,
                data: {
                    title: "Create Expense"
                }
            },
            {
                path: 'manager-expense', component: ManagerExpenseComponent,
                data: {
                    title: "Approve Expense"
                }
            },
            {
                path: 'manager-approve/:trackingId', component: ManagerApproveComponent,
                data: {
                    title: "Approve Expense"
                }
            },
            {
                path: 'manager-approve', component: ManagerApproveComponent,
                data: {
                    title: "Approve Expense"
                }
            },
            // { path: 'edit-expense/:reportid', component: EditExpenseComponent,
            // data: {
            //     title: "Edit Expense"
            //   } },
            {
                path: "manager-approval-history",
                component: ManagerApprovalHistoryComponent,
                data: {
                    title: "Approve Expense History"
                }
            },
            {
                path: "edit-expense/:reportid/:status",
                component: EditExpenseComponent,
                data: {
                    title: "Edit Expense"
                }
            },
            {
                path: "review-expense/:reportid/:status",
                component: ReviewExpenseComponent,
                data: {
                    title: "Review Expense"
                }
            },
            {
                path: "review-manager-expense/:reportid/:status",
                component: ReviewManagerExpenseComponent,
                data: {
                    title: "Review Manager Expense"
                }
            },
            {
                path: "viewhistory-expense/:expenseid",
                component: ViewhistoryExpenseComponent,
                data: {
                    title: "View Expense History"
                }
            },
            {
                path: "pmo-viewhistory-expense/:expenseid",
                component: ViewhistoryExpenseComponent,
                data: {
                    title: "View Expense History"
                }
            },
            {
                path: "view-manager-approval-history-expense/:expenseid",
                component: ViewManagerApprovalHistoryExpenseComponent,
                data: {
                    title: "View Manager Approval Expense History"
                }
            },
            {
                path: "reimbursed-expense/:reportid/:status",
                component: ReimbursedExpenseComponent,
                data: {
                    title: "Reimbursed Expense"
                }
            },
            {
                path: "pmo-reimbursed-expense/:reportid/:status",
                component: ReimbursedExpenseComponent,
                data: {
                    title: "Reimbursed Expense"
                }
            },
            {
                path: "expense-payment",
                component: ExpensePaymentComponent,
                data: {
                    title: "Pay Expense"
                }
            },
            {
                path: "expense-details/:reportid/:status",
                component: ExpenseDetailsComponent,
                data: {
                    title: "Reimburse Expenses"
                }
            },
            {
                path: "pmo-expenses",
                component: PmoExpenseComponent
            },
            {
                path: "pmo-manage-expenses/:reportid/:status",
                component: PmoManageExpenseComponent
            },
            {
                path: "details-upload/details-upload.component",
                component: DetailsUploadComponent
              },
              {
                path: "form-upload/form-upload.component",
                component: FormUploadComponent
              },
              {
                path: "list-upload/list-upload.component",
                component: ListUploadComponent
              }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
