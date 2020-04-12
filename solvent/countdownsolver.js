let bestvalue;

//Transactions
let operations = {
    "+": function (n1, n2) { if (n1 < 0 || n2 < 0) return false; return n1 + n2; },
    "-": function (n1, n2) { if (n2 >= n1) return false; return n1 - n2; },
    "_": function (n2, n1) { if (n2 >= n1) return false; return n1 - n2; },
    "*": function (n1, n2) { return n1 * n2; },
    "/": function (n1, n2) { if (n2 == 0 || n1 % n2 != 0) return false; return n1 / n2; },
    "?": function (n2, n1) { if (n2 == 0 || n1 % n2 != 0) return false; return n1 / n2; },
};

let operationsCOST = {
    "+": 1,
    "-": 1.05,
    "_": 1.05,
    "*": 1.2,
    "/": 1.3,
    "?": 1.3,
};

//Probability list calculation
function countdownSolver(numbers, was_generated, target, levels = numbers.length, valsums = 0, trickshot = false, searchedi = 0) {
    levels--;

    for (let i = 0; i < numbers.length - 1; i++) {
        let ni = numbers[i];

        if (ni === false)
            continue;

        numbers[i] = false;

        for (let j = i + 1; j < numbers.length; j++) {
            let nj = numbers[j];

            if (nj === false)
                continue;

            if (i < searchedi && !was_generated[i] && !was_generated[j])
                continue;

            for (let o in operations) {
                let r = operations[o](ni[0], nj[0]);
                if (r === false)
                    continue;

                let op_cost = Math.abs(r);
                while (op_cost % 10 == 0 && op_cost != 0)
                    op_cost /= 10;
                if ((ni[0] == 10 || nj[0] == 10) && o == '*')
                    op_cost = 1;
                op_cost *= operationsCOST[o];

                let newvalsums = valsums + op_cost;

                if ((Math.abs(r - target) < Math.abs(bestresult[0] - target)) ||
                    (Math.abs(r - target) == Math.abs(bestresult[0] - target) && (trickshot || newvalsums < bestvalue))) {
                    bestresult = [r, o, ni, nj];
                    bestvalue = newvalsums;
                }

                numbers[j] = [r, o, ni, nj];
                let old_was_gen = was_generated[j];
                was_generated[j] = true;

                if (levels > 0 && (trickshot || bestresult[0] != target || newvalsums < bestvalue))
                    countdownSolver(numbers, was_generated, target, levels, newvalsums, trickshot, i + 1);

                was_generated[j] = old_was_gen;
                numbers[j] = nj;
            }
        }

        numbers[i] = ni;
    }
}

//result calculation function
function tidyupResult(result) {
    let mapping = {
        "?": "/",
        "_": "-"
    };

    let swappable = {
        "*": true,
        "+": true
    };

    if (result.length < 4)
        return result;

    for (let i = 2; i < result.length; i++) {
        let child = result[i];

        child = tidyupResult(child);

        if (child[1] == result[1] && swappable[result[1]]) {
            result.splice(i--, 1);
            result = result.concat(child.slice(2));
        } else {
            result[i] = child;
        }
    }

    if (result[1] in mapping) {
        result[1] = mapping[result[1]];
        let j = result[2];
        result[2] = result[3];
        result[3] = j;
    } else if (swappable[result[1]]) {
        childs = result.slice(2).sort(function (a, b) { return b[0] - a[0]; });
        for (let i = 2; i < result.length; i++)
            result[i] = childs[i - 2];
    }

    return result;
}

//Array transaction
function fullSize(array) {
    if (array.constructor != Array)
        return 0;

    let l = 0;

    for (let i = 0; i < array.length; i++)
        l += fullSize(array[i]);

    return l + array.length;
}

//Fast result function
function serialiseResult(result) {
    let childparts = [];

    for (let i = 2; i < result.length; i++) {
        let child = result[i];
        if (child.length >= 4)
            childparts.push(serialiseResult(child));
    }

    childparts = childparts.sort(function (a, b) { return fullSize(b) - fullSize(a); });

    let parts = [];
    for (let i = 0; i < childparts.length; i++) {
        parts = parts.concat(childparts[i]);
    }

    let sliced = result.slice(2).map(function (l) { return l[0]; });
    let thispart = [result[0], result[1]].concat(sliced);

    return parts.concat([thispart]);
}

//Creating result output
function stringifyResult(serialised, target) {
    let output = '';

    serialised = serialised.slice(0);

    for (let i = 0; i < serialised.length; i++) {
        let x = serialised[i];

        let args = x.slice(2);
        output += args.join(' ' + x[1] + ' ') + ' = ' + x[0] + '</br>';
    }

    let result = serialised[serialised.length - 1][0];
    //Score calculation 
    let score = (9 - Math.abs(result - target));

    return { result: output, score: score };
}

//numbers array revised function
function solveNumbers(numbers, target, trickshot) {
    numbers = numbers.map(function (x) { return [x, false] });

    let was_generated = [];
    for (let i = 0; i < numbers.length; i++)
        was_generated.push(false);

    countdownSolver(numbers, was_generated, target);

    return bestresult;
}

//Main function
module.exports = (numbers, target, trickshot = false) => {
    //All numbers multiplication calculation   
    let mulMax = 1;
    for (let i = 0; i < numbers.length; i++)
        mulMax *= numbers[i];

    if (mulMax < target)
        return { result: "İşlemin sonucu sağlanmamaktadır.", score: 0 };

    numberMax = numbers[numbers.length - 1];
    bestresult = [numberMax, numberMax];

    if (numberMax == target)
        return target + '=' + target;

    return stringifyResult(serialiseResult(tidyupResult(solveNumbers(numbers, target, trickshot))), target);
}