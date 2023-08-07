export class ProjectActivities{
    constructor(public id: string, public projectId: string, public calendarId: string, public activityType: string, public activityName: string, public activityDependency: string, public assignedTo: any,public assignedToEmployees:any, public reassignedTo: any,public reassignedToEmployees:any, public percentageCompletion: string, public status: string, public comments: string, public isInternal: boolean, public isDeleted: boolean,public reason:string) { }
}