import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Directive({
  selector: '[fullscreen]',
  exportAs: 'fullscreen' 
})
export class FullscreenDirective {
  private isMaximizedSubject = new BehaviorSubject(false);
  isMaximized$ = this.isMaximizedSubject.pipe();
  mainEle = document.getElementsByClassName('content content-master');
  cardEle = document.getElementsByClassName('card');
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  toggle() {
    if(this.isMaximizedSubject.getValue()){
      this.maximize();
    }else{
      this.minimize();
    }
  }

  
  
  maximize() {
    if (this.el) {
      this.isMaximizedSubject.next(true);
      this.renderer.addClass(this.el.nativeElement, "nested-card--fullscreen");
      this.renderer.addClass(this.el.nativeElement, "grid-col--fluid");
      this.renderer.addClass(this.mainEle[0], "parent-container--fullscreen");
      this.renderer.addClass(this.cardEle[4],"child-position--collapse");
    }
  }
  minimize() {
    if (this.el) {
      this.isMaximizedSubject.next(false);
      
      this.renderer.removeClass(this.el.nativeElement, "nested-card--fullscreen");
      this.renderer.removeClass(this.el.nativeElement, "grid-col--fluid");
      this.renderer.removeClass(this.mainEle[0], "parent-container--fullscreen");
      this.renderer.removeClass(this.cardEle[5],"child-position--collapse");
    }
  }
}
