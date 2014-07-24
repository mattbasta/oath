var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('getResolved', function() {
    it('should return a resolved promise', function(done) {
        oath.getResolved().then(done);
    });

    it('should return a resolved promise with a value', function(done) {
        oath.getResolved('foo').then(function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });
});
