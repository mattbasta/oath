var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('always', function() {
    it('should resolve when a passed promise resolves', function(done) {
        oath.always(oath.getResolved(1)).then(function(val) {
            assert.equal(val, 1);
            done();
        });
    });

    it('should reject when a passed promise rejects', function(done) {
        oath.always(oath.getRejected(2)).then(function(val) {
            assert.equal(val, 2);
            done();
        });
    });

});
