export class ProjectRisk{
    public id: string;
    public risk:string;
    public type: number;
    public typeId: number;
    public typeName: string;
    public criticality: string;
    public ownerId: number;
    public owner: number;
    public ownerName: string;
    public impact: string;
    public mitigationPlan: string;
    public contingencyPlan:string;
    public executiveAttention:string;
    public comment:string;
    public isInternal:boolean=false;
    public isDeleted:boolean=false;
}

export class Risk{
    public riskTypeId: number;
    public riskTypeName: string;
    public deleted: boolean;

}
export class Milestone{
    public id: number;
    public name: string;
    public type: string;
    

}