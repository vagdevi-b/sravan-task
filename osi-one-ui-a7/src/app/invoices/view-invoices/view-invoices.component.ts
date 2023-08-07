import { Component, OnInit } from '@angular/core';
import { InvoiceServices } from '../../shared/services/invoice-services.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConstants } from '../../shared/app-constants';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.css']
})
export class ViewInvoicesComponent implements OnInit {

  public columnDefs: any[];
  public rowSelection;
  public rowData;
  public errorMessage;
  public pageCount;
  public gridApi;
  public gridColumnApi;
  public paginationPageSize;
  public invoicePreviewPath;
  userId: any;
  projects: any;
  invoicesForm: FormGroup;
  newInvoicePreviewPath: any;
  activeDocumnets: Boolean = false;
  activeInvoice: Boolean = false;
  attachmentLists: any;
  page: Number = 1;
  cnt: Number = 10;
  osiattachmentsdto: any;
  imageurl = AppConstants.imageurl;

  constructor(private invoiceServices: InvoiceServices, 
    private toasterService: ToastrService, private sanitizer: DomSanitizer, private formBuilder: FormBuilder) {
    this.columnDefs = this.createColumnDefs();
  }

  ngOnInit() {
    this.buildForm();
    this.pageCount = 10;
    this.paginationPageSize = 10;
    this.userId = localStorage.getItem('userId');
    this.getProjectsByManager(this.userId);
   
   // this.gridApi.hideLoadingOverlay();
  }

  private buildForm(): void {
    this.invoicesForm = this.formBuilder.group({
      project: [
        ''
      ],
      catagory: ['']
    });
  }

  private createColumnDefs() {
    const columnDefs = [
      {
        headerName: 'Invoice Date',
        field: 'invoiceGeneratedDate',
        width: 150,
        autoHeight: true,
        valueFormatter: function (params) {
          return moment(params.value).format('D MMM YYYY');
        },
      },
      {
        headerName: 'Due Date',
        field: 'dueDate',
        width: 150,
        autoHeight: true,
        valueFormatter: function (params) {
          return moment(params.value).format('D MMM YYYY');
        },
      }, {
        headerName: 'Customer Name',
        field: 'customerName',
        filter: 'date',
        suppressFilter: true,
        width: 330,
        autoHeight: true
      },
      {
        headerName: 'Project Name',
        field: 'projectName',
        suppressFilter: true,
        width: 190,
        autoHeight: true,
        // valueFormatter: function (params) {
        //   const numVal = Number(params.value.split(' ')[1]);
        //   return params.value.split(' ')[0] + ' ' + numVal.toFixed(2);
        // }

      },
      {
        headerName: 'Invoice Number',
        field: 'invoiceNumber',
        suppressFilter: true,
        width: 150,
        autoHeight: true
      },
      {
        headerName: 'Invoice Template',
        field: 'invoiceTemplateName',
        filter: 'status',
        width: 250,
        autoHeight: true
      },
      {
        headerName: 'Invoice Amount',
        field: 'invoiceAmount',
        width: 150,
        autoHeight: true
      },
      {
        headerName: 'Tax Invoice Amount',
        field: 'taxableInvoiceAmount',
        filter: 'date',
        width: 150,
        autoHeight: true
      }, {
        headerName: 'Paid Amount',
        field: 'invoiceBalance',
        filter: 'date',
        suppressFilter: true,
        width: 150,
        autoHeight: true
      },
      {
        headerName: 'Balance Due',
        field: 'invoiceBalance',
        suppressFilter: true,
        width: 150,
        autoHeight: true,
        // valueFormatter: function (params) {
        //   const numVal = Number(params.value.split(' ')[1]);
        //   return params.value.split(' ')[0] + ' ' + numVal.toFixed(2);
        // }

      },
      {
        headerName: 'Invoice Status',
        field: 'invoiceStatus',
        suppressFilter: true,
        width: 170,
        autoHeight: true,
        valueFormatter: function (params) {
          let status = params.data.invoiceStatus;
          switch (status) {
            case 'O':
              status = 'Approved';
              break;
            case 'U':
              status = 'Reversed';
              break;
            case 'I':
              status = 'Invoiced';
              break;
            case 'R':
              status = 'Rejected';
              break;
            case 'N':
              status = 'Open';
              break;
             case 'W':
              status = 'Write-Off';
              break;
            case 'Z':
              status = 'Viewed';
               break;
            case 'T':
              status = 'Sent';
              break;
              case 'S':
                status = 'Submitted';
                break;
          }
          return status;
        },
      },
      {
        headerName: 'QuickBook Status',
        field: 'externalReferenceId',
        filter: 'status',
        width: 205,
        autoHeight: true
      },
      {
        headerName: 'Edit Details',
        valueFormatter: this.currencyFormatter,
        width: 150,
        autoHeight: true,
       
      }
    ];
    this.rowSelection = 'multiple';
    return columnDefs;
  }

