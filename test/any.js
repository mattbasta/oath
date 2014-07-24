var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('any', function() {
    it('should reject when all passed promises reject', function(done) {
        oath.any(
            oath.getRejected(),
            oath.getRejected(),
            oath.getRejected(),
            oath.getRejected()
        ).then(null, done);
    });

    it('should resolve when at least one promise resolves', function(done) {
        oath.any(
            oath.getRejected(),
            oath.getRejected(),
            oath.getResolved('foo'),
            oath.getRejected()
        ).then(function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });
});
