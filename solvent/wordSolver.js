const TransactionFactory = require('../database');
const queryTransaction = TransactionFactory.create('queryTransactions');
const mysql = require('mysql');

//Creating the condition
function searchQuery(randomLetter) {
    return new Promise(resolve => {
        for (let j = 0; j < randomLetter.length; j++) {
            let likeQuery = "";
            for (let i = 0; i < randomLetter[j].length; i++) {
                likeQuery += " word like " + mysql.escape(`%${randomLetter[j][i]}%`);
                likeQuery += (randomLetter[j].length - 1) != i ? " and" : "";
            }
            likeQuery += `and length(word) = ${mysql.escape((randomLetter[j].length + 1))}`;
            let words = wordFind(likeQuery);
            if (words != null)
                resolve(words);
        }
    });
}

//Find word in database
function wordFind(likeQuery) {
    return new Promise(resolve => {
        resolve(queryTransaction.queryAsync("SELECT * FROM TBL_NAME WHERE" + likeQuery));
    });
}

//Permutation possibility list
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

//Score calculation 
function scoreCalculation(wordLength) {
    return new Promise(resolve => {
        let score = 0;
        if (wordLength <= 5) {
            score = wordLength;
        }
        else {
            switch (wordLength) {
                case 6:
                    score = 7;
                    break;

                case 7:
                    score = 9;
                    break;
                case 8:
                    score = 11;
                    break;

                case 9:
                    score = 15;
                    break
            }
        }
        resolve(score);
    });
}

//Main function
module.exports = async (randomLetter) => {
    for (let i = randomLetter.length; i > 1; i--) {
        //Permutation possibility list
        let permutationList = await getPermutations(randomLetter, i);
        //Creating the condition and find word in database
        let words = JSON.stringify(await searchQuery(permutationList));
        words = JSON.parse(words);
        if (words.length > 0) {
            //Score calculation
            let score = await scoreCalculation(words[0].word.length);
            //return json format word
            return new Promise(resolve => {
                resolve({ word: words[0].word, score });
            });
        }
    }
    return new Promise(resolve => {
        resolve({ word: 'Kelime Bulunamadı', score: 0 });
    });
}