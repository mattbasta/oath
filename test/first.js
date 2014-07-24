var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('first', function() {
    it('should return only the first resolved result', function(done) {
        oath.first([
            new Promise(function(res) {
                setTimeout(res, 10, 'foo');
            }),
            new Promise(function(res) {
                setTimeout(res, 20, 'bar');
            })
        ]).then(function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });

    it('should return only the first rejected result', function(done) {
        oath.first([
            new Promise(function(_, rej) {
                setTimeout(rej, 20, 'bar');
            }),
            new Promise(function(_, rej) {
                setTimeout(rej, 10, 'foo');
            })
        ]).then(null, function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });

    it('should return only the first resolved or rejected result', function(done) {
        oath.first([
            new Promise(function(res) {
                setTimeout(res, 10, 'foo');
            }),
            new Promise(function(_, rej) {
                setTimeout(rej, 20, 'bar');
            })
        ]).then(function(val) {
            assert.equal(val, 'foo');
            done();
        });
    });
});
