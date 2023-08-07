import { IsrEventTargetLocation } from "./isr-event-target-location";
import { IsrPriorEvent } from "./isr-prior-event";
import { IsrEventNotificationRule } from "./isr-event-notification-rule";
import { IsrEventEntry } from "./isr-event-entry";
export class IsrEventDefinition {
  eventDefId:number = null;
  webinarName: String="";
  webinarTopics: String = "";
  webinarDate: String = "";
  webinarTime: String = "";
  webinarMin: String = "00";
  webinarHr: String = "00";
  status: String = "";
  registrationRequired: boolean = false;
  duration: number = null;
  isActive: boolean = true;
  manualLinkEnabled: boolean = false;
  osiIsrEventTargetLocations: IsrEventTargetLocation[] = [];
  osiIsrPriorEvents: IsrPriorEvent[] = [];
  priorEvents: any[] = [];
  osiIsrEventEmailNotificationRules: IsrEventNotificationRule[] = [];
  osiIsrEventEntries: IsrEventEntry[] = [];
  file: any = null;
}
