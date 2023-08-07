export class ProjectActivitiesData{
    constructor(public id:any,public projectId: string, public calendarId: string,public AccomplishedActivities: any, public UnAccomplishedActivities: any, public Risks: any, public ProjectStatus: any, public ThisWeekActivities: any, public NextWeekActivities: any) { }    
}