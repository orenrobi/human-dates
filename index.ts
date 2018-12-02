import isostring = require('isostring');

class HumanDate {

    // Derivation: 1000 * 60 * 60 * 24
    private static readonly DAY_MILLISECONDS = 86400000;
    // Length of a leap cycle in the standard Symmetry454 calendar system.
    private static readonly CYCLE_YEARS = 293;
    // The number of leap years during one leap cycle in the Symmetry454 system.
    private static readonly CYCLE_LEAPS = 52;
    // Used to determine whether a year is leap. Derivation: (CYCLE_YEARS - 1) / 2
    private static readonly LEAP_COEFFICIENT = 146;
    // Derivation: ((CYCLE_YEARS * 52) + CYCLE_LEAPS))  * 7) / CYCLE_YEARS
    private static readonly MEAN_YEAR = 365.24232081911265;

    public date: Date|undefined;
    public year: number|undefined;
    public dayOfYear: number|undefined;
    public iso: string|undefined;
    public daysSinceEpoch: number|undefined;
    public yearWeek: number|undefined;
    public quarter: number|undefined;
    public dayOfQuarter: number|undefined;
    public weekOfQuarter: number|undefined;
    public monthOfQuarter: number|undefined;
    public inLeapYear: boolean|undefined;
    public inLeapMonth: boolean|undefined;
    public daysInMonth: number|undefined;
    public monthOfYear: number|undefined;
    public monthShort: string|undefined;
    public monthLong: string|undefined;
    public dayOfMonth: number|undefined;
    public dayOfMonthSuffix: string|undefined;
    public weekOfMonth: number|undefined;
    public weekOfMonthSuffix: string|undefined;
    public weekOfMonthWord: string|undefined;
    public dayOfWeek: number|undefined;
    public dayOfWeekShort: string|undefined;
    public dayOfWeekLong: string|undefined;
    public daysInYear: number|undefined;
    public micro: string|undefined;
    public short: string|undefined;
    public standard: string|undefined;
    public medium: string|undefined;
    public long: string|undefined;
    public gregorianYear: number|undefined;
    public gregorianDayOfYear: number|undefined;
    public newYearDay: number|undefined;

