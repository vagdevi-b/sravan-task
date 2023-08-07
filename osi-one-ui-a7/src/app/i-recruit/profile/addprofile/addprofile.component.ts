import { json } from '@angular-devkit/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequistionsService } from '../../../shared/services/requistions.service';
import { profileDetails } from './profile';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { AppConstants } from '../../../shared/app-constants';
import { AppraisalService } from '../../../shared/services/appraisal-cycle/appraisal.service';

@Component({
  selector: 'app-addprofile',
  templateUrl: './addprofile.component.html',
  styleUrls: ['./addprofile.component.css']
})
export class AddprofileComponent implements OnInit {
  protected appData = AppConstants;
  details: any = [];
  selectedFiles: FileList;
  currentFileUpload: File;
  add_profile: FormGroup;
  profile_arr: profileDetails[] = [];
  selected_skills: [];
  sourceType: any = [];
  sourceTypeValues: any = [];
  skillGroup: any = [];
  status: any = [];
  skillList: FormGroup;
  reqData: any;
  profileStatus: any;
  flag: boolean = false;
  flag1: boolean = false;
  flag2: boolean = true;
  loginId: any;
  sourceId: any;
  sourceTypeProp: any;
  profileid: any = '';
  profileDetails: any;
  contactNumber1: any;
  contactNumber2: any;
  creationDate: any;
  currentCtc: any;
  currentLocation: any;
  currentOrganization: any;
  emailId1: any;
  emailId2: any;
  expectedCtc: any;
  expectedDoj: any;
  externalRefBu: any;
  externalRefId: any;
  firstName: any;
  lastName: any;
  middleName: any;
  fullName: any;
  isUnderNotice: any;
  lastUpdateBy: any;
  lastUpdatedDate: any;
  noofPositions: any;
  noticePeriod: any;
  position: any;
  profileType: any;
  rateCard: any;
  rateCardCurrency: any;
  rateCardUom: any;
  relaventExpMonths: any;
  relaventExpYears: any;
  requesitionDate: any;
  requisitionId: any;
  skills: any;
  attachmentId: any;
  proId: any;
  isUpdateFunc: boolean = false;
  isAddFunc: boolean = true;
  //sourceId: any;
  //sourceType: new FormControl(this.sourceTypeProp),
  // status: any;
  totalExpMonths: any;
  totalExpYears: any;
  jobDesc: string = '';
  readMore: boolean = false;
  statusValue: any;
  transitionStatusValues: any = [];
  updateStatusFunc: boolean;
  type: any;
  attachArray: any = [];
  gradeLevel: any = [];
  uploadResume: boolean = true;
  updateResume: boolean = false;
  orgId: any;
  updateAttachment: any;
  updateId: any;
  updateattachmentId: any;
  Notes: any = [];
  entityId: any;
  entityType: any;
  requestNumber: any;
  selectedGradeLevel: any;
  statusDetails: any;
  reqExtId: any;
  isMoreComments: boolean = true;
  extId: any;
  extCtc: any;
  extPosition: any;
  extLevel: any;
  extGrade: any;
  showAttach: boolean = false;
  totalYears: any = 0;
  totalMonths: any = 0;
  maxChars = 250;
  jobCodes: any = [];
  statusUpdateValue: any;
  stsVal: any;
  constructor(private _data: RequistionsService, private _appraisalSvc: AppraisalService, private fb: FormBuilder, private toastr: ToastrService, public activeModal: NgbActiveModal, public inputData: ModalOptions) {
    // this.type = this.inputData["type"];
    // if(this.type === 'add'){
    //   this.reqData =  this.inputData["data"];
    // }else{
    //   this.profileDetails = this.inputData["data"];
    // }

  }
  ngOnInit() {
    this.loginId = localStorage.getItem('userId');
    this.orgId = localStorage.getItem('orgId')
    this.reqData = this._data.requistionData;
    this.getJobCodes();
    let jobdet = document.getElementById('jobDet');
    //jobdet.innerHTML = this.reqData['Job Details'];
    this.jobDesc = this.reqData['Job Details'];
    // if(this.jobDesc.length >1000){
    //   this.jobDesc = this.jobDesc.slice(0,250);
    //  }
    console.log(this.reqData);
    console.log(this.jobDesc);
    if (this._data.profileData) {
      console.log(this._data.profileData);
      this.profileDetails = this._data.profileData;
      this._data.profileData = {};
    } else {
      this.profileDetails = {};
    }
    console.log(this.profileDetails);
    if (this.profileDetails === null || this.profileDetails === undefined || Object.keys(this.profileDetails).length === 0) {
      this.isAddFunc = true;
      this.updateResume = false;
      this.requestNumber = this.reqData['Request Number'];
      // this.flag1 = true;
      // this.flag2 = false;
      this.setAddProfileFormInst();
      console.log("this is if");
    }
    else {
      this.isAddFunc = false;
      // this.updateResume = true;
      this.updateStatusFunc = true;
      this.flag = true;
      this.showAttach = true;
      this.requestNumber = this.profileDetails['Request Number'];
      // this.flag1 = false;
      // this.flag2 = true;
      this.setUpdateProfileFormInst();
      this.updateEvent();

      this._data.getRequistionsById(this.profileDetails.reqId).subscribe(data => {
        let obj = {
          'Id': data.id,
          'Request Number': data.externalRefId,
          'Job Title': data.jobTitle,
          'No Of Positions': data.noofPositions,
          'Job Details': data.jobDescription,
          'Submitted On': data.createdOn,
          'Status': data.status,
          'Assigned To': data.assignTo,
          'Location': data.location,
          'Target Date': data.targetDate,
          'Priority': data.priority,
          'Request Type': data.requisitionType === null ? 'New Position' : data.requisitionType,
          'Billability': data.billability,
          'Level': data.level + data.grade,
          'BU & Functional': data.bu + ' / ' + data.externalRefSubpractice,
          'jobType': data.jobTypes === null ? "Full Time" : data.jobTypes,
        }
        this.reqData = obj;
        this.jobDesc = this.reqData['Job Details'];
      }, err => {
        console.log(err)
      })

      console.log("this is else");
    }
    this.getProfileSourceType();
    this.getProfileStatus();
    this.getSkills();
    this.statusUpdate();
    this.getLevels();
  }

