import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import * as _ from "underscore";
import { InvoiceServices } from "./../../shared/services/invoice-services.service";
import { invoiceDetails } from "./invoice-details";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "dynamicInvoiceTemplate",
  templateUrl: "./dynamic-invoice-template.component.html",
  styleUrls: ["./dynamic-invoice-template.component.css"]
})
export class DynamicInvoiceTemplateComponent implements OnInit {
  constructor(
    private invoiceServices: InvoiceServices,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild("general") general: any;
  @ViewChild("invoicColumns") invoicColumns: any;
  @ViewChild("invoiceGrp") invoiceGrp: any;
  @ViewChild("combineChrges") combineChrges: any;
  @ViewChild("others") others: any;
  @ViewChild("logoSetting") logoSetting: any;
  @ViewChild("footerSetting") footerSetting: any;
  @ViewChild("pdfSetting") pdfSetting: any;
  @ViewChild("headerFile") headerFile: any;
  @ViewChild("footerFile") footerFile: any;

 
  uploadErrorMessage: string = "";
  isValidatedHeader: boolean = false;
  isValidatedFooter: boolean = false;
  isValidEmail: boolean = true;
  countOfSelectedColumnFn: number;
  countOfSelectedColumnSb: number;
  groupByColumnss: any = [];
  groupByColumns: any = [];
  availableInvoiceColumn: any = [];
  availableInvoiceGrpings: any = [];
  optedInAvailableInvoiceCols: any = [];
  optedInAvailableInvoiceGrps: any = [];
  optedInSelectedInvoiceGrps: any = [];
  optedInSelectedInvoiceCols: any = [];
  selectedInvoiceColumns: any = [];
  selectedInvoiceGroups: any = [];
  filterColumns: any = [];
  filterValues: any = [];
  orderByLists: any = [];
  groupByLists: any = [];
  disableOrderByPlus: Boolean = false;
  disableGroupByPlus: boolean = false;
  operationList = [[]];
  scrlToTop: Boolean = false;
  showHoursWarning : Boolean = false;
  isLayoutNameEmpty: Boolean = false;
  isNewCombinedCharge: Boolean = false;
  isLayoutNameExist: Boolean = false;
  showSuccessAlert: Boolean;
  successTextMessage: String;
  successMessage: String;
  errorMessage: String;
  isSuccessful: Boolean;
  isFailure: Boolean;
  orgList: any[];
  orgName="";
  combinedChargesForEach = ["Day", "Week", "Semi month", "Month"];
  toAdressLayout = [
    "Contact / Client / Address",
    "Client / Contact / Address",
    "Client / Address",
    "Contact / Address"
  ];
  invoiceDetail = new invoiceDetails();
  // window.onscroll = function() {scrollFunction()};

  @HostListener("window:scroll", ["$event"])
  scrollMe(event) {
    if (scrollY > 296) {
      this.scrlToTop = true;
    } else if (scrollY < 296) {
      this.scrlToTop = false;
    }
  }

  ngOnInit() {
    this.scrollToTop();
    this.getInvoiceGroupingColumns();
    this.getInvoiceColumns();
    this.getOrgAddress();
    
  }

  getOrgAddress(): any {
    this.invoiceServices.getOrgAddress().subscribe(
      data => {
      this.orgList = data;
    },
    error => {},
    () => {}
  )}

  addToExcludedRepeat(availableData, optedData, SelectedData, target) {
    if (availableData.length != 0 && optedData.length > 0) {
      for (let value of optedData) {
        SelectedData.push(value);
        for (let key in availableData) {
          if (value == availableData[key]) {
            availableData.splice(parseInt(key), 1);
          }
        }
      }
      optedData = [];
      this.optedInAvailableInvoiceCols = [];
      this.optedInAvailableInvoiceGrps = [];
      this.optedInSelectedInvoiceGrps = [];
      this.optedInSelectedInvoiceCols = [];
    }

    if (target === "grp") {
      this.invoiceDetail.selectedGroupingColumns = SelectedData;
    } else if (target === "cols") {
      this.invoiceDetail.selectedInvoiceColumns = SelectedData;
    }

    this.checkHoursSelected();
  }

  removeFromExcludedRepeat(availableData, optedData, SelectedData) {
    if (SelectedData.length != 0 && optedData.length > 0) {
      for (let value of optedData) {
        availableData.push(value);
        for (let key in SelectedData) {
          if (value == SelectedData[key]) {
            SelectedData.splice(parseInt(key), 1);
            // Order By
            let list: any = this.groupByLists;
            for (let key1 in list) {
              let t: any = JSON.parse(JSON.stringify(list[key1]));
              let t1: any = value;
              if (t1.columnName == t.columnName) {
                this.groupByLists.splice(parseInt(key1), 1);
                this.operationList.splice(parseInt(key1), 1);
              }
            }
            // Filters
            let list1: any = this.orderByLists;
            for (let key2 in list1) {
              let t: any = JSON.parse(JSON.stringify(list1[key2]));
              let tt: any = t.orderByList;
              let t1: any = value;
              if (t1.columnName === tt) {
                this.orderByLists.splice(parseInt(key2), 1);
              }
            }
          }
        }
      }
      if (this.groupByLists.length == 0) {
        this.addGroupByList(SelectedData);
      }
      if (this.orderByLists.length == 0) {
        this.addOrderByList(0, SelectedData);
      }
      optedData = [];
      this.optedInAvailableInvoiceCols = [];
      this.optedInAvailableInvoiceGrps = [];
      this.optedInSelectedInvoiceGrps = [];
      this.optedInSelectedInvoiceCols = [];
    }

    this.countOfSelectedColumnFn = SelectedData.length;
    this.countOfSelectedColumnSb = SelectedData.length;

    this.checkHoursSelected();
  } //END

  moveUp(optedColumns, selectedColumns) {
    let index = _.findLastIndex(selectedColumns, {
      columnName: optedColumns[0].columnName
      // columnDisplayName: columns[0].columnDisplayName
    });
    if (index > 0) {
      let temp = _.clone(selectedColumns[index - 1]);
      selectedColumns[index - 1] = _.clone(optedColumns[0]);
      selectedColumns[index] = temp;
    }
  }

  moveDown(optedColumns, selectedColumns) {
    let index = _.findLastIndex(selectedColumns, {
      columnName: optedColumns[0].columnName
      // columnDisplayName: columns[0].columnDisplayName
    });
    if (index != selectedColumns.length - 1) {
      let temp = _.clone(selectedColumns[index + 1]);
      selectedColumns[index + 1] = _.clone(optedColumns[0]);
      selectedColumns[index] = temp;
    }
  }

  addGroupByList(SelectedData) {
    let groupByCol: any = {
      columnName: "",
      operation: ""
    };
    this.groupByLists.push(groupByCol);
    this.countOfSelectedColumnFn = this.countOfSelectedColumnFn - 1;
    let temp = -this.countOfSelectedColumnFn;
    if (SelectedData.length == temp) {
      this.disableGroupByPlus = true;
    } else this.disableGroupByPlus = false;
  }

  addOrderByList(i, SelectedData) {
    let orderByCol: any = {
      orderByList: ""
    };
    this.orderByLists.push(orderByCol);
    this.countOfSelectedColumnSb = this.countOfSelectedColumnSb - 1;

    let temp = -this.countOfSelectedColumnSb;
    if (SelectedData.length == temp) {
      this.disableOrderByPlus = true;
    } else this.disableOrderByPlus = false;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  scrolling(target: String) {
    switch (target.toLowerCase()) {
      case "general":
        this.general.nativeElement.scrollIntoView();
        break;
      case "invoice columns":
        this.invoicColumns.nativeElement.scrollIntoView();
        break;
      case "invoice groupings":
        this.invoiceGrp.nativeElement.scrollIntoView();
        break;
      case "combine charges":
        this.combineChrges.nativeElement.scrollIntoView();
        break;
      case "others":
        this.others.nativeElement.scrollIntoView();
        break;
      case "logo settings":
        this.logoSetting.nativeElement.scrollIntoView();
        break;
      case "footer settings":
        this.footerSetting.nativeElement.scrollIntoView();
        break;
      case "pdf":
        this.pdfSetting.nativeElement.scrollIntoView();
        break;
      default:
        console.log("Sorry!!!  not found...");
    }
  }

  //to get list of invoice groups
  getInvoiceGroupingColumns() {
    this.invoiceServices.getInvoiceGroupingColumns().subscribe(resp => {
      this.availableInvoiceGrpings = resp;
    });
  }

  //to get list of invoice
  getInvoiceColumns() {
    this.invoiceServices.getInvoiceColumns().subscribe(resp => {
      this.availableInvoiceColumn = resp;
    });
  }

  detectFiles(event: any, target) {
    let temp;
    if (this.validateFile(event.target.files[0].name)) {
      this.addFile(event.target.files[0], target);
      if (target == "header") this.headerFile.nativeElement.value = "";
      if (target == "footer") this.footerFile.nativeElement.value = "";
    }
  }

  addFile(file, target) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let attachmentUrl;
    reader.onload = (e: any) => {
      attachmentUrl = reader.result;
    };

    reader.onloadend = (e: any) => {
      if (target === "header") {
        console.log("Header called");
        this.isValidatedHeader = true;
        this.invoiceDetail.headerLogoFileContent = attachmentUrl.substring(
          attachmentUrl.indexOf(",") + 1
        );
        this.invoiceDetail.headerLogoFileName = file.name;
        this.invoiceDetail.headerLogoFileType = file.type;
      }

      if (target === "footer") {
        console.log("footer called");
        this.isValidatedFooter = true;
        this.invoiceDetail.footerLogoFileContent = attachmentUrl.substring(
          attachmentUrl.indexOf(",") + 1
        );
        this.invoiceDetail.footerLogoFileName = file.name;
        this.invoiceDetail.footerLogoFileType = file.type;
      }
    };
  }

  removeFile(target) {
    if (target === "header") {
      this.isValidatedHeader = false;
      this.invoiceDetail.headerLogoFileContent = "";
      this.invoiceDetail.headerLogoFileName = "";
      this.invoiceDetail.headerLogoFileType = "";
    } else if (target === "footer") {
      this.isValidatedFooter = false;
      this.invoiceDetail.footerLogoFileContent = "";
      this.invoiceDetail.footerLogoFileName = "";
      this.invoiceDetail.footerLogoFileType = "";
    }
  }

  isInValidFormat: Boolean = false;
  validateFile(name: string): Boolean {
    console.log(this.selectedInvoiceGroups);
    let ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return true;
    } else {
      this.isInValidFormat = true;
      let ref = this;
      setTimeout(function() {
        ref.isInValidFormat = false;
      }, 3000);
      return false;
    }
  }

