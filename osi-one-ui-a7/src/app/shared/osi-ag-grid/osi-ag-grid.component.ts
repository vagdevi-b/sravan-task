/**
 * Osi-Ag-Grid Component
 */

import { 
  Component, 
  Input, 
  OnInit, 
  Output,
  EventEmitter } from '@angular/core';
import {ColDef, ColumnApi, GridApi} from 'ag-grid';
import {GridOptions} from "ag-grid/main";

import { AppConstants } from '../app-constants';

@Component({
  selector: 'osi-ag-grid',
  templateUrl: './osi-ag-grid.component.html',
  styleUrls: ['./osi-ag-grid.component.css']
})
export class OsiAgGridComponent implements OnInit {
 
  @Input() gridOptions:GridOptions;
  @Input() rowData:any[];
  @Input() columnDefs:any[];
  @Input() gridApi: any;
  @Input() gridColumnApi: any;

  @Input() style: any;
  @Input() class: string;
  @Input() rowSelection;
  @Input() domLayout;
  @Input() enableColResize;
  @Input() suppressHorizontalScroll;
  @Input() suppressMovableColumns; 
  @Input() enableRangeSelection: string;
  @Input() rowHeight: number;
  @Input() enableSorting; 
  @Input() enableFilter; 
  @Input() groupHeaders;   
  
  @Input() pagination: boolean;
  @Input() paginationPageSize: number;
  @Input() paginationNumberFormatter: string;

  @Input() rowGroupPanelShow: string;
  @Input() pivotPanelShow: string;

  @Input() selector: string;
  @Input() showButtons: boolean;
  @Input() showAddButton: boolean; 
  @Input() showEditButton: boolean; 
  @Input() showViewButton: boolean; 
  @Input() showDeleteButton: boolean; 
  @Input() showCheckbox: boolean;

  @Output() sendMessage = new EventEmitter<string>();
  
  private selectedItem: string; 
  private appData = AppConstants;

  constructor() {
    
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.enableCheckbox();
  }

  onGridReady(params) {    
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.onGridSizeChanged(params);
  }

  enableCheckbox() {  
    if(this.showCheckbox === true) {
        this.columnDefs.unshift({
          headerName: '#',
          width: 10,
          checkboxSelection: true,
          suppressSorting: true,
          suppressMenu: true,
          pinned: true    
        });
    }    
  }
  
  onSelectionChanged(event) {      
    var selectedRows = this.gridApi.getSelectedRows();
    var selectedRowsString = "";
    if(this.selector === "cars") {      
      selectedRows.forEach(function(selectedRow, index) {
        if (index !== 0) {
          selectedRowsString += ", ";
        }
        selectedRowsString += selectedRow.make;
      });          
      this.selectedItem = selectedRowsString;       
    }
    // LeaveId
   // console.log(' '+this.selectedItem+" was selected");  
  }

  onRowSelected(event): void {
    if(this.selector === "leaves") {
      if (event.node.selected) {
        let leaveId = event.node.data.leaveId;
        console.log(leaveId);
        this.sendMessage.emit(leaveId);       
      }
    }
    if(this.selector === "expenses") {
      if (event.node.selected) {
        let reportid = event.node.data.reportid;
        console.log(reportid);
        this.sendMessage.emit(reportid);       
      }
    }
    
  }

  public receiveButtonClick(message) {  
    this.sendMessage.emit(message+'::'+this.selectedItem);  
  }
  
  public getClass(): string {
    if(this.class === undefined) {    
       return this.appData.agGridClass;     
    } else {    
      return this.class;
    }
  }
  
  public getStyle(): any {
    if(this.style === undefined) {
      return {
        marginTop: '0px',
        width: '100%',
        height: '100%'       
      };
    } else {    
      return this.style;
    }
  }

  public onGridSizeChanged(params): void {
    console.log('151');
    params.api.sizeColumnsToFit();
  } 

  public onColumnResizedHandler(params): void {
    console.log('157 - 1');
    params.api.sizeColumnsToFit();
  }

  public onComponentStateChanged(params): void {
    console.log('157');
    params.api.sizeColumnsToFit();
  }

  public getDomLayout(): string {
    if(this.domLayout === undefined) {         
       return this.appData.domLayout;  
    } else {    
      return this.domLayout;
    }
  }

  public getSorting(): boolean {
    if(this.enableSorting === undefined) {         
       return false;  
    } else {    
      return this.enableSorting;
    }
  }
  public getFilter(): boolean {
    if(this.enableFilter === undefined) {         
       return false;  
    } else {    
      return this.enableFilter;
    }
  }
  public getGroupHeaders(): boolean {
    if(this.groupHeaders === undefined) {         
       return false;  
    } else {    
      return this.groupHeaders;
    }
  }
  
  public getEnableColResize(): boolean {
    if(this.enableColResize === undefined) {         
      return true;
    } else {    
      return this.enableColResize;
    }
  }
  
  public getRowSelection(): string {
    if(this.rowSelection === undefined) {         
      return "single";
    } else {    
      return this.rowSelection;
    }
  }
  
  public getPagination(): boolean {
    if(this.pagination === undefined) {         
      return false;
    } else {    
      return this.pagination;
    }
  }
  
  public getPaginationPageSize(): number {
      if(this.paginationPageSize === undefined) {         
        return this.appData.paginationPageSize;
      } else {    
        return this.paginationPageSize;
      }
  }
  
  public getRowGroupPanelShow(): string {
    if(this.rowGroupPanelShow === undefined) {         
      return "always";
    } else {    
      return this.rowGroupPanelShow;
    }
  }

  public getPivotPanelShow(): string {
    if(this.pivotPanelShow === undefined) {         
      return "always";
    } else {    
      return this.pivotPanelShow;
    }
  }
  
  public getSuppressHorizontalScroll(): boolean {
      if(this.suppressHorizontalScroll === undefined) {         
        return true;
      } else {    
        return this.suppressHorizontalScroll;
      }
  }

  public getSuppressMovableColumns(): boolean {
    if(this.suppressMovableColumns === undefined) {         
      return false;
    } else {    
      return this.suppressMovableColumns;
    }
  } 
  
  public getPaginationNumberFormatter(): any {
    if(this.paginationNumberFormatter === undefined) {
      return function(params) {
        return "" + params.value.toLocaleString() + "";
      }
    } else {
      return this.paginationNumberFormatter;
    }
  }

  
}
