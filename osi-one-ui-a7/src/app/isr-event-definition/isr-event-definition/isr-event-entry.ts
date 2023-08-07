export class IsrEventEntry {
  eventEntryId:number = null;
  customer: String="";
  contactFirst: String="";
  contactLast: String="";
  contactEmail: String="";
  isrNumber: String="";
  emailPersonalization: String="";
  salesForceId: String="";
  isRegistered: Boolean = false;
  isAttended: Boolean = false;
  dnc: Boolean = false;
  countryCode: String = "";
  stateCode: String = "";
  cityCode: String = "";
  sendNotification: Boolean = true;
  osiIsrPriorEvents: any[] = [];
  designation: String ="";
}
