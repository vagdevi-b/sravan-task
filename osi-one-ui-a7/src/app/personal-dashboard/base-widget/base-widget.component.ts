import { Component, OnInit, Input, ViewContainerRef, ViewChild, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { TableWidgetComponent } from '../table-widget/table-widget.component';
import { Router } from '@angular/router';

const components: { [type: string]: any } = {
  Table: TableWidgetComponent
};

@Component({
  selector: 'app-base-widget',
  templateUrl: './base-widget.component.html',
  styleUrls: ['./base-widget.component.css']
})
export class BaseWidgetComponent implements OnInit {
  @Input() widgetData;
  @ViewChild('widgetBody', { read: ViewContainerRef }) widgetHost: ViewContainerRef;
  @Output() changeTimeSheetApproveBy: EventEmitter<any> = new EventEmitter();
  @Output() removeCurrentWidget: EventEmitter<any> = new EventEmitter();
  @Output() getWeeklyProjectStatus: EventEmitter<any> = new EventEmitter();
  componentInstance: any;
  currentWeekRange;
  selectedDate;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private router:Router) { }

  ngOnInit() {
    const { name } = this.widgetData.widget;
    if (name === 'Weekly Project Status') {
      this.setCurrentWeekRange(new Date(), false);
    }
  }

  ngAfterViewInit(): void {
    this.loadComponent();
  }

  loadComponent(): void {
    const adItem = this.widgetData;
    if (adItem && adItem.widget.type !== 'banner') {
      try {
        const component = this.componentFactoryResolver.resolveComponentFactory(components[adItem.widget.type]);
        this.componentInstance = this.widgetHost.createComponent(component);
        this.componentInstance.instance['config'] = adItem;
      } catch (e) {
        console.log('There was an error loading components on dashboard');
      }
    }
  }

  timeSheetApproveClick(type) {
    this.changeTimeSheetApproveBy.emit(type);
  }

  onNewBtnClick(widgetName) {
    if(widgetName === 'My Leaves') {
      this.router.navigate(['leaves/leaverequest']);
    }
  }

  removeWidget() {
    this.removeCurrentWidget.emit(this.widgetData);
  }

  setCurrentWeekRange(selectedDate, shouldUpdateWeeklyProjectStatus) {
    const diff = selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1);
    const day = new Date(selectedDate.setDate(diff));
    const lastday = selectedDate.getDate() - (selectedDate.getDay() - 1) + 6;
    const formattedLastDate = new Date(selectedDate.setDate(lastday)).toLocaleDateString();
    const firstDay = day.toLocaleDateString();

    this.currentWeekRange = firstDay + " - " + formattedLastDate;
    if(shouldUpdateWeeklyProjectStatus){
      this.getWeeklyProjectStatus.emit(firstDay);
    }    
  }

  onDateChange() {
    this.setCurrentWeekRange(this.selectedDate, true);
  }

}