  orgAdrsChange(orgName) {
    this.orgList.forEach(e => {
      if (orgName == e.orgName) {
        this.invoiceDetail.fromAddress = e.orgAddress;
      }
    });
  }

  checkHoursSelected() {
    if (this.invoiceDetail.isIncludeHoursTotal &&  this.invoiceDetail.selectedInvoiceColumns.length>0) {
      this.invoiceDetail.selectedInvoiceColumns.forEach(element => {
        if(element && element['columnId']==14){
          console.log(element,"Hours selected");
          this.showHoursWarning =false;
        }else{
          this.showHoursWarning =true;
          console.log(element,"Hours Not selected");
        }
      });
    }
    if(this.invoiceDetail.isIncludeHoursTotal &&  this.invoiceDetail.selectedInvoiceColumns.length==0){
      this.showHoursWarning =true;
    }
    if(!this.invoiceDetail.isIncludeHoursTotal){
      this.showHoursWarning =false;
      console.log("Hours Not selected");
    }
  }

  validate(): Boolean {
    // if invoice column length is not 0 or layout name not empty and not taken then validation fails
    if (
      this.invoiceDetail.selectedInvoiceColumns.length != 0 &&
      !this.isLayoutNameExist &&
      this.invoiceDetail.invoiceLayoutName != ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  save() {
    if(!this.invoiceDetail.isCombineServices || !this.invoiceDetail.isCombineExpenses){
      this.invoiceDetail.combineChargeBy = ""
    }
    console.log(this.invoiceDetail);
    if (this.validate()) {
      this.invoiceServices
        .createNewDynamicInvoice(this.invoiceDetail)
        .subscribe(
          data => {
            console.log(data);
            if (data.status == "success") {
              this.successTextMessage = "Invoice layout created successfully. ";
              this.showSuccessAlert = true;
              this.router.navigate(
                [
                  "/invoice/listOfDynamicInvoiceTemplate",
                  { p1: this.showSuccessAlert, p2: this.successTextMessage }
                ],
                { relativeTo: this.route }
              );
            } else {
              console.log("sorry bhai");
              this.scrollToTop();
              this.isFailure = true;
              this.errorMessage = "Unable to create invoice layout. ";
              let ref = this;
              setTimeout(function() {
                ref.isFailure = false;
              }, 5000);
            }
          },
          error => {
            console.log("Something went wrong..", error);
          },
          () => {}
        );
    } else console.log("");
  }

  checkLayoutAvailablity() {
    console.log("checking...");
    if (this.invoiceDetail.invoiceLayoutName != "") {
      this.isLayoutNameEmpty = false;
      this.invoiceServices
        .invoiceLayoutNameAvailability(this.invoiceDetail.invoiceLayoutName)
        .subscribe(data => {
          let TemplateNameExists = data.message;
          this.isLayoutNameExist = TemplateNameExists === "true" ? true : false;
        });
    } else {
      this.isLayoutNameEmpty = true;
    }
  }

  onCancel() {
    this.router.navigate(["/invoice/listOfDynamicInvoiceTemplate"], {
      relativeTo: this.route
    });
  }


  doCombinedCharge = false;
  enableCombineCharge(){
    if(this.invoiceDetail.isCombineServices || this.invoiceDetail.isCombineExpenses){
      this.doCombinedCharge = true
    }else  this.doCombinedCharge = false
  }

  validateEmail(){
    if(this.invoiceDetail.fromEmail.includes("@") && !this.invoiceDetail.fromEmail.split("@")[1].includes(".")){
      this.isValidEmail = false;
    }else this.isValidEmail = true
  }
}
