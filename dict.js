var request = require('request');

var headers = {
    'origin': 'https://developer.wordnik.com',
    'accept-language': 'en-US,en;q=0.9,te;q=0.8',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.53 Safari/537.36',
    'accept': 'application/json',
    'referer': 'https://developer.wordnik.com/docs',
    'authority': 'api.wordnik.com'
};


//Method to get word definition
function getDefinition(word){

    return definitions;
}

//Method to get word synonyms
function getSynonyms(word){

    return synonyms;
}

//Method to get word antonyms
function getAntonyms(word){

    return antonyms;
}

//Method to get word examples
function getExamples(word){

    return examples;
}

//Method to get full information about word
function getFullDict(word){
    getDefinitions(word);
    getSynonyms(word);
    getAntonyms(word);
    getExamples(word);
}

//Method to get word of the day
function getWOD(){

    return word;
}

//Method to get random word
function getRandomWord(){


    return word;
}

//Method to play word game
function play(){
    
    return;
}

//Method to call api
function requestApi(url, callback){
    request(url, headers, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            #console.log(response.status);
            var data = JSON.parse(body);
            callback(data);
        }
        else{
            console.log("Something is wrong!!!");
            console.log(response.status);
            console.log(error);
            callback();
        }
    }
}



var args = process.argv.slice(2);

url: 'https://api.wordnik.com/v4/word.json/angry/definitions?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e',
