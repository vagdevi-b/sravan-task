import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap';
import { Observer, Observable, Subscription } from 'rxjs';
import { GridService } from '../grid.service';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../shared/app-constants';
// const html2canvas = require('html2canvas');
// import { toPng, toJpeg } from 'html-to-image';
import domtoimage from 'dom-to-image';
const domtoimage = require('dom-to-image');
// declare let html2canvas: any;

@Component({
  selector: 'app-reports-modal',
  templateUrl: './reports-modal.component.html',
  styleUrls: ['./reports-modal.component.css']
})
export class ReportsModalComponent implements OnInit {
  capturedImage: any;
  blobImage: any;
  dashboardImages = AppConstants.dashboardImages;
  reportsToDisplay: String;
  title: string;
  spinner = false;
  reportType: any;
  empWidgetData: any;
  filterData: Subscription;
  filters: any;
  empReportId: any;
  isPageLoaded: boolean;

  constructor(
    public modal: NgbActiveModal,
    public modalData: ModalOptions,
    private gridService: GridService,
    private toasterService: ToastrService
  ) {
    this.empWidgetData = modalData['data'];
    this.reportsToDisplay = modalData['data']['widget'].name;
    this.reportType = modalData['data']['widget'].type;
    this.gridService.setWidgetId(this.empWidgetData['widget'].id);
    this.gridService.getEmpReportByWidgetId(this.empWidgetData['widget'].id).subscribe((res) => {
      this.empReportId = res ? res['id'] : null;

    }, (errorResponse) => {
      this.spinner = false;
      // this.toasterService.error('Error occured while getting employee report data!');
    });
  }

  ngOnInit() {
  }

  closeModal(): void {
    /* screen captured will done, only once data is loaded
    If user try to close modal, before page gets loaded, then screen will not capture */
    this.fileImportMethod();
    /* if (this.isPageLoaded) {
      // const node = document.querySelector("#htmle2imagedata")
      // document.getElementById('htmle2imagedata');

    } else {
      this.modal.close();
    } */
  }

  saveEmployeeReport(): any {
    this.filters = this.gridService.getFilters();
    const widgetType = (this.empWidgetData['widget'].type).toUpperCase();

    if (this.empWidgetData) {
      const obj = {
        'dashboardName': this.empWidgetData['widget'].name,
        'title': this.empWidgetData['widget'].name,
        'dashbardDesc': `Dashboard report for ${this.empWidgetData['widget'].name}-${widgetType}`,
        'filters': this.filters ? JSON.stringify(this.filters) : '{}',
        'empId': this.empWidgetData.empId,
        'widget': { 'id': this.empWidgetData['widget'].id },
        'id': this.empReportId ? this.empReportId : null
      };
      this.spinner = true;
      this.gridService.saveEmployeeReport(obj).subscribe((res) => {
      }, (errorResponse) => {
        this.spinner = false;
        this.toasterService.error('Error occured while saving employee report!');
      });
    }

    this.gridService.setFilters('');
  }

  CaptureImage($event) {
    const ele = document.getElementById('htmle2imagedata');
    if ($event) {
      setTimeout(() => {
        domtoimage.toPng(ele, {height: 600, quality: 0.95, bgcolor: '#ffffff', skipFonts: true})
          .then((dataUrl) => {
            this.capturedImage = dataUrl;
          });
      }, 2000);
    }
  }

  /* CaptureImage1($event) {
    if ($event) {
      setTimeout(() => {
        const canvasPic = document.getElementById('htmle2imagedata');
        html2canvas(canvasPic,
          {
            logging: false,
            allowTaint: false
          }
        ).then(canvas => {
          this.capturedImage = canvas.toDataURL('image/svg');
          console.log('image captured');
        });
      }, 2000);
    }
  } */
  /*  {
            scrollX: 0,
            height: 1524,
            letterRendering: 1,
            allowTaint: false,
            useCORS: true
        } */


  fileImportMethod() {
    this.spinner = true;
    if (this.capturedImage) {
      const uid = localStorage.getItem('userId');
      const widgetName = (this.modalData['data']['widget'].name).replace(/ /g, ''); // widgetId
      const imageName = `${widgetName}_${uid}.png`;
      console.log(imageName);
      const arrData = {
        idx: this.modalData['data'].index,
        image: this.capturedImage
      };
      this.spinner = false;
      this.gridService.setThumbnail(arrData);
      this.modal.close();
      const imageBlob = this.dataURItoBlob(this.capturedImage);
      // const imageBlob: Blob = blob;
      this.saveEmployeeReport();
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
      this.gridService.uploadFile(imageFile).subscribe(res => { },
        () => { });



      /* const blob = new Blob([this.blobImage], { type: 'image/png' });
      const imageFile = new File([blob], imageName, { type: 'image/png' }); */

    } else {
      this.modal.close();
    }

    /* html2canvas(selectorID)
      .then((canvas) => {
        const arrData = {
          idx: this.modalData['data'].index,
          image: canvas.toDataURL()
        };
        this.gridService.setThumbnail(arrData);
        this.modal.close();

        const blob = new Blob([canvas], { type: 'image/png' });

        this.saveEmployeeReport();
        const imageFile = new File([blob], imageName, { type: 'image/png' });
        this.gridService.uploadFile(imageFile).subscribe(res => { },
          () => { });
      })
      .catch(() => {
        this.modal.close();
      }); */
  }

  dataURItoBlob(dataurl: string) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });

    /* return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/png' });
      observer.next(blob);
      observer.complete();
    }); */
  }

}
