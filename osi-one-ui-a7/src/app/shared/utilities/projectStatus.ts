import { Milestone } from "./projectRisk";

export class ProjectStatus {
    public id: string;
    public milestonename: string;
    public startDate: any;
    public endDate: any;
    public actualStartDate: any;
    public actualEndDate: any;
    public completed: number = 0;
    public reason: string;
    public isDeleted: boolean = false;
    public isInternal: boolean = false;
    public description: string;

}