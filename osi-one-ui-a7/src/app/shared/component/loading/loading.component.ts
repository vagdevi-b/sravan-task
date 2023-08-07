import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @ViewChild('modalDiv')
  modalDiv: ElementRef;

  constructor(
    public elRef: ElementRef,
    public renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  show() {
    this.renderer.setStyle(this.elRef.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.modalDiv.nativeElement, 'display', 'block');
    this.renderer.addClass(this.modalDiv.nativeElement, 'show');
  }

  hide() {
    this.renderer.setStyle(this.elRef.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.modalDiv.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.modalDiv.nativeElement, 'show');
  }
}
