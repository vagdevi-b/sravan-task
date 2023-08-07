export class invoiceDetails {
  invoiceLayoutId:number = null;
  invoiceLayoutName: String="";
  isActive: Boolean = false;
  isDefault:Boolean= false;
  isIncludeHoursTotal= false;
  selectedInvoiceColumns: any[] = [];
  selectedGroupingColumns: any[] = [];
  isCombineExpenses: Boolean = false;
  isCombineServices: Boolean = false;
  combineChargeBy: String = "Day";
  toAdressLayout: String = "Contact / Client / Address";
  fromEmail: String = "";
  fromAddress: String = "";
  additionalText: String = "";
  headerLogoFileName: String = "";
  headerLogoFileType: String = "";
  headerLogoFileContent: String = "";
  footerLogoFileName: String = "";
  footerLogoFileType: String = "";
  footerLogoFileContent: String = "";
  pageOrientation: String = "P";
}