  currencyFormatter() {
    return 'Edit';
  }

  download(item, index){
    const dlnk = <HTMLAnchorElement>document.getElementById('resume' + index);
    dlnk.setAttribute('download', item.originalFileName);
    dlnk.href = item.fileContent;
    dlnk.click();
  }

  deleteAttachment(attachmentId, filename) {

    this.osiattachmentsdto = {
      attachmentId: attachmentId,
      originalFileName: filename
    }
    $('#attachmentDeleteConfirmationModal').modal('show');
  }

  getProjectsByManager(managerId) {
    this.invoiceServices.getProjectsByManagerId(managerId).subscribe(response => {
      this.projects = response;
      console.log('Projects response-----', this.projects);
      this.projects.sort(function sortAll(a, b) {
        return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      });
      console.log('Projects response-----', this.projects);
    },
      error => this.errorMessage = <any>error);
  }

  searchInvoicesList() {
   const projectValue =  this.invoicesForm.value;
    const invoicePayload = {
      invoiceListFlag: true,
      organizationId: null,
      projectId: projectValue.project
    };

    if (projectValue.project !== '' && projectValue.catagory === '1') {
      this.activeInvoice = true;
      this.activeDocumnets = false;
      this.invoiceServices.viewInvoice(invoicePayload, this.pageCount).subscribe(response => {
        if(response.length > 0){
          this.rowData = response;
         }else{
           this.rowData = {};
          this.toasterService.warning('No Invoices found !');
         }
        
      },
        error => this.errorMessage = <any>error);
    } else if (projectValue.project !== '' && projectValue.catagory === '2') {
      this.activeDocumnets = true;
      this.activeInvoice = false;
      this.invoiceServices.viewAllAttachments('PROJECTS', projectValue.project ).subscribe(response => {
        if(response.length>0){
          for(var i = 0; i < response.length; i++) {
            // var imgurl = "http://192.168.32.63:8080/EMS-DATA/";
            // console.log(imgurl);
            response[i].fileContent = this.imageurl + 'ATTACHMENTS/PROJECTS/'+ projectValue.project +'/'+response[i].originalFileName;
          }
          this.attachmentLists = response;
      //  if(response.length > 0){
      //   this.attachmentLists = response;
       }else{
        this.attachmentLists = [];
        this.toasterService.warning('No documents found!');
       }
       
      },
        error => this.errorMessage = <any>error);
    } else if (projectValue.project !== '' && projectValue.catagory === ''){
      this.toasterService.error('Please select project category!');
    }
    else {
      this.toasterService.error('Please select project!');
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.hideOverlay();
  }

  onCellClicked(event) {
    this.previewPopup(event);
  }

  confirmedDeleteAttachment() {
    const projectValue =  this.invoicesForm.value;
      this.osiattachmentsdto.objectId = projectValue.project;
      this.osiattachmentsdto.objectType = 'PROJECTS';


      this.invoiceServices.deleteAttachment(this.osiattachmentsdto).subscribe((response) => {
        this.toasterService.success(response.message);

        this.invoiceServices.viewAllAttachments(this.osiattachmentsdto.objectType, projectValue.project).subscribe((response) => {
          if(response.length>0){
            this.toasterService.success(response.message);
            for(var i = 0; i < response.length; i++) {
              response[i].fileContent = this.imageurl + 'ATTACHMENTS/PROJECTS/'+ projectValue.project +'/'+response[i].originalFileName;
            }
            this.attachmentLists = response;
          }else{
            this.toasterService.warning('No documents found!');
          }
         
        }, (errorResponse) => {
         // this.spinner = false;
          this.toasterService.error('Failed to load documents!');
        });
  
      }, (errorResponse) => {
       // this.spinner = false;
        this.toasterService.error('Failed to load documents!');
      });
      
  }

  previewPopup(project) {
    console.log('selected Project', project.data);
    const {emsAppUrl ,imageurl } = AppConstants;
    const configDataImageURL = imageurl;
    const date = new Date();
    const dateVar = date.getTime();
    this.invoicePreviewPath = configDataImageURL +
        'INVOICES/' + project.data.orgId +
        '/' + project.data.projectId +
        '/' + 'pdf' + '/' +
        project.data.invoiceId + '.pdf?dummy=' + dateVar;
    this.newInvoicePreviewPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.invoicePreviewPath);
    $('#previewModal').modal('show');
  }

  closePreviewPopup() {
    $('#previewModal').modal('hide');
  }

}