    public fromDate(date: Date) {
        this.date = date;
        this.iso = this.date.toISOString();
        this.gregorianYear = this.date.getFullYear();
        this.gregorianDayOfYear = this.getGregorianDayOfYear(this.date);
        this.daysSinceEpoch = this.getPriorElapsedDays(this.gregorianYear) + this.gregorianDayOfYear;
        this.year = this.getHumanYear(this.daysSinceEpoch);
        this.newYearDay = this.getHumanNewYearDay(this.year);
        this.dayOfYear = this.daysSinceEpoch - this.newYearDay + 1;
        this.yearWeek = Math.ceil(this.dayOfYear / 7);
        this.quarter = Math.ceil((4 / 53) * this.yearWeek);
        this.dayOfQuarter = this.dayOfYear - (13 * 7 * (this.quarter - 1));
        this.weekOfQuarter = Math.ceil(this.dayOfQuarter / 7);
        this.monthOfQuarter = Math.min(3, Math.ceil((2 / 9) * this.weekOfQuarter));
        this.inLeapYear = this.isLeapYear(this.year);
        this.inLeapMonth = this.monthOfQuarter == 3 && this.quarter == 4 && this.inLeapYear;
        this.daysInMonth = ((this.monthOfQuarter == 2) || this.inLeapMonth) ? 35 : 28;
        this.monthOfYear = 3 * (this.quarter - 1) + this.monthOfQuarter;
        this.monthShort = this.getMonthAbbr(this.monthOfYear);
        this.monthLong = this.getMonthName(this.monthOfYear);
        this.dayOfMonth = this.dayOfYear - ((28 * (this.monthOfYear - 1)) + (7 * this.quotient(this.monthOfYear, 3)));
        this.dayOfMonthSuffix = this.getOrdinalSuffix(this.dayOfMonth);
        this.weekOfMonth = Math.ceil(this.dayOfMonth / 7);
        this.weekOfMonthSuffix = this.getOrdinalSuffix(this.weekOfMonth);
        this.weekOfMonthWord = this.getOrdinalWord(this.weekOfMonth);
        this.dayOfWeek = this.mod(this.dayOfYear - 1, 7) + 1;
        this.dayOfWeekShort = this.getWeekdayAbbr(this.dayOfWeek);
        this.dayOfWeekLong = this.getWeekdayName(this.dayOfWeek);
        this.daysInYear =  7 * ((this.inLeapYear) ? 53 : 52);
        this.micro = this.format('micro');
        this.short = this.format('short');
        this.standard = this.format('standard');
        this.medium = this.format('medium');
        this.long = this.format('long');
    }
    // Find the ordinal date (nth day of year) for a given Gregorian year.
    private getGregorianDayOfYear(date: Date): number {
        let gregorianNewYearDay = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((date.getTime() - gregorianNewYearDay.getTime()) / HumanDate.DAY_MILLISECONDS);
    };
    // Find the number of days that elapsed between the epoch and the given Gregorian year.
    private getPriorElapsedDays(gregYear: number): number {
        var priorYear = gregYear - 1;
        var days = (priorYear * 365) + 1;
        days += Math.floor(priorYear / 4);
        days -= Math.floor(priorYear / 100);
        days += Math.floor(priorYear / 400);
        return days;
    };
    // Find the Human Year containing the given nth day since the epoch.
    private getHumanYear(daysSinceEpoch: number): number {
        var meanYear = Math.ceil((daysSinceEpoch - 1) / HumanDate.MEAN_YEAR);
        if (this.greaterThanHumanYear(daysSinceEpoch, meanYear)) {
            return meanYear + 1;
        }
        if (this.lessThanHumanYear(daysSinceEpoch, meanYear)) {
            return meanYear - 1;
        }
        return meanYear;
    };
    // Check if the given human date as days since epoch falls later than the given year.
    private greaterThanHumanYear(daysSinceEpoch: number, humanYear: number): boolean {
        //let newYearDay = this.getHumanNewYearDay(humanYear);
        //let nextNewYear = this.getHumanNewYearDay(humanYear + 1);
        //return (daysSinceEpoch - newYearDay) >= (7 * 52) && (daysSinceEpoch >= nextNewYear));
        let nextNewYear = this.getHumanNewYearDay(humanYear + 1);
        return daysSinceEpoch >= nextNewYear;
    }
    // Check if the given human date as days since epoch falls before the given year.
    private lessThanHumanYear(daysSinceEpoch: number, humanYear: number): boolean {
        let newYearDay = this.getHumanNewYearDay(humanYear);
        return daysSinceEpoch < newYearDay;
    }
    // Returns the days since epoch of Jan 1 of the given human year.
    private getHumanNewYearDay(humanYear: number): number {
        var priorYear = humanYear - 1;
        var shortTotal = (7 * 52 * priorYear) + 1;
        var leapTotal = Math.floor(((HumanDate.CYCLE_LEAPS * priorYear) + HumanDate.LEAP_COEFFICIENT) / HumanDate.CYCLE_YEARS);
        return (7 * leapTotal) + shortTotal;
    };
    // Returns whether the given human year is a leap year with a 53rd week
    private isLeapYear(year: number): boolean {
        var dividend = (HumanDate.CYCLE_LEAPS * year) + HumanDate.LEAP_COEFFICIENT;
        var accumulator = this.mod(dividend, HumanDate.CYCLE_YEARS);
        return accumulator < HumanDate.CYCLE_LEAPS;
    };
    // Return a modified integer quotient rounded downd from two given numbers.
    public quotient(x: number, y: number): number {
        return Math.floor(x / y);
    };
    // Return a modified modulo (remainder) of two given numbers.
    private mod(x: number, y: number): number {
        return x - (y * this.quotient(x, y));
    };
    /**
     * Formats
     *
     * Numeric  1999/12/5/7
     * Short    Dec/5/Sun
     * Standard 1999 Dec 5 Sun
     * Medium   5th Sunday, Dec 1999
     * Full     Fifth Sunday of December 1999
     */
    private format(format: string): string {
        var formatted = "";
        if (typeof this.weekOfMonth !== "number" || typeof this.weekOfMonthSuffix !== "string") {
            return formatted;
        }
        format = format.toLowerCase();
        switch (format) {
            case 'numeric':
                formatted = [this.year, this.monthOfYear, this.weekOfMonth, this.dayOfWeek].join('/');
                break;
            case 'short':
                formatted = [this.monthShort, this.weekOfMonth, this.dayOfWeekShort].join('/');
                break;
            case 'standard':
                formatted = [this.year, this.monthShort, this.weekOfMonth, this.dayOfWeekShort].join(' ');
                break;
            case 'medium':
                formatted = [this.weekOfMonth + this.weekOfMonthSuffix, this.dayOfWeekLong + ',', this.monthShort, this.year].join(' ');
                break;
            case 'long':
                formatted = [this.weekOfMonthWord, this.dayOfWeekLong, 'of', this.monthLong, this.year].join(' ');
                break;
        }
        return formatted;
    };

