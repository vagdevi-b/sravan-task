import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequistionsService } from '../../../shared/services/requistions.service';
import * as Chart from 'chart.js';
declare let $: any;
@Component({
  selector: 'app-dashboardpage',
  templateUrl: './dashboardpage.component.html',
  styleUrls: ['../../../../assets/css/light.css']
})
export class DashboardpageComponent implements OnInit {
  requestsTableHeaders: any = [];
  requestsTableData: any = [];
  scheduledInterviewsHeaders: any = [];
  scheduledInterviewsData: any = [];
  ApplicationSourceHeaders: any = [];
  ApplicationSourceData: any = [];
  approved: Chart;
  inProcess: Chart;
  rejected: Chart;
  parentChart: Chart;
  constructor(private reqSvc: RequistionsService, private toastr: ToastrService) { }

  ngOnInit() {
    this.requestsTableHeaders = ['Request Number', 'Job Title', '# Positions', 'Submitted On', 'Status'];
    this.scheduledInterviewsHeaders = ['Request Number', 'Applicant Name', 'Job Title', 'Scheduled Date & Time', 'Interview Mode', 'Status'];
    this.ApplicationSourceHeaders = ['Source', '#Hired', '%Hired'];
    this.getRequestsTableData();
    //this.parentValueChart();
    
  }

  getRequestsTableData() {
    this.requestsTableData = [];
    $('#loadingEditSubmitModal').modal('show');
    this.reqSvc.getAllRequistions().subscribe(response => {
      if (response.length === 0 || response === null) {
        $('#loadingEditSubmitModal').modal('hide');
        this.toastr.success('No Data Found');
      } else {
        this.setTableData(response);
        $('#loadingEditSubmitModal').modal('hide');
      }


    }, err => {
      console.log(err);
      $('#loadingEditSubmitModal').modal('hide');
    })
  }

  setTableData(data) {
    let isAssigned = true;
    let approvedCount=0,inProcessCount=0,rejectedCount=0,total=0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].assignTo === null) {
        isAssigned = false;
      } else {
        isAssigned = true;
      }
      if(data[i].status === 'APPROVED'){
        approvedCount = approvedCount + 1;
      }else if(data[i].status === 'IN PrOCESS'){
        inProcessCount = inProcessCount + 1;
      }else if(data[i].status === 'REJECTED'){
        rejectedCount = rejectedCount + 1;
      }
      //total =  data[i].vendors + data[i].partners + data[i].teamHrSource + data[i].empReferal + data[i].walkins;
      let obj = {
        'Id': data[i].id,
        'Request Number': data[i].externalRefId,
        'Job Title': data[i].jobTitle === null ? data[i].position : data[i].jobTitle + ' - ' + data[i].level + data[i].grade,
        '# Positions': data[i].noofPositions,
        'Job Details': data[i].jobDescription,
        'Submitted On': data[i].requesitionDate,
        'Status': data[i].status,
        'Assigned To': data[i].assignTo,
        'Location': data[i].location,
        'Target Date': data[i].targetDate,
        'Priority': data[i].priority,
        'Request Type': data[i].requisitionType === null ? 'New Position' : data[i].requisitionType,
        'Billability': data[i].billability,
        'Level': data[i].level + data[i].grade,
        'BU & Functional': data[i].bu + ' / ' + data[i].externalRefSubpractice,
        'jobType': data[i].jobTypes === null ? "Full Time" : data[i].jobTypes,
        'isAssigned': isAssigned,
        'profileSourceCount': [],
        'Action': ''
      }
      this.requestsTableData.push(obj);
    }
    total = approvedCount + inProcessCount + rejectedCount;
    this.showApproved(approvedCount,total);
    this.showInProcess(inProcessCount,total);
    this.showRejected(rejectedCount,total);
  }

  getScheduledInterviewData() { }

  //doughnut charts
  showApproved(data,total) {
    if (this.approved) {
      this.approved.destroy();
    }

    this.approved = new Chart('approved', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Approved',
          data: [data, total-data],
          backgroundColor: [
            '#22b788',
            '#dee1e4',
          ],
          borderColor: [
            '#22b788',
            '#dee1e4',
          ],
          borderWidth: 1
        }]
      },
      options: {
        cutoutPercentage: 60,
        responsive: false,
        tooltips: true,
        labels: false,
        elements: {
          center: {
            width: 150,
            height: 150,
            value: data,
            bgColor: '#38be6a',
            textColor: '#ffffff'
          }
        }

      }
    });
  }

  showInProcess(data,total) {
    if (this.inProcess) {
      this.inProcess.destroy();
    }
    this.inProcess = new Chart('inProcess', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Approved',
          data: [data, total-data],
          backgroundColor: [
            '#f19028',
            '#cacdd1',

          ],
          borderColor: [
            '#f19028',
            '#cacdd1',

          ],
          borderWidth: 1
        }]
      },
      options: {
        cutoutPercentage: 60,
        responsive: false,
        tooltips: true,
        labels: false,
        elements: {
          center: {
            width: 150,
            height: 150,
            value: data,
            bgColor: '#f37734',
            textColor: '#ffffff'
          }
        }

      }
    });
  }

  showRejected(data,total) {
    if (this.rejected) {
      this.rejected.destroy();
    }
    //let ctx = document.getElementById("rejected");
    this.rejected = new Chart('rejected', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Approved',
          data: [data, total-data],
          backgroundColor: [

            '#ea4256',
            '#d8dcdf',
          ],
          borderColor: [

            '#ea4256',
            '#d8dcdf',
          ],
          borderWidth: 1
        }]
      },
      options: {
        cutoutPercentage: 60,
        responsive: false,
        tooltips: true,
        labels: false,
        elements: {
          center: {
            width: 150,
            height: 150,
            value: data,
            bgColor: '#d5343d',
            textColor: '#ffffff'
          }
        }

      }
    });
  }

  parentValueChart() {
    if (this.parentChart) {
      this.parentChart.destroy();
    }
    //let ctx = document.getElementById("rejected");
    this.parentChart = new Chart('parentChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          label: 'Approved',
          data: [70, 20, 10],
          backgroundColor: [
            '#22b788',
            '#f37734',
            '#d5343d',
          ],
          borderColor: [
            '#22b788',
            '#f37734',
            '#d5343d',
          ],
          borderWidth: 1
        }]
      },
      options: {
        cutoutPercentage: 50,
        responsive: false,
        tooltips: false,
        labels: false,
        options: {
          innerRadius: '20%',
          
        },
        elements: {
          center: {
            width: 200,
            height: 150,
            value: 'Job Requistions',
            bgColor: '#ffffff',
            textColor: '#313641'
          }
        }

      }
    });
}

}

Chart.pluginService.register({
  beforeDraw: function (chart) {
    let centerConfig = chart.config.options.elements.center;
    let width = centerConfig.width,
      height = centerConfig.height,
      ctx = chart.chart.ctx;

    ctx.restore();
    let fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";
    ctx.arc(width / 2, height / 2, 55, 0, 2 * Math.PI);
    ctx.fillStyle = centerConfig.bgColor;
    ctx.fill();
    let text = centerConfig.value,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;
    ctx.fillStyle = centerConfig.textColor;
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});