import { Injectable } from '@angular/core';
import { HttpUtilities } from '../utilities';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})
export class RequistionsService {
  private appData = AppConstants;
  requistionData:any;
  profileData:any;
  constructor(private httpUtilities: HttpUtilities) { }
 
  getAllRequistions(): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getProfileSourceCountByRequistion(reqid): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getProfileCountPerSource/requisitionId/${reqid}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getRequistionsBySearch(searchType,searchItem){
    let url = '';
    if(searchType === 'Request No'){
     url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?externalRefId=${searchItem}`;
    }else if(searchType === 'Assigned To'){
     url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?assignedTo=${searchItem}`;
    }else if(searchType === 'Status'){
      url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?status=${searchItem}`;
    }else if(searchType === 'Priority'){
      url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?priority=${searchItem}`;
    }else if(searchType === 'AssignedId'){
      url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?assignedId=${searchItem}`;
    }else if(searchType === 'unAssigned'){
      url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?unAssigned=true`;
    }
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAssigneesList(): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/api/getAssigniesList`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }
  saveProfile(body):Observable<any>{
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisitionProfile/saveProfile`;
    return this.httpUtilities.post(url, body)
    .map((response: any) => {
      return response;
    })
  }
  saveAttachment(body,sourceID,entityID):Observable<any>{
    let url = `${this.appData.iRecruitUrl}recruite/v1/doccument/uploadDoccuments?sourceId=${sourceID}&entityId=${entityID}`;
    return this.httpUtilities.post(url,body)
  }

