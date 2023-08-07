import { 
    Component, 
    OnInit, 
    Input,
    Output, 
    EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid-buttons',
  template: `    
        <span style="float: right;"> 
            <span *ngIf="showAddButton" data-toggle="tooltip" title="Add" style="cursor: pointer;"
                class="glyphicon glyphicon-plus" (click)="invokeAddMethod($event)">
            </span>           
            <span>&nbsp;</span>        
            <span *ngIf="showEditButton" data-toggle="tooltip" title="Edit" style="cursor: pointer;"
                    class="glyphicon glyphicon-pencil" (click)="invokeEditMethod($event)">
            </span>     
            <span>&nbsp;</span>       
            <span *ngIf="showViewButton" data-toggle="tooltip" title="View" style="cursor: pointer;" 
                class="glyphicon glyphicon-eye-open" (click)="invokeViewMethod($event)"> 
            </span>      
            <span>&nbsp;</span>        
            <span *ngIf="showDeleteButton" data-toggle="tooltip" title="Delete" style="cursor: pointer;" 
                class="glyphicon glyphicon-remove" (click)="invokeDeleteMethod($event)">
            </span>       
        </span>   
        `
  
})
export class GridButtonsComponent implements OnInit {
  title = 'app';
  @Output() sendbuttonClick = new EventEmitter<string>();

  @Input() showAddButton: boolean; 
  @Input() showEditButton: boolean; 
  @Input() showViewButton: boolean; 
  @Input() showDeleteButton: boolean; 

  constructor() {}

  ngOnInit() {}
  
public invokeAddMethod(event: any): void {    
    this.sendbuttonClick.emit('add');  
}

public invokeEditMethod(event: any): void {
  this.sendbuttonClick.emit('edit');  
}

public invokeViewMethod(event: any): void {
  this.sendbuttonClick.emit('view');  
}

public invokeDeleteMethod(event: any): void {
  this.sendbuttonClick.emit('delete');    
}


}
