import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export const JANUARY: number = 1;
export const FEBRUARY: number = 2;
export const MARCH: number = 3;
export const APRIL: number = 4;
export const MAY: number = 5;
export const JUNE: number = 6;
export const JULY: number = 7;
export const AUGUST: number = 8;
export const SEPTEMBER: number = 9;
export const OCTOBER: number = 10;
export const NOVEMBER: number = 11;
export const DECEMBER: number = 12;


@Injectable({
  providedIn: 'root'
})
export class FormService {

  nums: number[];
  abbrev: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  names: string[] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  constructor() { 
    this.nums = [];
    for (let mth = JANUARY; mth <= DECEMBER; mth++) {
      this.nums.push(mth);
    }
  }

  getCardMonthsNum(): Observable<number[]> {
    return of(this.nums);
  }

  getCardMonthsAbbrev(): Observable<string[]> {
    return of(this.abbrev);
  }

  getCardMonthsName(): Observable<string[]> {
    return of(this.names);
  }

  getCardMonthsMonthNum(): Observable<MonthNum[]> {
    return this.getCardMonthsMonthNumFrom(JANUARY);
  }

  /**
   * Get array of MonthNum
   * @param start start month (1-based), i.e. 1 => Jan etc.
   * @returns 
   */
  getCardMonthsMonthNumFrom(start: number): Observable<MonthNum[]> {
    let data: MonthNum[] = [];
    for (let index = 0; index < this.nums.length; index++) {
      if (this.nums[index] >= start) {
        data.push({name: this.names[index], abbrev: this.abbrev[index], num: this.nums[index]});
      }
    }
    return of(data);
  }

  getCardYears(): Observable<number[]> {
    return this.getCardYearsRange(10);
  }

  getCardYearsRange(range: number): Observable<number[]> {
    let years: number[] = [];
    for (let index = 0, yr = new Date().getFullYear(); index < range; index++) {
      years.push(yr + index);
    }
    return of(years);
  }

  getAppMonth(date?: Date): number {
    if (date == null) {
      date = new Date();
    }
    return date.getMonth() + 1;
  }
}

export type MonthNum = {
  name: string;
  abbrev: string;
  num: number;
};
