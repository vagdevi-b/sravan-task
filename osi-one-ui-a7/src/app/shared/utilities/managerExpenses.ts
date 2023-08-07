import { Expense } from "./expense.model";

export class ManagerExpenses{
    constructor(public expenseDate:string,public lineItems:Expense){}
}