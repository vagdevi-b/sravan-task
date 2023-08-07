/**
 * Common Utilities
 */
import { Injectable } from '@angular/core';
import { OsiMonth } from '../component/osi-month-picker/osi-month';
import { leftPad } from '../component/osi-month-picker/utils';

const ONE_WEEK_IN_MILLI_SECONDS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class CommonUtilities {
months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setCurrentDate(): void {
        var today = new Date();
        var year: string = (today.getFullYear()).toString();
        var month: string = ((today.getMonth() + 1)).toString();
        var day: string = (today.getDate()).toString();

        if (parseInt(day) < 10) {
            day = '0' + day;
        }

        if (parseInt(month) < 10) {
            month = '0' + month;
        }

        var date = year + '-' + month + '-' + day;
        localStorage.setItem('current-date', date);
    }


    lastWeeksMondayDates(numOfLastWeeks, monthDateSeparator) {
        const lastTwoWeeks = [];
        for (let i = 1; i <= numOfLastWeeks; i++) {
            lastTwoWeeks.push(new Date().setDate(new Date().getDate() - (7 * i)))
        }
        const formatteddate = lastTwoWeeks.map((item) => {
            const dt = this.startOfWeek(new Date(item));
            const month = this.months[dt.getMonth()];
            const date = dt.getDate();
            const dateToBind = new String(date).length == 1 ? `0${date}` : date;
            console.log()
            return `${month}${monthDateSeparator}${dateToBind}`;
        })

        return formatteddate;
    }

    startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

        return new Date(date.setDate(diff));

    }

    isStoreAvailableInDB(db, currentStore) {
        // db.objectStoreNames.indexOf('refresh_Date') > -1
        const storeNames = db.objectStoreNames;
        let isAvailable = false;
        for(let i =0; i< storeNames.length; i++) {
          if(storeNames[i] === currentStore) {
            isAvailable=  true;
          }
        }
        return isAvailable;
      }

    /* returns the time difference in weeks between 2 timestamps.
     * start and end timestamps must be in milliseconds */
    getTimeDifferenceInWeeks(startTimeStamp: number, endTimeStamp: number) {
        return (endTimeStamp - startTimeStamp) / ONE_WEEK_IN_MILLI_SECONDS;
    }

    /* makes representation of money shorter
   * money < 1000, return as is
   * for 10000 10K is returned
   * for 9234234 9.2M is returned
   * */
    shortenMoney(money: number) {

        const thousand = 1e3;
        const million = 1e6;
        const billion = 1e9;

        const fractionDigits = 1;

        let result = String(money);

        const moneyAbsolute = Math.abs(money);

        if (moneyAbsolute < thousand) {
            result = `${money}`;
        }
        if (moneyAbsolute >= thousand && moneyAbsolute < million) {
            result = `${(money / thousand).toFixed()}K`;
        }
        if (moneyAbsolute >= million && moneyAbsolute < billion) {
            result = `${(money / million).toFixed(fractionDigits)}M`;
        }
        if (moneyAbsolute >= billion) {
            result = `${(money / billion).toFixed(fractionDigits)}B`;
        }

        return result;
    }

    /**
     * Returns the timestamp specified by the object
     * */
    getTimestampFromObject(
      obj: {year: number, month: number, day: number}
    ): number {
        const date = new Date(
          `${obj.year}-${obj.month}-${obj.day} 00:00:00`
        );

        return date.getTime();
    }

    /**
     * Returns an object specified by the timestamp
     * Object format: {year: number, month: number, day: number}
     * */
    getObjectFromTimestamp(timestamp: number): {year: number, month: number, day: number} {
        const date = new Date(timestamp);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    /**
     * Returns ISO_DATE (YYYY-MM-DD) from the given date struct
     */
    getISODateFromDateStruct(
      dateStruct: {year: number, month: number, day: number}
    ): string {
        if (String(dateStruct.year).length !== 4) {
            return null;
        }

        return `${dateStruct.year}-${leftPad(dateStruct.month, '0', 2)}-${leftPad(dateStruct.day, '0', 2)}`;
    }

    /**
     * Sorts an array of objects based on the given property name
     *
     * @param ascending if not provided will default to true
     * */
    sortArrayOfObjectsByProperty(array: any[], property: string, ascending: boolean) {

        if (ascending === undefined) {
            ascending = true;
        }

        function createCompareFunction() {
            const multiplier = ascending ? 1 : -1;

            return (a, b) => {

                if (a[property] > b[property]) {
                    return 1 * multiplier;
                }
                else if (a[property] < b[property]) {
                    return -1 * multiplier;
                }
                else {
                    return 0;
                }
            };
        }

        array.sort(createCompareFunction());
    }

    /**
     * Returns a list of yearmonths in the format 'YYYYMM'
     * between fromMonth and toMonth
     * */
    getYearMonthsInDateRange(
      fromMonth: OsiMonth,
      toMonth: OsiMonth
    ) {
        if (!fromMonth || !toMonth || fromMonth.after(toMonth)) {
            return [];
        }

        const yearMonths: string[] = [];
        let startMonth, endMonth;

        for (let year = fromMonth.year; year <= toMonth.year; year++) {

            startMonth = year === fromMonth.year ? fromMonth.month : 1;
            endMonth = year === toMonth.year ? toMonth.month : 12;

            for (let month = startMonth; month <= endMonth; month++) {

                yearMonths.push(
                  OsiMonth.getYearMonthFrom({year, month})
                );
            }
        }

        return yearMonths;
    }

    /**
     * Takes a string of digits of the format YYYYMM and returns an OsiMonth
     * */
    getOsiMonthFromString(dateStr: string): OsiMonth {
        return new OsiMonth(
          Number(dateStr.substr(0, 4)),
          Number(dateStr.substr(4, 2))
        );
    }
}
