import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../shared/app-constants';

@Component({
  selector: 'app-update-kpa-info',
  templateUrl: './update-kpa-info.component.html',
  styleUrls: ['./update-kpa-info.component.css']
})
export class UpdateKpaInfoComponent implements OnInit {
  kpaForm:FormGroup;
  STATUS_CODE_INFO = AppConstants.STATUS_CODE_LIST;

  @Input() additionalNotes;
  @Input() progress;
  @Input() epmsEmpKpaDetId;
  @Input() isFromManager;
  @Input() status;
  formatedNotes = [];

  // if this is true, buttons that change the state of the data
  // like save, submit etc will not be rendered.
  isReadOnly: boolean;

  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder:FormBuilder,
    private appraisalService:AppraisalService,
    private toaster:ToastrService
  ) { }

  ngOnInit() {

    this.isReadOnly = this.appraisalService.getIsGoalsPageReadOnly();

    if(this.additionalNotes.length > 0){
      const notes = this.additionalNotes.split('$$NEXTLINE$$');
      notes.forEach(index => {
        let indexdates = {notes:'', dates:''};
        let item = index.split('$$COMMENTED$$');
        
        indexdates.notes = item[0];
        indexdates.dates = item[1] || '';
        if(indexdates.dates != ''){
          let date = indexdates.dates.split('T');
          indexdates.dates = date[0] + ' ' +  date[1].slice(0, -4); 
        }
        this.formatedNotes.push(indexdates);
      });
      console.log(this.formatedNotes);
    }

    this.kpaForm=this.formBuilder.group({
      additionalNotestext:[],
      additionalNotes:[this.additionalNotes],
      progress:[this.progress]
    });
  }

  close():void{
    this.activeModal.close();
  }
  updateKpaInfo():void{
    const note=this.kpaForm.value.additionalNotestext;
    if(note && (note.toString().trim()).length ){
      const request = { 
        epmsEmpKpaDetId: this.epmsEmpKpaDetId,
        additionalNotes:this.kpaForm.value.additionalNotestext,
        progress:this.kpaForm.value.progress
      }
      this.appraisalService.updateKpaInfo(request).subscribe(response=>{
      this.toaster.success("Notes is saved");
      this.activeModal.close(response);
     },
     (error) => {
      const errorInfo = JSON.parse(error['_body']);
      this.toaster.error(errorInfo['developerMessage']);
    }
     );     
      
    } else{
      this.toaster.error("Please Enter Notes");
    }

  }

}
