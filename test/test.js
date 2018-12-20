'use strict';
var expect = require('chai').expect;
var humandates = require('../dist/index.js');
describe('human-dates function test', () => {
    it('should be "2004 Dec 5 Mon"', () => {
        // Monday, Dec 27, 2004 is in a leap week.
        var hd = humandates.from(new Date(2004,11,27));
        expect(hd.standard).to.equal('2004 Dec 5 Mon');
    });
    it('should be 2004-12-27', () => {
        var hd = humandates.from(2004,12,5,1);
        expect(hd.iso.substring(0,10)).to.equal('2004-12-27');
    });
    // Conversion of negative years to BCE:
    // ----
    // Year -2 = 3 BCE
    // Year -1 = 2 BCE
    // Year  0 = 1 BCE
    // Year +1 = 1 CE
    // Year +2 = 2 CE
    // 
    // Conversion of Days Since Epoch:
    // -2 DSE = Dec 29, 1 BCE = 
    // -1 DSE = Dec 30, 1 BCE = 
    //  0 DSE = Dec 31, 1 BCE = 
    // +1 DSE = Jan  1, 1  CE = 
    // +2 DSE = Jan  2, 1  CE = 

    // @TODO Add full test suite
    // A year is "adjacent" if the New Year Day of the Gregorian
    // year and Human year both fall on the same day (always a Monday).
    // Years -10,004 (10,005 BCE) and 10,001 (CE) are the nearest adjacent years
    // that contain all dates within 10,000 BCE and 10,000 CE.
    //
    // For every date between Jan 1, 10,005 BCE and Jan 1, 10,001 CE,
    // 1. Iterate via Date object, incrementing by 1 day
    // 1.a Calculate DSE and HumanDate.verify(DSE)
    // 2.b Use Date object Iterator to verify previous day's DSE is 1 less.
    // 2.c Use Date object Iterator to verify next day's DSE is 1 greater.
    // 2. Iterate via Human Date Iterator, incrementing by 1 day
    // 2.a Calculate DSE and HumanDate.verify(DSE)
    // 2.b Use Human Date Iterator to verify previous day's DSE is 1 less.
    // 2.c Use Human Date Iterator to verify next day's DSE is 1 greater.
});