  getJobbDesc() {
    if (this.jobDesc && this.jobDesc.length > 30) {
      return this.jobDesc.slice(0, 300) + '.....';

    } else {
      return this.jobDesc;
    }
  }
  // map values for fileds for add instance
  setAddProfileFormInst() {
    this.add_profile = this.fb.group({
      contactNumber1: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
      contactNumber2: new FormControl(null, [Validators.maxLength(13)]),
      creationDate: new FormControl(),
      currentCtc: new FormControl(),
      currentLocation: new FormControl(),
      preferredLocation: new FormControl(),
      currentOrganization: new FormControl(),
      emailId1: new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
      emailId2: new FormControl(null, [Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
      expectedCtc: new FormControl(),
      expectedDoj: new FormControl(),
      externalRefBu: new FormControl(),
      externalRefId: new FormControl(),
      profileReceivedDate: new FormControl(),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      middleName: new FormControl(),
      fullName: new FormControl(),
      isUnderNotice: new FormControl(true),
      lastUpdateBy: new FormControl(),
      lastUpdatedDate: new FormControl(),
      noofPositions: new FormControl(),
      noticePeriod: new FormControl(),
      position: new FormControl(),
      profileType: new FormControl(),
      rateCard: new FormControl(),
      rateCardCurrency: new FormControl(),
      rateCardUom: new FormControl(),
      sourcedBy: new FormControl(null, [Validators.required]),
      relaventExpMonths: new FormControl(this.totalMonths, [Validators.required]),
      relaventExpYears: new FormControl(this.totalYears, [Validators.required]),
      requesitionDate: new FormControl(),
      requisitionId: new FormControl(),
      skills: new FormControl(),
      sourceId: new FormControl("select"),
      id: this.profileid,
      status: new FormControl("SCREENING"),
      //sourceType: new FormControl(this.sourceTypeProp),
      createdBy: this.loginId,
      modifiedBy: this.loginId,
      totalExpMonths: new FormControl(0, [Validators.required]),
      totalExpYears: new FormControl(0, [Validators.required]),
      notes: new FormControl(),
      offeredCtc: new FormControl(),
      offeredGrade: new FormControl(),
      offeredLevel: new FormControl(),
      offeredPosition: new FormControl(),
      education: new FormControl(),
      rellocationAllowance: new FormControl()
    });
    this.skillList = this.fb.group({
      createdBy: new FormControl(),
      createdOn: new FormControl(),
      id: new FormControl(),
      modifiedBy: new FormControl(),
      skillId: new FormControl(),
      skillName: new FormControl(),
      sourceId: new FormControl(),
      sourceName: new FormControl()
    })
  }
// map values to the fields for update instance
  setUpdateProfileFormInst() {
    this.add_profile = this.fb.group({
      contactNumber1: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
      contactNumber2: new FormControl(null, [Validators.maxLength(13)]),
      creationDate: new FormControl(),
      currentCtc: new FormControl(),
      currentLocation: new FormControl(),
      preferredLocation: new FormControl(),
      currentOrganization: new FormControl(),
      emailId1: new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
      emailId2: new FormControl(null, [Validators.email, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]),
      expectedCtc: new FormControl(),
      expectedDoj: new FormControl(),
      externalRefBu: new FormControl(),
      externalRefId: new FormControl(),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      id: new FormControl(),
      profileReceivedDate: new FormControl(),
      middleName: new FormControl(),
      fullName: new FormControl(),
      isUnderNotice: new FormControl(true),
      lastUpdateBy: new FormControl(),
      lastUpdatedDate: new FormControl(),
      jobTitle: new FormControl(),
      noofPositions: new FormControl(),
      noticePeriod: new FormControl(),
      position: new FormControl(),
      profileType: new FormControl(),
      rateCard: new FormControl(),
      rateCardCurrency: new FormControl(),
      rateCardUom: new FormControl(),
      relaventExpMonths: new FormControl(null, [Validators.required]),
      relaventExpYears: new FormControl(null, [Validators.required]),
      requesitionDate: new FormControl(),
      sourcedBy: new FormControl(null, [Validators.required]),
      requisitionId: new FormControl(this.reqData.Id),
      oldStatus: new FormControl(),
      skills: new FormControl(),
      sourceId: new FormControl(),
      sourceType: new FormControl(),
      status: new FormControl(),
      //createddBy:this.loginId,
      modifiedBy: this.loginId,
      totalExpMonths: new FormControl(null, [Validators.required]),
      totalExpYears: new FormControl(null, [Validators.required]),
      notes: new FormControl(),
      education: new FormControl(),
      offeredCtc: new FormControl(),
      offeredGrade: new FormControl(),
      offeredLevel: new FormControl(),
      offeredPosition: new FormControl(),
      rellocationAllowance: new FormControl()
    });
    this.skillList = this.fb.group({
      createdBy: new FormControl(),
      createdOn: new FormControl(),
      id: new FormControl(),
      modifiedBy: new FormControl(),
      skillId: new FormControl(),
      skillName: new FormControl(),
      sourceId: new FormControl(),
      sourceName: new FormControl()
    })
  }

  myFunction() {
    this.readMore = true;
  }
  // method to add perofile
  addProfile() {
    if (this.add_profile.valid) {
      console.log(this.add_profile.value);
      //console.log(this.add_profile.value.firstName);
      let requestObj = {
        osiRecruitProfile: {
          ...this.add_profile.value, notes: {
            notes: this.add_profile.value.notes,
            createdBy: this.loginId,
          },
          requisitionProfileExt: {
            createdBy: this.loginId,
            createdOn: '',
            modifiedBy: this.loginId,
            modifiedOn: '',
            profileId: this.profileid,
            rellocationAllowance: this.add_profile.value.rellocationAllowance,
            requisitionId: this.reqData.Id,
            status: this.add_profile.value.status,
            offeredCtc: this.add_profile.value.offeredCtc,
            offeredGrade: this.add_profile.value.offeredGrade,
            offeredLevel: this.add_profile.value.offeredLevel,
            offeredPosition: this.add_profile.value.offeredPosition,
          }
        },

        requisitionId: this.reqData.Id,
        status: "SCREENING",
      }
      this._data.saveProfile(requestObj).subscribe(
        (response) => {
          this.toastr.success('Profile added successfully...!');
          this.showAttach = true;

          this.setUpdateProfileFormInst();

          if (response.osiRecruitProfile.requisitionProfile === null || response.osiRecruitProfile.requisitionProfile === undefined) {
            console.log("this is id if")
          } else {
            this.entityId = response.osiRecruitProfile.requisitionProfile.id;
          }
          if (response.osiRecruitProfile.notes === null || response.osiRecruitProfile.notes.entityType === null || response.osiRecruitProfile.notes.entityType === undefined) {
            console.log("this is notes if")
          } else {
            //this.Notes = response.osiRecruitProfile.notes.notes;
            this.Notes = [];
            let obj = {
              "notes": response.osiRecruitProfile.notes.notes,
              "createdon": response.osiRecruitProfile.notes.createdOn,
              "createdBy": response.osiRecruitProfile.notes.createdUserName
            }
            this.Notes.push(obj);
            this.entityType = response.osiRecruitProfile.notes.entityType;
          }
          if (response.osiRecruitProfile.requisitionProfileExt === null || response.osiRecruitProfile.requisitionProfileExt === undefined) {
            console.log("this is ext id if")
            this.reqExtId = "";
            this.extLevel = "";
            this.extPosition = "";
            this.extPosition = "";
            this.extCtc = "";
          }
          else {
            this.reqExtId = response.osiRecruitProfile.requisitionProfileExt.id;
            this.extLevel = response.osiRecruitProfile.requisitionProfileExt.offeredLevel;
            this.extCtc = response.osiRecruitProfile.requisitionProfileExt.offeredCtc;
            this.extGrade = response.osiRecruitProfile.requisitionProfileExt.offeredGrade;
            this.extPosition = response.osiRecruitProfile.requisitionProfileExt.offeredPosition;
          }
          this.stsVal = response.osiRecruitProfile.status;
          this.setProfileValues(response.osiRecruitProfile);

          console.log(this.stsVal);
          this.profileid = response.osiRecruitProfile.id;
          this.sourceId = response.osiRecruitProfile.sourceId;
          if (response.osiRecruitProfile.attachements === null || response.osiRecruitProfile.attachements.length === 0) {
            this.updateResume = false;
            console.log("this is attachmeng if")
          } else {
            this.updateResume = true;
            this.updateAttachment = response.attachements[0].id;
          }
          this.transitionStatusValues = [];
          this.statusDetails = response;
          this._data.getStatus().subscribe(response => {
            this.statusValue = response;
            this.statusValue.filter(data => {
              if (data.currentStatus === this.statusDetails.status) {
                this.transitionStatusValues.push(data);
              }
            })
            //console.log(this.statusValue);
            console.log(this.transitionStatusValues);
          })
          //console.log(response);

        }
      )

      this.flag = true;
      this.isAddFunc = false;
    }
    else {
      this.toastr.error('Please enter mandatory fields ...');
    }
  }
  // method to get levels
  getLevels() {
    this._appraisalSvc.getGradesList(this.orgId).subscribe(response => {
      this.gradeLevel = response
      //console.log(response);
    })
  }
  // filed for source type
  assignSource($event) {
    //console.log($event.target.value);
    this.sourceId = $event.target.value;
    //console.log(this.sourceId[1]);
    for (let i = 0; i < this.sourceType.length; i++) {
      //console.log(this.sourceType[i].id);
      //console.log(this.sourceType[i].lookupDesc);
    }
  }
  // mathod to get diffrent source types 
  getProfileSourceType() {
    this._data.getProfileSourceType().subscribe(response => {
      //console.log(response);
      // for (let i = 0; i < response.osiLookupValueses.length; i++) {
      //   this.sourceType.push(response.osiLookupValueses[i]);

      // }

      this.sourceType = response.osiLookupValueses.sort((l1, l2) => l1.lookupSeqNum - l2.lookupSeqNum);
      console.log(this.sourceType);
    }, err => {
      //console.log(err);
    })
    //console.log(this.sourceType);
  }
  // method to get different status of profiles
  getProfileStatus() {
    this._data.getProfileStatus().subscribe(response => {
      //console.log(response);
      for (let i = 0; i < response.osiLookupValueses.length; i++) {
        this.status.push(response.osiLookupValueses[i]);
      }
    }, err => {
      console.log(err);
    })
  }
  getSkills() {
    this._data.getProfileSkills().subscribe(response => {
      //console.log(response);
      for (let i = 0; i < response.length; i++) {
        this.skillGroup.push(response[i]);
      }
    }, err => {
      console.log(err);
    })
  }
  // reset the page
  onResetClick() {
    this.add_profile.reset();
    this.flag = false;
    this.isUpdateFunc = false;
    this.isAddFunc = true;
  }
  // addding the resume to the profile
  onUploadClick() {
    let formdata: FormData = new FormData();
    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
      formdata.append('files', this.currentFileUpload);
      console.log(formdata);
      this._data.saveAttachment(formdata, this.profileid, 3).subscribe(event => {
        console.log(event);
        this.toastr.success('Resume uploaded successfully....');
        this.showAttachments(event);
        this.updateResume = true;
        this.updateAttachment = event[0].id;
        console.log(this.updateId);
      }
      );
      if (this.profileid != null) {
        this.isAddFunc = false;
      }
      this.flag1 = true;
    }
    else {
      this.toastr.error('Something went wrong.!')
    }
  }
  // update the existing resume of the profile
  onUpdateResume() {
    let resume: FormData = new FormData();
    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
      resume.append('files', this.currentFileUpload);
      //console.log(resume);
      // console.log(this.attachmentId);
      console.log(this.currentFileUpload);
      // if (this.updateId === null || this.updateId === undefined) {
      //   this.updateId = this.updateAttachment;
      // }
      // else {
      //   this.updateId = this.updateattachmentId;
      // }
      this._data.updateResume(this.profileid, 3, this.updateAttachment, resume).subscribe(event => {
        console.log(event);
        this.toastr.success('Resume updated successfully.....');
        this.showUpdatedResume(event);
      }
      );
    }
    else {
      this.toastr.error('something went wrong..!');
    }
  }
//method to display the present resume to download
  showUpdatedResume(data) {
    this.attachArray = [];
    let attachObj = {
      "ResumeLink": this.appData.profileDownloadUrl + data.filePath + '/' + data.fileName,
      "fileName": data.displayName
    }
    this.attachArray.push(attachObj);
  }
  // to get transition status values of profiles
  statusUpdate() {
    //this.transitionStatusValues=[];
    this._data.getStatus().subscribe(response => {
      this.statusValue = response;
      this.statusValue.filter(data => {
        if (data.currentStatus === this.profileDetails.Status) {
          this.transitionStatusValues.push(data);
        }
      })
      //console.log(this.statusValue);
      console.log(this.transitionStatusValues);
    })
  }
  // method to read the file in the upload field 
  selectFile(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
  }
// method to map the values to the fields on update 
  updateEvent() {
    let reqId, profileId;
    if (this.reqData === null || Object.keys(this.reqData).length === 0) {
      reqId = this.profileDetails.reqId;
    } else {
      reqId = this.reqData.Id;
    }
    if (this.profileDetails === null || Object.keys(this.profileDetails).length === 0) {
      profileId = this.profileid;
    } else {
      profileId = this.profileDetails.ProfileId;
    }
    this._data.getProfileByReqIdProfIdDetails(reqId, profileId, 'COMPLETE').subscribe(response => {
      console.log(response);
      this.profileid = response.id;
      // console.log(this.profileid+"this is id");
      // for (let i = 0; i < response.length; i++) {
      // this.attachmentId=response.attachments[i].id;
      // }


      if (response.attachements === null || response.attachements.length === 0) {
        this.updateResume = false;
        console.log("this is attachmeng if")
      } else {
        this.updateResume = true;
        this.updateAttachment = response.attachements[0].id;
      }
      this.sourceId = response.sourceId;
      this.profileid = response.id;
      this.proId = response.id;
      if (response.requisitionProfile.id === null || response.requisitionProfile.id === undefined) {
        console.log("this is id if")
      } else {
        this.entityId = response.requisitionProfile.id;
      }
      if (response.notes === null || response.notes.entityType === null || response.notes.entityType === undefined) {
        console.log("this is notes if")
      } else {
        this.Notes = [];
        this.isMoreComments = true;
        let obj = {
          "notes": response.notes.notes,
          "createdon": response.notes.createdOn,
          "createdBy": response.notes.createdUserName
        }
        this.Notes.push(obj);
        this.entityType = response.notes.entityType;
      }
      if (response.requisitionProfileExt === null || response.requisitionProfileExt === undefined) {
        console.log("this is ext id if")
        this.reqExtId = "";
        this.extLevel = "";
        this.extPosition = "";
        this.extPosition = "";
        this.extCtc = "";
      }
      else {
        this.reqExtId = response.requisitionProfileExt.id;
        this.extLevel = response.requisitionProfileExt.offeredLevel;
        this.extCtc = response.requisitionProfileExt.offeredCtc;
        this.extGrade = response.requisitionProfileExt.offeredGrade;
        this.extPosition = response.requisitionProfileExt.offeredPosition;
      }
      this.stsVal = response.requisitionProfile.status;
      this.setProfileValues(response);
      console.log(response);

      console.log(this.stsVal);
      //this.getProfileStatus();
      // if(response.offeredCtc===undefined||response.offeredCtc===undefined){

      // }else{
      //   this.setProfileValues(response);
      // }

      // this.setProfileValues(response);
    })
  }
  // method to update profile 
  updateProfile() {
    let formdata: FormData = new FormData();
    if (this.selectedFiles != null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    }
    // formdata.append('files', this.currentFileUpload);
    // console.log(formdata);
    let reqProfileExt;
    if (this.reqExtId === null || this.reqExtId === '') {
      reqProfileExt = {
        createdBy: this.loginId,
        createdOn: '',
        modifiedBy: this.loginId,
        modifiedOn: '',
        profileId: this.profileid,
        rellocationAllowance: this.add_profile.value.rellocationAllowance,
        requisitionId: this.reqData.Id,
        offeredCtc: this.add_profile.value.offeredCtc,
        offeredGrade: this.add_profile.value.offeredGrade,
        offeredLevel: this.add_profile.value.offeredLevel,
        offeredPosition: this.add_profile.value.offeredPosition
      }
    } else {
      reqProfileExt = {
        createdBy: this.loginId,
        createdOn: '',
        id: this.reqExtId,
        modifiedBy: this.loginId,
        modifiedOn: '',
        profileId: this.profileid,
        rellocationAllowance: this.add_profile.value.rellocationAllowance,
        requisitionId: this.reqData.Id,
        offeredCtc: this.add_profile.value.offeredCtc,
        offeredGrade: this.add_profile.value.offeredGrade,
        offeredLevel: this.add_profile.value.offeredLevel,
        offeredPosition: this.add_profile.value.offeredPosition
      }
    }
    if (this.add_profile.valid) {
      let requestObj = {
        attachments: [
          {
            files: this.currentFileUpload,
          }
        ],
        ...this.add_profile.value,
        notes: {
          notes: this.add_profile.value.notes,
          createdBy: this.loginId,
        },
        requisitionProfileExt: reqProfileExt,
        requisitionId: this.reqData.Id,
        status: this.add_profile.value.status ? this.add_profile.value.status : this.add_profile.value.oldStatus,

      }
      console.log(requestObj.status);
      // requestObj.attachments.push( this.currentFileUpload);
      let update = this.add_profile.value;
      console.log(this.add_profile.value);
      console.log(requestObj.osiRecruitProfile);
      this._data.updateProfileDetails(requestObj).subscribe(response => {
        console.log(response);
        this.toastr.success('Profile details updated successfully......');
        this.add_profile.controls['notes'].setValue('', { onlySelf: true })
        this.updateEvent();
        // this.setProfileValues(response);
        this.getProfileStatus();
        //  this.transitionStatusValues=[];
        // this.statusUpdate();
        //  this.transitionStatusValues=[];
        // this.statusValue.filter(data => {
        //   if (data.currentStatus === response.Status) {
        //     this.transitionStatusValues.push(data);
        //   }
        // })
        //  this.statusUpdate();
        this.transitionStatusValues = [];
        this.statusDetails = response;
        this._data.getStatus().subscribe(response => {
          this.statusValue = response;
          this.statusValue.filter(data => {
            if (data.currentStatus === this.statusDetails.status) {
              this.transitionStatusValues.push(data);
            }
          })
          //console.log(this.statusValue);
          console.log(this.transitionStatusValues);
        })

      })
    }
    else {
      this.toastr.error('Please enter mandatory fields..!')
    }
  }
  // method to set the profile values on update
  setProfileValues(data) {
    this.add_profile.patchValue({
      contactNumber1: data.contactNumber1,
      contactNumber2: data.contactNumber2,
      creationDate: data.creationDate,
      currentCtc: data.currentCtc,
      currentLocation: data.currentLocation,
      preferredLocation: data.preferredLocation,
      currentOrganization: data.currentOrganization,
      emailId1: data.emailId1,
      emailId2: data.emailId2,
      expectedCtc: data.expectedCtc,
      expectedDoj: data.expectedDoj,
      externalRefBu: data.externalRefBu,
      externalRefId: data.externalRefId,
      firstName: data.firstName,
      fullName: data.fullName,
      isUnderNotice: data.isUnderNotice,
      lastName: data.lastName,
      id: data.id,
      profileReceivedDate: data.profileReceivedDate,
      oldStatus: this.stsVal,
      sourcedBy: data.sourcedBy,
      middleName: data.middleName,
      lastUpdateBy: data.lastUpdateBy,
      lastUpdatedDate: data.lastUpdatedDate,
      noofPositions: data.noofPositions,
      noticePeriod: data.noticePeriod,
      position: data.position,
      profileType: data.profileType,
      rateCard: data.rateCard,
      rateCardCurrency: data.rateCardCurrency,
      rateCardUom: data.rateCardUom,
      relaventExpMonths: data.relaventExpMonths,
      relaventExpYears: data.relaventExpYears,
      requesitionDate: data.requesitionData,
      requisitionId: this.reqData.Id,
      skills: data.skills,
      sourceId: data.sourceId,
      jobTitle: data.jobTitle,
      sourceType: data.sourceType,
      status: '',
      totalExpMonths: data.totalExpMonths,
      //notes: data.notes,
      offeredCtc: this.extCtc,
      offeredGrade: this.extGrade,
      offeredLevel: this.extLevel + this.extGrade,
      offeredPosition: this.extPosition,
      totalExpYears: data.totalExpYears,
      createdBy: data.createdBy,
      education: data.education,
    });

    this.skillList = this.fb.group({
      createdBy: new FormControl(),
      createdOn: new FormControl(),
      id: new FormControl(),
      modifiedBy: new FormControl(),
      skillId: new FormControl(),
      skillName: new FormControl(),
      sourceId: new FormControl(),
      sourceName: new FormControl()
    })
    //this.reqExtId = data.requisitionProfileExt.id;
    this.attachArray = [];
    let attachData = data.attachements;
    if (attachData === null) {
      this.attachArray = [];
    } else {
      for (let j = 0; j < attachData.length; j++) {
        let attachObj = {
          "ResumeLink": this.appData.profileDownloadUrl + attachData[j].filePath + '/' + attachData[j].fileName,
          "fileName": attachData[j].displayName
        }
        this.attachArray.push(attachObj);
      }
    }
  }

