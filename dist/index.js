"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HumanDate = /** @class */ (function () {
    function HumanDate() {
    }
    HumanDate.prototype.fromDate = function (date) {
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
        this.daysInYear = 7 * ((this.inLeapYear) ? 53 : 52);
        this.micro = this.format('micro');
        this.short = this.format('short');
        this.standard = this.format('standard');
        this.medium = this.format('medium');
        this.long = this.format('long');
    };
    // Find the ordinal date (nth day of year) for a given Gregorian year.
    HumanDate.prototype.getGregorianDayOfYear = function (date) {
        var onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((date.getTime() - onejan.getTime()) / HumanDate.DAY_MILLISECONDS);
    };
    ;
    // Find the number of days that elapsed between the epoch and the given Gregorian year.
    HumanDate.prototype.getPriorElapsedDays = function (gregYear) {
        var priorYear = gregYear - 1;
        var days = (priorYear * 365) + 1;
        days += Math.floor(priorYear / 4);
        days -= Math.floor(priorYear / 100);
        days += Math.floor(priorYear / 400);
        return days;
    };
    ;
    // Find the Human Year containing the given nth day since the epoch.
    HumanDate.prototype.getHumanYear = function (daysSinceEpoch) {
        var meanYear = Math.ceil((daysSinceEpoch - 1) / HumanDate.MEAN_YEAR);
        if (this.greaterThanHumanYear(daysSinceEpoch, meanYear)) {
            return meanYear + 1;
        }
        if (this.lessThanHumanYear(daysSinceEpoch, meanYear)) {
            return meanYear - 1;
        }
        return meanYear;
    };
    ;
    // Check if the given human date as days since epoch falls later than the given year.
    HumanDate.prototype.greaterThanHumanYear = function (daysSinceEpoch, humanYear) {
        //let newYearDay = this.getHumanNewYearDay(humanYear);
        //let nextNewYear = this.getHumanNewYearDay(humanYear + 1);
        //return (daysSinceEpoch - newYearDay) >= (7 * 52) && (daysSinceEpoch >= nextNewYear));
        var nextNewYear = this.getHumanNewYearDay(humanYear + 1);
        return daysSinceEpoch >= nextNewYear;
    };
    // Check if the given human date as days since epoch falls before the given year.
    HumanDate.prototype.lessThanHumanYear = function (daysSinceEpoch, humanYear) {
        var newYearDay = this.getHumanNewYearDay(humanYear);
        return daysSinceEpoch < newYearDay;
    };
    // Returns the days since epoch of Jan 1 of the given human year.
    HumanDate.prototype.getHumanNewYearDay = function (humanYear) {
        var priorYear = humanYear - 1;
        var shortTotal = (7 * 52 * priorYear) + 1;
        var leapTotal = Math.floor(((HumanDate.CYCLE_LEAPS * priorYear) + HumanDate.LEAP_COEFFICIENT) / HumanDate.CYCLE_YEARS);
        return (7 * leapTotal) + shortTotal;
    };
    ;
    // Returns whether the given human year is a leap year with a 53rd week
    HumanDate.prototype.isLeapYear = function (year) {
        var dividend = (HumanDate.CYCLE_LEAPS * year) + HumanDate.LEAP_COEFFICIENT;
        var accumulator = this.mod(dividend, HumanDate.CYCLE_YEARS);
        return accumulator < HumanDate.CYCLE_LEAPS;
    };
    ;
    // Return a modified integer quotient rounded downd from two given numbers.
    HumanDate.prototype.quotient = function (x, y) {
        return Math.floor(x / y);
    };
    ;
    // Return a modified modulo (remainder) of two given numbers.
    HumanDate.prototype.mod = function (x, y) {
        return x - (y * this.quotient(x, y));
    };
    ;
    /**
     * Formats
     *
     * Numeric  1999/12/5/7
     * Short    Dec/5/Sun
     * Standard 1999/Dec/5/Sun
     * Medium   5th Sunday, Dec 1999
     * Full     Fifth Sunday of December 1999
     */
    HumanDate.prototype.format = function (format) {
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
    ;
    // 
    HumanDate.prototype.gregYearLength = function (gregYear) {
        var length = 365;
        if (this.mod(gregYear, 4) == 0 && this.mod(gregYear, 100) != 0) {
            length++;
        }
        else if (this.mod(gregYear, 400) == 0) {
            length++;
        }
        return length;
    };
    ;
    //
    HumanDate.prototype.shiftGreg = function (isNegativeYear) {
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
    ;
    //
    HumanDate.prototype.isResolvedGreg = function (isNegativeYear) {
        if (typeof this.gregorianDayOfYear !== "number" || typeof this.gregorianYear !== "number") {
            return true;
        }
        if (isNegativeYear) {
            return this.gregorianDayOfYear >= 0;
        }
        return this.gregorianDayOfYear < this.gregYearLength(this.gregorianYear);
    };
    ;
    //
    HumanDate.prototype.fromHumanDay = function (year, dayOfYear) {
        var newYearDay = this.getHumanNewYearDay(year);
        var daysSinceEpoch = newYearDay + dayOfYear - 1;
        var isNegativeYear = (daysSinceEpoch < 365);
        this.gregorianYear = 1;
        this.gregorianDayOfYear = daysSinceEpoch;
        while (!this.isResolvedGreg(isNegativeYear)) {
            this.shiftGreg(isNegativeYear);
        }
        var date = new Date(this.gregorianYear, 0);
        date.setDate(this.gregorianDayOfYear);
        this.fromDate(date);
    };
    ;
    HumanDate.prototype.fromHumanDate = function (year, month, week, day) {
        var daysInPriorMonths = 0;
        for (var i = 1; i < month; i++) {
            daysInPriorMonths += 7 * ((this.mod(i, 3) == 2) ? 5 : 4);
        }
        var inLeapMonth = (month == 12 && this.isLeapYear(year));
        var weeksInMonth = (this.mod(month, 3) == 2 || inLeapMonth) ? 5 : 4;
        week = Math.max(Math.min(week, weeksInMonth), 1);
        var daysInPriorWeeks = 7 * (week - 1);
        //let daysInPriorWeeks = 7 * (max(min(week, (this.mod(month, 3) == 2 || (month == 12 && this.isLeapYear(year))) ? 5 : 4), 1) - 1);
        this.fromHumanDay(year, daysInPriorMonths + daysInPriorWeeks + day);
    };
    HumanDate.prototype.getWeekdayName = function (n) {
        var weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (n <= 7 && n >= 1) {
            return weekdayNames[n - 1];
        }
        return 'Undefined';
    };
    ;
    HumanDate.prototype.getWeekdayAbbr = function (n) {
        return this.getWeekdayName(n).substring(0, 3);
    };
    HumanDate.prototype.getMonthName = function (n) {
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (n <= 12 && n >= 1) {
            return monthNames[n - 1];
        }
        return 'Undefined';
    };
    ;
    HumanDate.prototype.getMonthAbbr = function (n) {
        return this.getMonthName(n).substring(0, 3);
    };
    HumanDate.prototype.getOrdinalSuffix = function (n) {
        if (n > 3 && n < 21)
            return 'th';
        switch (n % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };
    ;
    HumanDate.prototype.getOrdinalWord = function (n) {
        switch (n) {
            case 1:
                return 'First';
            case 2:
                return 'Second';
            case 3:
                return 'Third';
            case 4:
                return 'Fourth';
            case 5:
                return 'Fifth';
            default:
                return '';
        }
    };
    ;
    // Derivation: 1000 * 60 * 60 * 24
    HumanDate.DAY_MILLISECONDS = 86400000;
    // Length of a leap cycle in the standard Symmetry454 calendar system.
    HumanDate.CYCLE_YEARS = 293;
    // The number of leap years during one leap cycle in the Symmetry454 system.
    HumanDate.CYCLE_LEAPS = 52;
    // Used to determine whether a year is leap. Derivation: (CYCLE_YEARS - 1) / 2
    HumanDate.LEAP_COEFFICIENT = 146;
    // Derivation: ((CYCLE_YEARS * 52) + CYCLE_LEAPS))  * 7) / CYCLE_YEARS
    HumanDate.MEAN_YEAR = 365.24232081911265;
    return HumanDate;
}());
/*
function humanDateFromDate(date: Date): HumanDate {
    let d = new HumanDate();
    d.fromDate(date);
    return d;
}
function humanDateFromHumanDate(y: number,m: number,w: number,day: number): HumanDate {
    let d = new HumanDate();
    d.fromHumanDate(y,m,w,day);
    return d;
}
*/
var d = new HumanDate();
d.fromDate(new Date(2004, 11, 27));
console.log(d.standard);
console.log('2004/Dec/5/Mon');
console.log('===');
d.fromHumanDate(2004, 12, 5, 1);
if (typeof d.iso === "string") {
    console.log(d.iso.substring(0, 10));
    console.log('2004-12-27');
}
