var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('ignore', function() {
    it('should ignore results from all rejected promises', function(done) {
        oath.ignore(
            [
                oath.getResolved(1),
                oath.getRejected(2),
                oath.getResolved(3),
                oath.getResolved(4)
            ]
        ).then(function(val) {
            assert.equal(val.length, 3);
            assert.equal(val[0], 1);
            assert.equal(val[1], 3);
            assert.equal(val[2], 4);
            done();
        });
    });

});
