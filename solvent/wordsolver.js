const wordTransactions = require('../database/query/wordTransactions');

function searchQuery(randomLetter) {
    return new Promise(resolve => {
        let likeQuery = "";
        for (let j = 0; j < randomLetter.length; j++) {
            for (let i = 0; i < randomLetter[j].length; i++) {
                likeQuery += "kelime like " + "'%" + randomLetter[j][i] + "%' ";
                likeQuery += (randomLetter[j].length - 1) != i ? "and " : "";
            }
            likeQuery += "and length(kelime) = " + (randomLetter[j].length + 1);
            let words = wordFind(likeQuery);

            if (words != null)
                resolve(words);
        }
    });
}

function wordFind(likeQuery) {
    return new Promise(resolve => {
        resolve(wordTransactions.Query("Select * from words where " + likeQuery));
    });
}

function getPermutations(array, size) {
    return new Promise(resolve => {
        function p(t, i) {
            if (t.length === size) {
                result.push(t);
                return;
            }
            if (i + 1 > array.length) {
                return;
            }
            p(t.concat(array[i]), i + 1);
            p(t, i + 1);
        }

        var result = [];
        p([], 0);
        resolve(result);
    });
}

module.exports = async (randomLetter) => {
    for (let i = randomLetter.length; i > 1; i--) {
        let permutationList = await getPermutations(randomLetter, i);
        let words = JSON.stringify(await searchQuery(permutationList));
        words = JSON.parse(words);
        if (words.length > 0) {
            return new Promise(resolve => {
                resolve({word: words[0].kelime});
            });
        }
    }
    return new Promise(resolve => {
        resolve({word: 'Kelime Bulunamadı'});
    });
}