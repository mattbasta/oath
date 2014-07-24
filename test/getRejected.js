var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('getRejected', function() {
    it('should return a rejected promise', function(done) {
        oath.getRejected().then(null, done);
    });

    it('should return a rejected promise with a value', function(done) {
        oath.getRejected('foo').then(null, function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });
});
