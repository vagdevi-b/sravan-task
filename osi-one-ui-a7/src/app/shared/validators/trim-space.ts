
import { AbstractControl } from '@angular/forms';

export function removeSpace(control: AbstractControl) {
  if (control.value) {
    const length=control.value.toString().trim().length;
    if(length){
        return null;
    }
    return { empty:true};
  }
  return { empty:true};
}