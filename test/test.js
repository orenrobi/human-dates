'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
describe('getPlural function test', () => {
    it('should be 2004/Dec/5/Mon', () => {
        // Monday, Dec 27, 2004 is in a leap week.
        var hd = index.humanDateFromDate(new Date(2004,11,27));
        expect(hd.standard).to.equal('2004/Dec/5/Mon');
    });
    it('should be 2004-12-27', () => {
        var hd = index.humanDatefromHumanDate(2004,12,5,1);
        expect(hd.iso.substring(0,10)).to.equal('2004-12-27');
    });
});