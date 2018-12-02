declare class HumanDate {
    private static readonly DAY_MILLISECONDS;
    private static readonly CYCLE_YEARS;
    private static readonly CYCLE_LEAPS;
    private static readonly LEAP_COEFFICIENT;
    private static readonly MEAN_YEAR;
    date: Date | undefined;
    year: number | undefined;
    dayOfYear: number | undefined;
    iso: string | undefined;
    daysSinceEpoch: number | undefined;
    yearWeek: number | undefined;
    quarter: number | undefined;
    dayOfQuarter: number | undefined;
    weekOfQuarter: number | undefined;
    monthOfQuarter: number | undefined;
    inLeapYear: boolean | undefined;
    inLeapMonth: boolean | undefined;
    daysInMonth: number | undefined;
    monthOfYear: number | undefined;
    monthShort: string | undefined;
    monthLong: string | undefined;
    dayOfMonth: number | undefined;
    dayOfMonthSuffix: string | undefined;
    weekOfMonth: number | undefined;
    weekOfMonthSuffix: string | undefined;
    weekOfMonthWord: string | undefined;
    dayOfWeek: number | undefined;
    dayOfWeekShort: string | undefined;
    dayOfWeekLong: string | undefined;
    daysInYear: number | undefined;
    micro: string | undefined;
    short: string | undefined;
    standard: string | undefined;
    medium: string | undefined;
    long: string | undefined;
    gregorianYear: number | undefined;
    gregorianDayOfYear: number | undefined;
    newYearDay: number | undefined;
    fromDate(date: Date): void;
    private getGregorianDayOfYear;
    private getPriorElapsedDays;
    private getHumanYear;
    private greaterThanHumanYear;
    private lessThanHumanYear;
    private getHumanNewYearDay;
    private isLeapYear;
    quotient(x: number, y: number): number;
    private mod;
    /**
     * Formats
     *
     * Numeric  1999/12/5/7
     * Short    Dec/5/Sun
     * Standard 1999 Dec 5 Sun
     * Medium   5th Sunday, Dec 1999
     * Full     Fifth Sunday of December 1999
     */
    private format;
    private gregYearLength;
    private shiftGreg;
    private isResolvedGreg;
    fromHumanDay(year: number, dayOfYear: number): void;
    fromHumanDate(year: number, month: number, week: number, day: number): void;
    private getWeekdayName;
    private getWeekdayAbbr;
    private getMonthName;
    private getMonthAbbr;
    private getOrdinalSuffix;
    private getOrdinalWord;
    private getNth;
    verify(daysSinceEpoch: number): boolean;
}
export declare function from(w: any, x?: number, y?: number, z?: number): HumanDate;
export {};
