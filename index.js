var Promise = require('promise');


function identity(x) {
    return x;
}

function argsOrArr(func) {
    return function(arr) {
        if (arguments.length > 1) {
            arr = Array.prototype.slice.call(arguments, 0);
        } else if (!(arr instanceof Array)) {
            arr = [arr];
        }
        return func.call(this, arr);
    };
}


exports.getResolved = function(val) {
    return new Promise(function(res) {
        res(val);
    });
};
exports.getRejected = function(val) {
    return new Promise(function(_, rej) {
        rej(val);
    });
};


exports.all = Promise.all.bind(Promise);

exports.first = exports.race = argsOrArr(function(arr) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].then(resolve, reject);
        }
    });
});

exports.any = argsOrArr(function(arr) {
    var len = arr.length;
    var rejected = 0;
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < len; i++) {
            arr[i].then(resolve, function() {
                rejected++;
                if (rejected === len) {
                    reject();
                }
            });
        }
    });
});

exports.rateLimit = function(limit, arr, rejectShouldAbort) {
    var active = 0;
    var index = 0;
    // Keep a copy of the input so we don't modify the original.
    var queue = arr.slice(0);

    var results = [];

    return new Promise(function(resolve, reject) {
        function runOne() {
            active++;
            var idx = index++;
            var current = queue.shift()();

            current = current.then(function(val) {
                active--;
                results[idx] = val;
                if (queue.length) {
                    setImmediate(runOne);
                } else if (active === 0) {
                    resolve(results);
                }
            }, function() {
                active--;
                if (rejectShouldAbort) {
                    reject();
                } else if (queue.length) {
                    setImmediate(runOne);
                } else if (active === 0) {
                    resolve(results);
                }
            });
        }

        for (var i = 0; i < limit && queue.length; i++) {
            runOne();
        }

    });
};

exports.map = function(arr, iterator, context) {
    var len = arr.length;
    var resolved = 0;

    if (context) iterator = iterator.bind(context);

    var results = [];
    return new Promise(function(resolve, reject) {
        arr.forEach(function(prom, i) {
            prom.then(iterator).then(function(val) {
                results[i] = val;
                if (++resolved === len) {
                    resolve(results);
                }
            }, reject);
        });
    });
};

exports.filter = function(arr, iterator, context) {
    var len = arr.length;
    var completed = 0;

    iterator = iterator || identity;
    if (context) iterator = iterator.bind(context);

    var resMap = [];
    var results = [];
    return new Promise(function(resolve, reject) {
        arr.forEach(function(prom, i) {
            prom = prom.then(function(val) {
                return results[i] = val;
            }).then(iterator).then(function(val) {
                if (val === false) return;
                resMap[i] = true;
            });
            _always(prom).then(function() {
                if (++completed !== len) return;
                resolve(results.filter(function(_, i) {
                    return resMap[i];
                }));
            });
        });
    });
};

exports.ignore = function(arr) {
    var len = arr.length;
    var completed = 0;

    var resMap = [];
    var results = [];
    return new Promise(function(resolve, reject) {
        arr.forEach(function(prom, i) {
            prom = prom.then(function(val) {
                resMap[i] = true;
                results[i] = val;
            });
            _always(prom).then(function() {
                if (++completed !== len) return;
                resolve(results.filter(function(_, i) {
                    return resMap[i];
                }));
            });
        });
    });
};

var _always = exports.always = function(promise) {
    return new Promise(function(res) {
        promise.then(res, res);
    });
}
