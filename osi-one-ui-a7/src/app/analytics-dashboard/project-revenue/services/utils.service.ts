import { Injectable } from '@angular/core';
import { PointModel } from '../models/point.model';
import { Range } from '../models/Range';

@Injectable()
export class UtilsService {

  public static drawCircle(ctx, center: PointModel, radius: number, lineColor: string): void {

    // draw circle
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  }


  /* makes representation of money shorter
   * money < 1000, return as is
   * for 10000 10K is returned
   * for 9234234 9.2M is returned
   * */
  public static shortenMoney(money: number) {

    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;

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


  /* returns the first index in the array that has value !== undefined */
  public static getFirstValidIdx(arr: any[]) {

    if (arr.length === 0) {
      return null;
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        return i;
      }
    }

    return null;
  }

  /* returns the first index from the end in the array
   * that has value !== undefined */
  public static getLastValidIdx(arr: any[]) {

    if (arr.length === 0) {
      return null;
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] !== undefined) {
        return i;
      }
    }

    return null;
  }

  /* returns the min and max values in a numbers array
   * encapsulated as a Range object */
  public static getArrayRange(numberArray: number[]): Range {

    return new Range(
      Math.min(...numberArray),
      Math.max(...numberArray),
    );
  }

}