  getAllRequistionsById(reqId): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?externalRefId=${reqId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllRequistionsByStatus(status): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?status=${status}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllRequistionsByPriorityAndStatus(reqId, priority, status): Observable<any> {
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/getRequisitions?externalRefId=${reqId}&status=${status}&priority=${priority}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllRecruitmentGroup(): Observable<any> {
    let url = `${this.appData.emsAppUrl}getLookupByLookupName/RECRUITMENT_GROUP`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getProfileSourceType(): Observable<any> {
    let url = `${this.appData.emsAppUrl}getLookupByLookupName/PROFILE_SOURCE_TYPE`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getProfilesByReqIdAndSourceId(requisitionId,profileSourceId): Observable<any> {
    let url = '';
    if(profileSourceId === undefined || profileSourceId === null){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?requisitionId=${requisitionId}`;
    }else{
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?profileSourceId=${profileSourceId}&requisitionId=${requisitionId}`;
    }
   
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }
  getProfileSkills(): Observable<any> {
    let url = `http://192.168.32.63:8080/ems-api/api/skills/get`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }
  updateRequistion(reqId,assignTo,assignedId){
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/assignRequisitions/requisitionId/${reqId}/assignTo/${assignTo}/assignedId/${assignedId}`;
    return this.httpUtilities.put(url)
    .map((response: any) => {
      return response;
    })
  }

  getProfileStatus(): Observable<any> {
    let url = `${this.appData.emsAppUrl}getLookupByLookupName/REQUISITION_PROFILE_STATUS`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  updateProfileStatus(reqId,profileId,status){
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisitionProfile/updateStatusOfRequisitionProfile/requisitionId/${reqId}/profileId/${profileId}/status/${status}`;
    return this.httpUtilities.put(url)
    .map((response: any) => {
      return response;
    })
  }
  updateProfileDetails(body){
    let url = `${this.appData.iRecruitUrl}recruite/v1/profile/updatePofile`;
    return this.httpUtilities.put(url,body)
    .map((response: any) => {
      return response;
    })
  }
  updateResume(srcId,entityId,atcId,body){
    let url = ` ${this.appData.iRecruitUrl}recruite/v1/doccument/updateDoccument?sourceId=${srcId}&entityId=${entityId}&attachmentId=${atcId}`;
    return this.httpUtilities.put(url,body)
    
  }
  getStatus(){
    let url = ` ${this.appData.iRecruitUrl}recruite/v1/status/getStatusTransition`;
    return this.httpUtilities.get(url)
  }

  getProfileById(profileId){
    let url = `${this.appData.iRecruitUrl}recruite/v1/profile/profileId/${profileId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getProfileByReqIdProfIdDetails(reqId,profId,details){
    let url = `${this.appData.iRecruitUrl}recruite/v1/profile/requisitionId/${reqId}/profileId/${profId}/details/COMPLETE`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllProfilesByReqId(ReqId){
    let url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?requisitionId=${ReqId}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllProfiles(){
    let url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getprofilesBySearch(searchType,searchItem){
    let url = '';
    if(searchType === 'Request No'){
     url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?externalRefId=${searchItem}`;
    }else if(searchType === 'AssignTo'){
     url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?assignTo=${searchItem}`;
    }else if(searchType === 'Status'){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?status=${searchItem}`;
    }else if(searchType === 'Source'){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?profileSourceId=${searchItem}`;
    }else if(searchType === 'Name'){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?fullName=${searchItem}`;
    }else if(searchType === 'Mobile No'){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?contactNumber=${searchItem}`;
    }else if(searchType === 'Email'){
      url = `${this.appData.iRecruitUrl}recruite/v1/profile/getProfileInformationByRequistionIdAndSourceId?email=${searchItem}`;
    }
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getRequistionsById(Id): Observable<any>{
    let url = `${this.appData.iRecruitUrl}recruite/v1/requisition/${Id}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getStatusesByType(type){
    let url = `${this.appData.iRecruitUrl}recruite/v1/status/master/entityType/${type}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getAllComments(entityId,entityName){
    let url = `${this.appData.iRecruitUrl}recruite/v1/notes/entityId/${entityId}/entityName/${entityName}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  getJobCodes(org_id){
    let url = `${this.appData.emsAppUrl}assignments/getAllJobCodes/${org_id}`;
    return this.httpUtilities.get(url)
      .map((response: any) => {
        return response;
      });
  }

  //sorting
  getClass(field: string, sortType: string, selectedHeader: string): any {
    if (sortType === 'asc' && field === selectedHeader) {
        return 'sorting_desc';
    }
    if (field === selectedHeader) {
        return 'sorting_asc';
    }
    return 'sorting';
}

sort(sortKey: any, inputData: any, sortType: string): any {
    if (!inputData || !inputData.length) {
        const tempObj = { result: [], sortType };
        return tempObj;
    }
    if (sortType === 'asc') {
        inputData = inputData.sort(
            this.compareValues(sortKey, 'asc')
        );
        sortType = 'desc';
    } else {
        inputData = inputData.sort(
            this.compareValues(sortKey, 'desc')
        );
        sortType = 'asc';
    }
    const returnObject = { result: inputData, sortType };
    return returnObject;
}

compareValues(key: any, order: any = 'asc'): any {
    let current;
    let next;
    // tslint:disable-next-line: only-arrow-functions
    return function (currentValue: any, nextValue: any): any {
        if (!currentValue.hasOwnProperty(key) || !nextValue.hasOwnProperty(key)) {
            return 0;
        }
        if (key) {
            current = (currentValue[key]) ? ((typeof currentValue[key] === 'string' || typeof currentValue[key] === 'boolean') ?
                currentValue[key].toString().toLowerCase() : currentValue[key])
                : currentValue[key];
            next = (nextValue[key]) ? ((typeof nextValue[key] === 'string' || typeof nextValue[key] === 'boolean') ?
                nextValue[key].toString().toLowerCase() : nextValue[key])
                : nextValue[key];
            // next = (nextValue[key]) ? nextValue[key].toString().toLowerCase() : nextValue[key];
        } else {
            current = currentValue;
            next = nextValue;
        }
        let comparison = 0;
        if (current > next) {
            comparison = 1;
        } else if (current < next) {
            comparison = -1;
        } else if (current) {
            comparison = 1;
        } else if (next) {
            comparison = -1;
        }
        return (order === 'desc' && current !== next) ? comparison * -1 : comparison;
    };
}
}
