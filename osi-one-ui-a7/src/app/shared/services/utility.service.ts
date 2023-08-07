import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

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

  filterObjectBySearchValue(list: any[], searchValue: any): any[] {
    let filteredRecords: any[] = [];
    if (
      list.length &&
      searchValue
    ) {
      list.filter((record: any) => {
        const recordValueslist: any[] = Object.values(record)
        if (recordValueslist.length) {
          recordValueslist.filter((element) => {
            if (typeof element === 'string' && typeof(searchValue)==='string') {
              if (
                element.toLowerCase().includes(searchValue.toLowerCase())
              ) {
                filteredRecords.push(record)
              }
            } else if(typeof element === 'number' && typeof(searchValue)==='number'){
              if (element === searchValue) {
                filteredRecords.push(record)
              }
            }
          })
        }
      })
    } else {
      filteredRecords = list;
    }
    return filteredRecords;
  }
}
