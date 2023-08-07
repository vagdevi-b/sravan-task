import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  @Input() message;
  @Input() btnType;
  

  constructor(
    private activeModal:NgbActiveModal
  ) { }

  close(type):void{
    this.activeModal.close(type);
  }

}
