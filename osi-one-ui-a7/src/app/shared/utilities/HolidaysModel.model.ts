

export class HolidaysModel{
    constructor(
    public id:string,
    public orglocations:string,
    public holidaydate:string,
    public holidayname:string,
    public optionals:string,
    public status:boolean,
    public isWeekend:boolean
    ){}
    }