  showAttachments(data) {
    console.log(data);
    this.attachArray = [];
    let attachData = data;
    if (attachData === null) {
      this.attachArray = [];
    } else {
      for (let j = 0; j < attachData.length; j++) {
        let attachObj = {
          "ResumeLink": this.appData.profileDownloadUrl + attachData[j].filePath + '/' + attachData[j].fileName,
          "fileName": attachData[j].displayName
        }
        this.attachArray.push(attachObj);
      }
    }
  }
// method to get all the comments form the data base
  getAllComments() {
    this.isMoreComments = false;
    this.Notes = [];

    this._data.getAllComments(this.entityId, this.entityType).subscribe(response => {
      for (let i = response.length - 1; i >= 0; i--) {
        if (response[i].notes === null) {

        } else {
          let obj = {
            "notes": response[i].notes,
            "createdon": response[i].createdOn,
            "createdBy": response[i].createdUserName
          }
          this.Notes.push(obj);
        }

      }
      //document.getElementById('notes').innerHTML = this.Notes;
    }, err => {
      console.log(err);
    })
  }
  // method to get only latest comment from the data base
  getLessComments() {
    this.isMoreComments = true;
    this.Notes = [];
    this._data.getAllComments(this.entityId, this.entityType).subscribe(response => {
      if (response[response.length - 1].notes === null) {
        let obj = {
          "notes": '',
          "createdon": '',
          "createdBy": ''
        }
        this.Notes.push(obj);
      } else {
        let obj = {
          "notes": response[response.length - 1].notes,
          "createdon": response[response.length - 1].createdOn,
          "createdBy": response[response.length - 1].createdUserName
        }
        this.Notes.push(obj);
        //this.Notes = this.Notes + response[response.length - 1].notes;
      }

      //document.getElementById('notes').innerHTML = this.Notes;
    }, err => {
      console.log(err);
    })
  }
// method to get all the job codes
  getJobCodes() {
    this._data.getJobCodes(this.orgId).subscribe(response => {
      console.log(response);
      this.jobCodes = response;
    }, err => {
      console.log(err);
    })
  }
  // to close the add or update popoup screen
  closePopup() {
    this.activeModal.close(false);
  }
  // method to restrict the user to not to enter negetive values in the field 
  checkValue(event) {
    if (event.target.value < 0) {
      event.target.value = "";
    }
  }
  // metod to restrict the user to enter the values between 1 and 12
  checkMonthsValue(event) {
    if (event.target.value < 0 || event.target.value > 12) {
      event.target.value = 0;
    }
  }
}