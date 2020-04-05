var bestvalsums;

var OPS = {
    "+": function (n1, n2) { if (n1 < 0 || n2 < 0) return false; return n1 + n2; },
    "-": function (n1, n2) { if (n2 >= n1) return false; return n1 - n2; },
    "_": function (n2, n1) { if (n2 >= n1) return false; return n1 - n2; },
    "*": function (n1, n2) { return n1 * n2; },
    "/": function (n1, n2) { if (n2 == 0 || n1 % n2 != 0) return false; return n1 / n2; },
    "?": function (n2, n1) { if (n2 == 0 || n1 % n2 != 0) return false; return n1 / n2; },
};

var OPCOST = {
    "+": 1,
    "-": 1.05,
    "_": 1.05,
    "*": 1.2,
    "/": 1.3,
    "?": 1.3,
};

function _recurse_solve_numbers(numbers, was_generated, target, levels = numbers.length, valsums = 0, trickshot = false, searchedi = 0) {
    levels--;

    for (var i = 0; i < numbers.length - 1; i++) {
        var ni = numbers[i];

        if (ni === false)
            continue;

        numbers[i] = false;

        for (var j = i + 1; j < numbers.length; j++) {
            var nj = numbers[j];

            if (nj === false)
                continue;

            if (i < searchedi && !was_generated[i] && !was_generated[j])
                continue;

            for (var o in OPS) {
                var r = OPS[o](ni[0], nj[0]);
                if (r === false)
                    continue;

                var op_cost = Math.abs(r);
                while (op_cost % 10 == 0 && op_cost != 0)
                    op_cost /= 10;
                if ((ni[0] == 10 || nj[0] == 10) && o == '*')
                    op_cost = 1;
                op_cost *= OPCOST[o];

                var newvalsums = valsums + op_cost;

                if ((Math.abs(r - target) < Math.abs(bestresult[0] - target)) ||
                    (Math.abs(r - target) == Math.abs(bestresult[0] - target) && (trickshot || newvalsums < bestvalsums))) {
                    bestresult = [r, o, ni, nj];
                    bestvalsums = newvalsums;
                }

                numbers[j] = [r, o, ni, nj];
                var old_was_gen = was_generated[j];
                was_generated[j] = true;

                if (levels > 0 && (trickshot || bestresult[0] != target || newvalsums < bestvalsums))
                    _recurse_solve_numbers(numbers, was_generated, target, levels, newvalsums, trickshot, i + 1);

                was_generated[j] = old_was_gen;
                numbers[j] = nj;
            }
        }

        numbers[i] = ni;
    }
}

function tidyup_result(result) {
    var mapping = {
        "?": "/",
        "_": "-"
    };

    var swappable = {
        "*": true,
        "+": true
    };

    if (result.length < 4)
        return result;

    for (var i = 2; i < result.length; i++) {
        var child = result[i];

        child = tidyup_result(child);

        if (child[1] == result[1] && swappable[result[1]]) {
            result.splice(i--, 1);
            result = result.concat(child.slice(2));
        } else {
            result[i] = child;
        }
    }

    if (result[1] in mapping) {
        result[1] = mapping[result[1]];
        var j = result[2];
        result[2] = result[3];
        result[3] = j;
    } else if (swappable[result[1]]) {
        childs = result.slice(2).sort(function (a, b) { return b[0] - a[0]; });
        for (var i = 2; i < result.length; i++)
            result[i] = childs[i - 2];
    }

    return result;
}

function fullsize(array) {
    if (array.constructor != Array)
        return 0;

    var l = 0;

    for (var i = 0; i < array.length; i++)
        l += fullsize(array[i]);

    return l + array.length;
}

function serialise_result(result) {
    var childparts = [];

    for (var i = 2; i < result.length; i++) {
        var child = result[i];
        if (child.length >= 4)
            childparts.push(serialise_result(child));
    }

    childparts = childparts.sort(function (a, b) { return fullsize(b) - fullsize(a); });

    var parts = [];
    for (var i = 0; i < childparts.length; i++) {
        parts = parts.concat(childparts[i]);
    }

    var sliced = result.slice(2).map(function (l) { return l[0]; });
    var thispart = [result[0], result[1]].concat(sliced);

    return parts.concat([thispart]);
}

function stringify_result(serialised, target) {
    var output = '';

    serialised = serialised.slice(0);

    for (var i = 0; i < serialised.length; i++) {
        var x = serialised[i];

        var args = x.slice(2);
        output += args.join(' ' + x[1] + ' ') + ' = ' + x[0] + '</br>';
    }

    var result = serialised[serialised.length - 1][0];
    output += '(Başarım Puanı: ' + (9 - Math.abs(result - target)) + ')';

    return output;
}

function _solve_numbers(numbers, target, trickshot) {
    numbers = numbers.map(function (x) { return [x, false] });

    var was_generated = [];
    for (var i = 0; i < numbers.length; i++)
        was_generated.push(false);

    _recurse_solve_numbers(numbers, was_generated, target);

    return bestresult;
}

module.exports = function solve_numbers(numbers, target, trickshot = false) {
    numberMax = numbers[numbers.length - 1];
    bestresult = [numberMax, numberMax];

    if (numberMax == target)
        return target + '=' + target;

    return stringify_result(serialise_result(tidyup_result(_solve_numbers(numbers, target, trickshot))), target);
}