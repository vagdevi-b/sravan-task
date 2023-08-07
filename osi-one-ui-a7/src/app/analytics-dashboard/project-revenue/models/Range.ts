/* represents a range
* @param min: minimum value
* @param max: maximum value
* */
export class Range {

  private _absoluteDiff: number;

  private _min: number;
  private _max: number;

  constructor(min: number, max: number) {
    this._min = min;
    this._max = max;
    this.updateAbsoluteDiff();
  }

  get max() {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
    this.updateAbsoluteDiff();
  }

  get min() {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
    this.updateAbsoluteDiff();
  }

  get absoluteDiff() {
    return this._absoluteDiff;
  }

  private updateAbsoluteDiff() {
    this._absoluteDiff = Math.abs(this._max - this._min);
  }

}
