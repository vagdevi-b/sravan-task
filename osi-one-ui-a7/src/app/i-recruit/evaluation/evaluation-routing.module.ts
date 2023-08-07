import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationlistComponent } from './evaluationlist/evaluationlist.component';

const routes: Routes = [
  {path:'' ,component:EvaluationlistComponent}
];

@NgModule({
  imports: [RouterModule.
    forChild(routes),
 ],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }
