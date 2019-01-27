#!/usr/bin/env node

var request = require('request');
var async = require('async');

var headers = {
    'origin': 'https://developer.wordnik.com',
    'accept-language': 'en-US,en;q=0.9,te;q=0.8',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.53 Safari/537.36',
    'accept': 'application/json',
    'referer': 'https://developer.wordnik.com/docs',
    'authority': 'api.wordnik.com'
};


//Method to get word definitions
function getDefinitions(word, callback){
    var url = 'https://api.wordnik.com/v4/word.json/'+word+'/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        var definitions = [];
        if(!error){
            async.each(json_data, function(definition, cb){
                definitions.push(definition.text);
                cb()
            }, function(){
                callback({'Definitions': definitions});
            });
            //console.log(json_data);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });
    //return definitions;
}

//Method to get word synonyms
function getSynonyms(word, callback){
   var url = 'https://api.wordnik.com/v4/word.json/'+word+'/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';
    
    requestApi(url, function(error, json_data){
        var synonyms = [];
        if(!error){
            async.each(json_data[0].words, function(synonym, cb){
                synonyms.push(synonym);
                cb()
            }, function(){
                callback({'Synonyms': synonyms});
            });
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });

    //return synonyms;
}

//Method to get word antonyms
function getAntonyms(word, callback){
    var url = 'https://api.wordnik.com/v4/word.json/'+word+'/relatedWords?useCanonical=false&relationshipTypes=antonym&limitPerRelationshipType=10&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        var antonyms = [];
        if(!error){
            async.each(json_data[0].words, function(antonym, cb){
                antonyms.push(antonym);
                cb()
            }, function(){
                callback({'Antonyms': antonyms});
            });
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });

    //return antonyms;
}

//Method to get word examples
function getExamples(word, callback){
    var url = 'https://api.wordnik.com/v4/word.json/'+word+'/examples?includeDuplicates=false&useCanonical=false&limit=5&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        var examples = [];
        console.log(json_data);
        if(!error){
            async.each(json_data.examples, function(example, cb){
                examples.push(example.text);
                cb()
            }, function(){
                callback({'Examples': examples});
            });
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });

    //return examples;
}

//Method to get full information about word
function getFullDict(word, callback){
    var fullInfo = [];
    fullInfo.push(getDefinitions(word));
    fullInfo.push(getSynonyms(word));
    fullInfo.push(getAntonyms(word));
    fullInfo.push(getExamples(word));
    console.log(fullInfo);
}

//Method to get word of the day
function getWOD(callback){
    var url = 'https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        if(!error){
            callback({'word': json_data.word});
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });

    //return word;
}

//Method to get random word
function getRandomWord(callback){
    var url = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        if(!error){
            callback({'word': json_data.word});
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback()
        }
    });

    //return word;
}

//Method to play word game
function play(){
    
    return;
}

//Method to call api
function requestApi(url, cb){
    request(url, function callback(error, response, body) {
        //console.log(response);
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            //console.log(data);
            cb(null, data);
        }
        else{
            console.log("\n\nSomething is wrong!!!");
            //console.log(response.status);
            cb(error, null);
        }
    });
}

function displayResults(word, title, info){
    console.log(title+" of the word '"+word+"' are:");
    async.forEach(info, function(row){
        console.log("\t* "+row);
    });
}

var args = process.argv.slice(2);

word = 'freedom';

getWOD(function(defs){
    console.log(defs);
})
//getSynonyms(word);
//getAntonyms(word);
//getExamples(word);
//getWOD();
//getRandomWord();
//getFullDict(word);

//console.log(args)
