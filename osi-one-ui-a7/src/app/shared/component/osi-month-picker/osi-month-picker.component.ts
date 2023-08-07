import {Component, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OsiMonthStruct} from './osi-month-struct';
import {isInteger} from './utils';
import {OsiMonth} from './osi-month';

/**
 * @author sparnampedu
 */
@Component({
  selector: 'app-osi-month-picker',
  templateUrl: './osi-month-picker.component.html',
  styleUrls: ['./osi-month-picker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: OsiMonthPickerComponent,
    multi: true
  }]
})
export class OsiMonthPickerComponent implements OnInit, ControlValueAccessor {

  @Input()
  minMonth: OsiMonthStruct;

  @Input()
  maxMonth: OsiMonthStruct;

  readonly monthMatrix = [
    ['Jan', 'Feb', 'Mar'],
    ['Apr', 'May', 'Jun'],
    ['Jul', 'Aug', 'Sep'],
    ['Oct', 'Nov', 'Dec']
  ];

  readonly monthNameToNumberMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  displayedYear: number;

  @Output()
  monthSelect = new EventEmitter<OsiMonthStruct>();

  value: OsiMonth;

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit() {
    if (!this.value) {
      this.setDisplayedYear();
    } else {
      this.displayedYear = this.value.year;
    }
  }

  /**
   * Sets the year displayed based on the minMonth and maxMonth
   *
   * Note:
   * If both minMonth and maxMonth exists and minMonth < maxMonth,
   * that case is currently not handled
   */
  private setDisplayedYear() {
    const currentYear = new Date().getFullYear();

    this.displayedYear = currentYear;
    if (this.minMonth && !this.maxMonth && this.minMonth.year > currentYear) {
      this.displayedYear = this.minMonth.year;
    } else if (!this.minMonth && this.maxMonth && this.maxMonth.year < currentYear) {
      this.displayedYear = this.maxMonth.year;
    } else if (
        this.minMonth && this.maxMonth
        && (this.minMonth.year > currentYear || this.maxMonth.year < currentYear)
    ) {
      this.displayedYear = this.minMonth.year;
    }
  }

  onMonthSelect(event: Event, month): void {
    if ((event.currentTarget as HTMLElement).classList.contains('disabled')) {
      return;
    }
    const monthNumber = this.monthNameToNumberMap[month];

    this.monthSelect.emit({
      year: this.displayedYear,
      month: monthNumber
    });
  }

  navigateYear(event: Event, num) {
    if ((event.currentTarget as HTMLElement).classList.contains('disabled')) {
      return;
    }

    if (isInteger(num)) {
      this.displayedYear += num;
    }
  }

  isDisabled(monthName: string) {
    const osiMonth = OsiMonth.from({
      year: this.displayedYear,
      month: this.monthNameToNumberMap[monthName]
    });

    return osiMonth.before(this.minMonth)
        || osiMonth.after(this.maxMonth);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: OsiMonthStruct): void {
    this.value = OsiMonth.from(obj);

    if (this.onChange) {
      this.onChange(this.value);
    }
  }
}
