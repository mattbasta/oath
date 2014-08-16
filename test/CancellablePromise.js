var assert = require('assert');

var Promise = require('promise');

var oath = require('../index.js');


function die() {
    process.exit(1);
}

describe('CancellablePromise', function() {
    it('should resolve like a normal promise', function(done) {
        var prom = new oath.CancellablePromise(function(resolve) {
            resolve();
        });
        prom.then(done);
    });
    it('should reject like a normal promise', function(done) {
        var prom = new oath.CancellablePromise(function(_, reject) {
            reject();
        });
        prom.then(null, done);
    });
    it('should never resolve if cancelled', function(done) {
        var resolver;
        var prom = new oath.CancellablePromise(function(resolve, reject) {
            resolver = resolve;
        });
        prom.then(die, die);

        prom.cancel();
        resolver();

        done();
    });
    it('should never reject if cancelled', function(done) {
        var resolver;
        var prom = new oath.CancellablePromise(function(_, reject) {
            resolver = reject;
        });
        prom.then(die, die);

        prom.cancel();
        resolver();

        done();
    });
    it('should not cancel if resolved', function(done) {
        var resolver;
        var prom = new oath.CancellablePromise(function(resolve, _, cancelCB) {
            resolver = resolve;
            cancelCB(die);
        });
        prom.then(null, die);

        resolver();
        prom.cancel();

        done();
    });
    it('should not cancel if rejected', function(done) {
        var resolver;
        var prom = new oath.CancellablePromise(function(_, reject, cancelCB) {
            resolver = reject;
            cancelCB(die);
        });
        prom.then(die, null);

        resolver();
        prom.cancel();

        done();
    });
    it('should accept cancellation callbacks', function(done) {
        var prom = new oath.CancellablePromise(function(_, _, cancelCB) {
            cancelCB(done);
        });
        prom.then(die, die);

        prom.cancel();
    });
    it('should accept multiple cancellation callbacks', function(done) {
        var times = 0;
        function cancel() {
            times++;
            if (times === 3) done();
        }
        var prom = new oath.CancellablePromise(function(_, _, cancelCB) {
            cancelCB(cancel);
            cancelCB(cancel);
            cancelCB(cancel);
        });
        prom.then(die, die);

        prom.cancel();
    });
    it('should not be cancelled multiple times', function(done) {
        var times = 0;
        function cancel() {
            times++;
            if (times > 1) die();
        }
        var prom = new oath.CancellablePromise(function(_, _, cancelCB) {
            cancelCB(cancel);
        });
        prom.then(die, die);

        prom.cancel();
        prom.cancel();
        prom.cancel();
        prom.cancel();
        done();
    });
    it('should accept a cancellation context', function(done) {
        var times = 0;
        function cancel() {
            assert.equal(this, 'foo');
        }
        var prom = new oath.CancellablePromise(function(_, _, cancelCB) {
            cancelCB(cancel, 'foo');
        });
        prom.then(die, die);

        prom.cancel();
        done();
    });

});
