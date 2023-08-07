import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;


@Component({
  selector: 'app-show-history-component',
  templateUrl: './show-history-component.component.html',
  styleUrls: ['./show-history-component.component.css']
})
export class ShowHistoryComponentComponent implements OnInit {
  @Input() epmsEmpDetId;
  historyInfo=[];
  flag=false;
  showHistoryModal=false;
  constructor(
    public activeModal: NgbActiveModal,
    private apprisalService: AppraisalService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    $('#loadModal').modal('show');
    this.getHistoryInfo();
  }

  getHistoryInfo(): void {
    this.apprisalService.getHistoryInfo(this.epmsEmpDetId).subscribe((response) => {
      this.showHistoryModal=true;
      $('#loadModal').modal('hide');
        this.historyInfo=response;
    },
      (error) => {
        this.showHistoryModal=true;
        $('#loadModal').modal('hide');
        this.handleError(error);
      }
    );

  }
  handleError(error): void {
    const errorInfo = JSON.parse(error['_body']);
    if(errorInfo['developerMessage']){
      this.toastr.error(errorInfo['developerMessage']);
    }
    
  }
  sortBy(key) {
    this.flag=!this.flag;
    if (this.historyInfo) {
      if(this.flag){
        this.historyInfo.sort((a, b) => {
          if (a[key] > b[key]) return 1;
          if (a[key] < b[key]) return -1;
          return 0;
        });
      }else{
        this.historyInfo.sort((a, b) => {
          if (a[key] > b[key]) return 1;
          if (a[key] < b[key]) return -1;
          return 0;
        }).reverse();
      }
      

    }
  }


}