    // 
    private gregYearLength(gregYear: number): number {
        var length = 365;
        if (this.mod(gregYear, 4) == 0 && this.mod(gregYear, 100) != 0) {
            length++;
        }
        else if (this.mod(gregYear, 400) == 0) {
            length++;
        }
        return length;
    };
    //
    private shiftGreg(isNegativeYear: boolean) {
        if (typeof this.gregorianYear !== "number" || typeof this.gregorianDayOfYear !== "number") {
            return;
        }
        if (isNegativeYear) {
            this.gregorianDayOfYear = this.gregorianDayOfYear + this.gregYearLength(this.gregorianYear);
            this.gregorianYear = this.gregorianYear - 1;
        }
        this.gregorianDayOfYear = this.gregorianDayOfYear - this.gregYearLength(this.gregorianYear);
        this.gregorianYear = this.gregorianYear + 1;
    };
    //
    private isResolvedGreg(isNegativeYear: boolean) {
        if (typeof this.gregorianDayOfYear !== "number" || typeof this.gregorianYear !== "number") {
            return true;
        }
        if (isNegativeYear) {
            return this.gregorianDayOfYear >= 0;
        }
        return this.gregorianDayOfYear < this.gregYearLength(this.gregorianYear);
    };
    //
    public fromHumanDay(year: number, dayOfYear: number) {
        var newYearDay = this.getHumanNewYearDay(year);
        var daysSinceEpoch = newYearDay + dayOfYear - 1;
        var isNegativeYear = (daysSinceEpoch < 365);
        this.gregorianYear = 1;
        this.gregorianDayOfYear = daysSinceEpoch;
        while (!this.isResolvedGreg(isNegativeYear)) {
            this.shiftGreg(isNegativeYear);
        }
        var date = new Date(this.gregorianYear, 0);
        date.setDate(this.gregorianDayOfYear)
        this.fromDate(date);
    };
    public fromHumanDate(year: number, month: number, week: number, day: number) {
        let daysInPriorMonths = 0;
        for (var i = 1; i < month; i++) {
            daysInPriorMonths += 7 * ((this.mod(i, 3) == 2) ? 5 : 4);
        }
        let inLeapMonth = (month == 12 && this.isLeapYear(year));
        let weeksInMonth = (this.mod(month, 3) == 2 || inLeapMonth) ? 5 : 4;
        week = Math.max(Math.min(week, weeksInMonth), 1);
        let daysInPriorWeeks = 7 * (week - 1);
        //let daysInPriorWeeks = 7 * (max(min(week, (this.mod(month, 3) == 2 || (month == 12 && this.isLeapYear(year))) ? 5 : 4), 1) - 1);
        this.fromHumanDay(year, daysInPriorMonths + daysInPriorWeeks + day);
    }

  private getWeekdayName(n: number): string {
    let weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return this.getNth(n, weekdayNames);
  };
  private getWeekdayAbbr(n: number): string {
    return this.getWeekdayName(n).substring(0, 3);
  }
  private getMonthName(n: number): string {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return this.getNth(n, monthNames, 'Undefined');
  };
  private getMonthAbbr(n: number): string {
    return this.getMonthName(n).substring(0, 3);
  } 
  private getOrdinalSuffix(n: number): string {
    if (n > 3 && n < 21) return 'th';
    return this.getNth(n % 10, ['st', 'nd', 'rd'], 'th');
  };
  private getOrdinalWord(n: number): string {
      return this.getNth(n, ['First', 'Second', 'Third', 'Fourth', 'Fifth']);
  };
  private getNth(n: number, list: string[], defaultValue = 'Undefined'): string {
      return (n > 0 && n < list.length + 1) ? list[n - 1] : defaultValue;
  }
  public verify(daysSinceEpoch: number): boolean {
      // 1. Calculate Human Date from Days Since Epoch
      // 2. Calculate Gregorian Date from Days Since Epoch
      // 3. Calculate Days Since Epoch from Human Date
      // 4. Verify Days Since Epoch equals original value
      // 5. Calculate Days Since Epoch from Gregorian Date
      // 6. Verify Days Since Epoch equals original value
      // 7. Calculate Human Date from Gregorian Date
      // 8. Verify Human Date equals first value
      // 9. Calculate Gregorian Date from Human Date
      // 10. Verify Gregorian Date equals first value
      return true;
  }
}

export function from(w: any, x?: number, y?: number, z?: number): HumanDate {
    let d = new HumanDate();
    if (w instanceof Date) {
        d.fromDate(w);
    }
    else if (typeof w === "number" && typeof x === "number" && typeof y === "number" && typeof z === "number") {
        d.fromHumanDate(w, x, y, z);
    }
    else if (typeof w === "number" && typeof x === "number") {
        d.fromHumanDay(w, x);
    }
    else if (typeof w === "number") {
        d.verify(w);
    }
    else {
        throw new TypeError("Unable to calculate human date from given parameters");
    }
    return d;
}