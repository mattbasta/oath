var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('map', function() {
    it('should map all results immediately and not at the end', function(done) {
        var start = Date.now();
        oath.map(
            [
                new Promise(function(res) {
                    setTimeout(res, 100, 'foo');
                }),
                new Promise(function(res) {
                    setTimeout(res, 20, 'bar');
                })
            ],
            function(input) {
                return new Promise(function(res) {
                    if (input === 'foo')
                        res('oof');
                    else
                        setTimeout(res, 80, input);
                });
            }
        ).then(function(val) {
            var delta = Date.now() - start;
            assert(delta < 130);
            assert.equal(val.length, 2);
            assert.equal(val[0], 'oof');
            assert.equal(val[1], 'bar');
            done();
        });
    });

    it('should accept an optional context', function(done) {
        oath.map(
            [
                new Promise(function(res) {
                    setTimeout(res, 10, 'foo');
                }),
                new Promise(function(res) {
                    setTimeout(res, 20, 'bar');
                })
            ],
            function(input) {
                assert.equal(this.foo, 'bar');
                return input;
            },
            {foo: 'bar'}
        ).then(function(val) {
            assert.equal(val.length, 2);
            assert.equal(val[0], 'foo');
            assert.equal(val[1], 'bar');
            done();
        });
    });

});
