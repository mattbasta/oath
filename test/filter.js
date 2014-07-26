var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


describe('filter', function() {
    it('should filter all results', function(done) {
        oath.filter(
            [
                oath.getResolved(1),
                oath.getResolved(2),
                oath.getResolved(3),
                oath.getResolved(4)
            ],
            function(input) {
                return input % 2 == 0;
            }
        ).then(function(val) {
            assert.equal(val.length, 2);
            assert.equal(val[0], 2);
            assert.equal(val[1], 4);
            done();
        });
    });

    it('should accept an optional context', function(done) {
        oath.filter(
            [
                oath.getResolved(1),
                oath.getResolved(2),
                oath.getResolved(3),
                oath.getResolved(4)
            ],
            function(input) {
                assert.equal(this.foo, 'bar');
                return input % 2 == 0;
            },
            {foo: 'bar'}
        ).then(function(val) {
            assert.equal(val.length, 2);
            assert.equal(val[0], 2);
            assert.equal(val[1], 4);
            done();
        });
    });

    it('should reject when any passed promise rejects', function(done) {
        oath.filter(
            [
                oath.getResolved(1),
                oath.getRejected(2),
                oath.getResolved(3),
                oath.getResolved(4)
            ],
            function() {
                return true;
            }
        ).then(null, function(val) {
            assert.equal(val, 2);
            done();
        });
    });

    it('should not omit accepted falsey values', function(done) {
        oath.filter(
            [
                oath.getResolved(0),
                oath.getResolved(false),
                oath.getResolved(null),
                oath.getResolved()
            ],
            function(input) {
                return true;
            }
        ).then(function(val) {
            assert.equal(val.length, 4);
            assert.equal(val[0], 0);
            assert.equal(val[1], false);
            assert.equal(val[2], null);
            assert.equal(val[3], undefined);
            done();
        });
    });

    it('should ignore values produced by rejected iterator', function(done) {
        oath.filter(
            [
                oath.getResolved(1),
                oath.getResolved(2),
                oath.getResolved(3),
                oath.getResolved(4)
            ],
            function(input) {
                return oath.getRejected();
            }
        ).then(function(val) {
            assert.equal(val.length, 0);
            done();
        });
    });

    it('should default to the identity function for an iterator', function(done) {
        oath.filter(
            [
                oath.getResolved(1),
                oath.getResolved(0),
                oath.getResolved(3),
                oath.getResolved(false)
            ]
        ).then(function(val) {
            assert.equal(val.length, 3);
            assert.equal(val[0], 1);
            assert.equal(val[1], 0);
            assert.equal(val[2], 3);
            done();
        });
    });

});
