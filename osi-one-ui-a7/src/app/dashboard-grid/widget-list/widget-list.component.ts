import { Component, OnInit, Injector } from '@angular/core';
import { GridService } from '../grid.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalOptions } from 'ngx-bootstrap';
import { AppConstants } from '../../shared/app-constants';
import { ToastrService } from 'ngx-toastr';
import { CommonUtilities } from '../../shared/utilities';

// duration for which new icon is shown beside widget label in widget settings modal
const NEW_ICON_VISIBILITY_PERIOD_IN_WEEKS = 2;

@Component({
  selector: 'app-widget-list',
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.css']
})
export class WidgetListComponent implements OnInit {
  checklist: any = [];
  deleteList: any = [];
  checkedList: any = [];
  widgetList: any = [];
  dashboardDirty: boolean;
  spinner: boolean;
  widList: any = [];
  widgetsByCategory: any = [];
  loading: boolean;
  compList: any = [];
  dashBoardType: any;

  constructor(
    private router: Router,
    private gridService: GridService,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private injector: Injector,
    public inputData: ModalOptions,
    private toasterService: ToastrService,
    private commonUtilities: CommonUtilities
  ) {
  }

  ngOnInit() {
    // this.getWidgetsList();
    this.checklist = this.widList;
    this.checkedList = [];
    this.deleteList = [];
    this.widgetList = [];
    this.compList = this.inputData['data'] ? this.inputData['data'] : [];
    this.dashBoardType = this.inputData['dashBoardType'];
    if (this.compList)
      this.getWidgetsEmpList();
  }

  getWidgetsList(): void {
    this.spinner = true;
    this.gridService.getEmpWidgets().subscribe((res) => {
      this.spinner = false;
      this.compList = res;
      this.getWidgetsEmpList();
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting widget list!');
    });
  }

  getWidgetsEmpList(): any {
    this.spinner = true;
    this.gridService.getWidgetsList().subscribe((response) => {
      this.spinner = false;
      this.dashboardDirty = false;
      console.log('all widgets ----', this.dashBoardType, response);
      if (this.dashBoardType === "Home") {
        this.widList = this.filterWidgetListBasedOnRoles(response);
      } else {
        this.widList = response;
      }
      this.setNewIconVisibility();
      if (this.compList && this.compList.length > 0) {
        this.widList.forEach((ele1) => {
          this.compList.forEach((ele) => {
            if (ele.isVisible && ele.widget.id === ele1.id) {
              ele1.isSelected = true;
              ele.isSelected = true;
            }
          })
        })
      }
      let categoriesList = [];

      this.widList.forEach((item) => {
        categoriesList.push(item.category);
      });

      Array.from(new Set(categoriesList)).forEach((item: any) => {
        let obj: any = {};
        let widObj: any = [];
        let widget = this.widList.filter((widItem: any) => {
          if (widItem.dashboardType === this.dashBoardType)
            return widItem.category == item;
        });
        widObj.push(widget);
        obj['category'] = item;
        obj['widget'] = widObj;
        this.widgetsByCategory.push(obj);
      });
      console.log('this.widgetsByCategory-----', this.widgetsByCategory);
      this.widgetsByCategory.sort((a, b) => a.category < b.category ? -1 : a.category > b.category ? 1 : 0)
    }, (errorResponse) => {
      this.spinner = false;
      this.toasterService.error('Error Occured While Getting widget list data!');
    });
  }


  filterWidgetListBasedOnRoles(response) {
    const { practice, subPractice, grade, id } = JSON.parse(localStorage.getItem('userDetails'));
    return response.filter(item => {
      if (item.dashboardType === "Home") {
        if (!item.roles) {
          return true;
        } else {
          const { practices, subPractices, grades, users } = JSON.parse(item.roles);
          return this.isValueExist(practices, practice) || this.isValueExist(subPractices, subPractice) || this.isValueExist(grades, grade)
            || this.isValueExist(users, id);
        }
      }
    })
  }

  isValueExist(arr, val) {
    return arr.indexOf(val) > -1;
  }

  reset(): void {
    this.modal.close();
  }

  save(): any {
    this.dashboardDirty = true;
    this.widgetList = this.checkedList;
    this.loading = true;
    this.compList.forEach((ele) => {
      this.widgetList.forEach((ele1) => {
        if (ele1.isSelected && ele.widget && ele.widget.id === ele1.id) {
          ele1.updateId = ele.id;
        }
      });
    });
    this.compList.forEach((ele) => {
      this.deleteList.forEach((ele1) => {
        if (!ele1.isSelected && ele.widget && ele.widget.id === ele1.id) {
          ele1.updateId = ele.id;
        }
      });
    });

    this.deleteList.forEach((ele) => {
      this.widgetList.push(ele);
    });

    for (let i = 0; i < this.widgetList.length; i++) {
      const obj = {
        'widgetCol': i + 1,
        'seqNum': i + 1,
        // 'thumbnailUri': this.getWidgetName(this.widgetList[i].name),
        'isVisible': this.widgetList[i].isSelected ? true : false,
        'widget': {
          'id': this.widgetList[i]['id'] ? this.widgetList[i]['id'] : null,
        }
      };

      if (this.dashBoardType === 'Analytics') {
        obj['thumbnailUri'] = this.getWidgetName(this.widgetList[i].name);
      }

      if (this.widgetList[i].updateId) {
        obj['id'] = this.widgetList[i].updateId;
      }
      this.gridService.createWidget(obj).subscribe(requestService => {
        if (requestService.seqNum === this.widgetList.length) {
          this.modal.close(true);
        }
      }, (err) => {
        this.dashboardDirty = false;
        this.toasterService.error('Error Occured While saving widgets!');
        this.modal.close(true);
      }
      );
    }
  }

  isSelected(value: string, id: number): any {
    this.dashboardDirty = false;
    this.checklist = value;
    this.deleteList.forEach((val) => {
      if (val.id == this.checklist.id) {
        const x = this.deleteList.findIndex(y => y.id === id);
        this.deleteList.splice(x, 1);

      }
    });
    this.checkedList.forEach((val) => {
      if (val.id === this.checklist.id) {
        const x = this.checkedList.findIndex(y => y.id === id);
        this.checkedList.splice(x, 1);

      }
    });
    if (this.checklist.isSelected) {
      this.checkedList.push(this.checklist);
    } else {
      this.deleteList.push(this.checklist);
    }
    this.dashboardDirty = true;
  }

  getWidgetName(name: string) {
    const uid = localStorage.getItem('userId');
    name = (name).replace(/ /g, '');
    return `${name}_${uid}.png`;
  }

  /* sets visibility of new icon beside each widget label in widget settings modal
  * If widget is <= 2 weeks old, new icon is shown else not shown */
  setNewIconVisibility(): void {

    let timeDifferenceInWeeks: number = null;

    for (let eachWidget of this.widList) {

      timeDifferenceInWeeks = this
        .commonUtilities
        .getTimeDifferenceInWeeks(eachWidget.createdOn, Date.now());

      eachWidget.showNewIcon = timeDifferenceInWeeks <= NEW_ICON_VISIBILITY_PERIOD_IN_WEEKS;
    }
  }
}
