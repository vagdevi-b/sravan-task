import {OsiMonthStruct} from './osi-month-struct';
import {leftPad, isInteger} from './utils';
import {OsiMonthConstants} from './osi-month-constants';

/**
 * @author sparnampedu
 *
 * Adds additional helper methods in addition to implementing
 * the OsiMonthStruct
 */
export class OsiMonth implements OsiMonthStruct {

  year: number;
  month: number;

  constructor(year: number, month: number) {
    this.year = isInteger(year) && year >= OsiMonthConstants.minYear
        ? year
        : null;

    this.month = isInteger(month)
        && month >= OsiMonthConstants.minMonth
        && month <= OsiMonthConstants.maxMonth
        ? month
        : null;
  }

  static from(input: any, format?: string): OsiMonth | null {
    let parsedOsiMonth: OsiMonth | null = null;

    if (!input) {
      return parsedOsiMonth;
    } else if (input instanceof OsiMonth) {
      parsedOsiMonth = input;
    } else if (typeof input === 'string') {
      if (format === 'YYYYMM' && input.length === 6) {

        parsedOsiMonth = new OsiMonth(
                Number(input.slice(0, 4)),
                Number(input.slice(4, 6))
            );
      }
    } else if (OsiMonth.isOsiMonthStruct(input)) {
      parsedOsiMonth = new OsiMonth(input.year, input.month);
    }

    return parsedOsiMonth;
  }

  static getYearMonthFrom(osiMonthStruct: OsiMonthStruct) {
    return `${osiMonthStruct.year}${leftPad(osiMonthStruct.month, '0', 2)}`;
  }

  static isOsiMonthStruct(obj: any): boolean {
    return 'year' in obj && 'month' in obj;
  }

  equals(other: OsiMonthStruct | null) {
    return other !== null && other.year === this.year && other.month === this.month;
  }

  before(other: OsiMonthStruct | null) {
    if (!other) {
      return false;
    }

    return (this.year < other.year)
        || (this.year === other.year && this.month < other.month);
  }

  after(other: OsiMonthStruct | null) {
    if (!other) {
      return false;
    }

    return (this.year > other.year)
        || (this.year === other.year && this.month > other.month);
  }

  getYearMonth() {
    return OsiMonth.getYearMonthFrom(this);
  }
}
