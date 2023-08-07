import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenDirective } from '../fullscreen.directive';

@NgModule({
  declarations: [FullscreenDirective],
  imports: [
    CommonModule
  ],
  exports: [FullscreenDirective]
})
export class FullScreenModule { }
