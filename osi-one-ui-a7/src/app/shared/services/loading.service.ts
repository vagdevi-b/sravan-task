import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {LoadingComponent} from '../component/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private rootVcRef: ViewContainerRef;
  private loadingRef: ComponentRef<LoadingComponent>;

  constructor(
    private applicationRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) {
    this.rootVcRef = this.applicationRef.components[0].instance.vcRef;
    const cf = this.cfr.resolveComponentFactory(LoadingComponent);
    this.loadingRef = this.rootVcRef.createComponent(cf);
  }

  show() {
    this.loadingRef.instance.show();
  }

  hide() {
    this.loadingRef.instance.hide();
  }
}
