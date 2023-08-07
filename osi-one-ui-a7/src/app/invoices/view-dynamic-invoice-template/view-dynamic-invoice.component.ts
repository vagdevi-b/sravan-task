import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { JsonObject, JsonArray } from "@angular-devkit/core";
import * as _ from "underscore";
import { InvoiceServices } from "./../../shared/services/invoice-services.service";
import { invoiceDetails } from "./../create-dynamic-invoice-template/invoice-details";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-view-dynamic-invoice',
  templateUrl: './view-dynamic-invoice.component.html',
  styleUrls: ['./view-dynamic-invoice.component.css']
})
export class ViewDynamicInvoiceComponent implements OnInit {

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


  orgName : String="";
  orgList:any[]=[];
  invoiceId: number;
  uploadErrorMessage: string = "";
  isValidatedHeader: boolean = false;
  isValidatedFooter: boolean = false;
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
  isNewCombinedCharge: Boolean = false;
  isLayoutNameExist: Boolean = false;
  initialLayoutName: String;
  isEditableField = false;

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
    this.invoiceId = parseInt(this.route.snapshot.paramMap.get("invoiceId"));
    this.getInvoiceDetails(this.invoiceId);
    this.setTheFields();
    // this.getOrgAddress();
  }

  
  getInvoiceDetails(invoiceId): any {
    this.invoiceServices.getInvoiceDetailById(invoiceId).subscribe(
      data => {
        this.invoiceDetail = data;
        console.log(this.invoiceDetail.invoiceLayoutId);
        this.initialLayoutName = this.invoiceDetail.invoiceLayoutName;
        this.isLayoutNameEmpty = false
        console.log(this.invoiceDetail);
        this.setTheFields();
      },
      error => {},
      () => {
        this.getInvoiceGroupingColumns();
      }
    );
  }

  orgAdrsChange(orgName){
    this.orgList.forEach(e => {
      if(orgName== e.orgName){
        this.invoiceDetail.fromAddress= e.orgAddress
      }
    })
    
  }


  
  setTheFields() {
    if (this.invoiceDetail.combineChargeBy == "") {
      this.isNewCombinedCharge = false;
      this.invoiceDetail.combineChargeBy = "Day";
    } else {
      this.isNewCombinedCharge = true;
    }

    this.orgName = this.invoiceDetail.fromAddress.split(".")[0]
  }


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
    console.log(this.selectedInvoiceColumns);
    console.log(this.selectedInvoiceGroups);
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
  } //END

  moveUp(optedColumns, selectedColumns) {
    console.log(optedColumns);
    console.log(selectedColumns);

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
      selectedColumns[index + 1] = _.clone(selectedColumns[0]);
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
    console.log(target);

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
    this.invoiceServices.getInvoiceGroupingColumns().subscribe(
      resp => {
        this.availableInvoiceGrpings = resp;
        console.log(this.availableInvoiceColumn);
      },
      error => {},
      () => {
        this.getInvoiceColumns();
        let selectedLength = this.invoiceDetail.selectedGroupingColumns.length;
        let availableDataLength = this.availableInvoiceGrpings.length;
        for (let i = 0; i < selectedLength; i++) {
          for (let j = 0; j < availableDataLength; j++) {
            if (
              this.availableInvoiceGrpings[j]["columnId"] ==
              this.invoiceDetail.selectedGroupingColumns[i]["columnId"]
            ) {
              this.availableInvoiceGrpings.splice(j, 1);
              break;
            }
          }
        }
      }
    );
  }

  //to get list of invoice
  getInvoiceColumns() {
    this.invoiceServices.getInvoiceColumns().subscribe(
      resp => {
        this.availableInvoiceColumn = resp;
        console.log(this.availableInvoiceGrpings);
      },
      error => {},
      () => {
        let selectedLength = this.invoiceDetail.selectedInvoiceColumns.length;
        let availableDataLength = this.availableInvoiceColumn.length;
        for (let i = 0; i < selectedLength; i++) {
          for (let j = 0; j < availableDataLength; j++) {
            if (
              this.availableInvoiceColumn[j]["columnId"] ==
              this.invoiceDetail.selectedInvoiceColumns[i]["columnId"]
            ) {
              this.availableInvoiceColumn.splice(j, 1);
              break;
            }
          }
        }
      }
    );
  }

  validateFile(name: string): Boolean {
    console.log(this.selectedInvoiceGroups);
    let ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return true;
    } else {
      return false;
    }
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

  isLayoutNameEmpty: Boolean = false;
  checkLayoutAvailablity() {
    console.log("checking...");
    if (
      this.invoiceDetail.invoiceLayoutName != "" &&
      this.initialLayoutName.toLowerCase() !=
        this.invoiceDetail.invoiceLayoutName.toLowerCase()
    ) {
      this.isLayoutNameEmpty = false;
      this.invoiceServices
        .invoiceLayoutNameAvailability(this.invoiceDetail.invoiceLayoutName)
        .subscribe(data => {
          let TemplateNameExists = data.message;
          this.isLayoutNameExist = TemplateNameExists === "true" ? true : false;
        });
    }

    if (this.invoiceDetail.invoiceLayoutName == "") {
      this.isLayoutNameEmpty = true;
    }

    if (this.initialLayoutName == this.invoiceDetail.invoiceLayoutName) {
      // do nothing..
    }
  }

  update() {
    if (!this.isNewCombinedCharge) this.invoiceDetail.combineChargeBy = "";
    console.log(this.invoiceDetail);
    if (this.validate()) {
      this.invoiceServices
        .editOldInvoice(this.invoiceDetail)
        .subscribe(data => {
          console.log(data);
          error => {
            console.log("record not updated, Something went wrong..", error);
          };
          () => {
            this.router.navigate(['/invoice/listOfDynamicInvoiceTemplate'], { relativeTo: this.route });
          };
        });
    } else {
      console.log("validation failed during update...");
    }
  }

  
  onCancel() {
    this.router.navigate(['/invoice/listOfDynamicInvoiceTemplate'], { relativeTo: this.route });
  }

}

