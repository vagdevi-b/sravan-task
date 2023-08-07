import { UploadFile } from "./uploadfile";

export class Expense{
    constructor(
    public id:string,
    public projectId:string,
    public projectName:string,
    public projectTaskId:string,
    public projectTaskName:string,
    public expenseDate:string,
    public expenseTypeId:string,
    public expenseTypeName:string,
    public quantity:string,
    public receiptPrice:string,
    public currencyCode:string,
    public baseExchangeAmt:any,
    public billable: boolean = true,
    public reimbursible: boolean = false,
    public attachments:string,
    public missingReceipts: boolean = false,
    public exchangeRate:string,
    public exchangeRateWithDesc:any,
    public notes:string,
    public status:string,
    public expenseAttachments: Array<UploadFile>,
    expenseAttachment: UploadFile,
    ){
        this.expenseAttachment = expenseAttachment;
    }

    "expenseAttachment": UploadFile;

}