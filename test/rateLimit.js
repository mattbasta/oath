var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('rateLimit', function() {

    function prom(data, timeout, reject) {
        return function() {
            return new Promise(function(res, rej) {
                setTimeout(reject ? rej : res, timeout || 10, data);
            });
        };
    }

    it('should resolve immediately when fewer promises are passed than the limit', function(done) {
        oath.rateLimit(
            4,
            [prom(), prom(), prom()]
        ).then(function(data) {
            assert.equal(data.length, 3);
            done();
        });
    });

    it('should resolve when all promises have been completed', function(done) {
        oath.rateLimit(
            1,
            [prom(), prom(), prom()]
        ).then(function(data) {
            assert.equal(data.length, 3);
            done();
        });
    });

    it('should preserve data from resolved promises', function(done) {
        oath.rateLimit(
            1,
            [prom(1), prom(2), prom(3)]
        ).then(function(data) {
            assert.equal(data.length, 3);
            assert.equal(data[0], 1);
            assert.equal(data[1], 2);
            assert.equal(data[2], 3);
            done();
        });
    });

    it('should ignore rejected data', function(done) {
        oath.rateLimit(
            1,
            [prom(1), prom(2, null, true), prom(3)]
        ).then(function(data) {
            assert.equal(data.length, 3);
            assert.equal(data[0], 1);
            assert.equal(data[1], null);
            assert.equal(data[2], 3);
            done();
        });
    });

    it('should reject on first rejection if asked to', function(done) {
        oath.rateLimit(
            1,
            [prom(1, null, true), prom(2), prom(3)],
            true
        ).then(null, done);
    });
});
