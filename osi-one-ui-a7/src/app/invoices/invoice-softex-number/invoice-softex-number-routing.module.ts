import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSoftexNumberComponent } from './invoice-softex-number.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceSoftexNumberComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceSoftexNumberRoutingModule { }
