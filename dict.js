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
                callback(definitions);
            });
            //console.log(json_data);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });
}

//Method to get word synonyms
function getSynonyms(word, callback){
   var url = 'https://api.wordnik.com/v4/word.json/'+word+'/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';
    
    requestApi(url, function(error, json_data){
        var synonyms = [];
        if(!error && json_data[0]){
            async.each(json_data[0].words, function(synonym, cb){
                synonyms.push(synonym);
                cb()
            }, function(){
                callback(synonyms);
            });
        }
        else if (!json_data[0]){
            callback([]);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });
}

//Method to get word antonyms
function getAntonyms(word, callback){
    var url = 'https://api.wordnik.com/v4/word.json/'+word+'/relatedWords?useCanonical=false&relationshipTypes=antonym&limitPerRelationshipType=10&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        var antonyms = [];
        if(!error && json_data[0]){
            async.each(json_data[0].words, function(antonym, cb){
                antonyms.push(antonym);
                cb()
            }, function(){
                callback(antonyms);
            });
        }
        else if(!json_data[0]){
            callback([]);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });
}

//Method to get word examples
function getExamples(word, callback){
    var url = 'https://api.wordnik.com/v4/word.json/'+word+'/examples?includeDuplicates=false&useCanonical=false&limit=5&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        var examples = [];
        if(!error && json_data.examples){
            async.each(json_data.examples, function(example, cb){
                examples.push(example.text);
                cb()
            }, function(){
                callback(examples);
            });
        }
        else if(!json_data.examples){
            callback([]);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback();
        }
    });
}

//Method to get full information about word
function getFullDict(word, cb){
    var fullInfo = {};

    async.series([
        function(callback){
            getDefinitions(word, function(result){
                fullInfo['Definitions'] = result;
                callback();
            });
        },
        function(callback){
            getSynonyms(word, function(result){
                fullInfo['Synonyms'] = result;
                callback();
            });
        },
        function(callback){
            getAntonyms(word, function(result){
                fullInfo['Antonyms'] = result;
                callback();
            });
        },
        function(callback){
            getExamples(word, function(result){
                fullInfo['Examples'] = result;
                callback();
            })}], 
        function(result){
            //console.log(fullInfo);
            cb(fullInfo);
        });
}

//Method to get word of the day
function getWOD(callback){
    var url = 'https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        if(!error && json_data.word){
            callback(json_data.word);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback('');
        }
    });
}

//Method to get random word
function getRandomWord(callback){
    var url = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun%2C%20adjective%2C%20verb&maxCorpusCount=-1&minDictionaryCount=5&maxDictionaryCount=-1&minLength=2&maxLength=-1&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e';

    requestApi(url, function(error, json_data){
        if(!error){
            callback(json_data.word);
        }
        else{
            console.log("There is something problem with wordnik API. Try again sometime.\n");
            callback()
        }
    });
}

//Method to play word game
function play(){
    getRandomWord(function(output){
        
        getFullDict(output, function(fullInfo){
            var fullInfo = fullInfo;
            fullInfo["word"] = output;
            console.log("*** Welcome to word guess game ***\n");
            console.log("----------------------------------");
            console.log("  Definition: "+fullInfo.Definitions[0]);
            console.log("  Synonym: "+fullInfo.Synonyms[0]);
            console.log("  Antonym: "+fullInfo.Antonyms[0]);
            
            fullInfo.Definitions.push(fullInfo.Definitions.splice(0, 1)[0]);

            guessTheWord(fullInfo);
        });

    });
}

function guessTheWord(fullInfo){
    prompt("\nGuess the word :", function(input){
        if(input == fullInfo.word){
            console.log("\n\n\n**************************************\nCongrats !!! Your guess is correct!\n**************************************");
        }
        else{
            console.log("\nWrong guess");
            repeat(fullInfo);
        }
    });
}

function repeat(fullInfo){
    console.log("\t1. Try Again");
    console.log("\t2. Get a hint");
    console.log("\t3. Exit");
    prompt("\nEnter your choice:", function(input){
        if(input == 1){
            guessTheWord(fullInfo);
        }
        else if(input == 2 && fullInfo.Definitions != null){
            console.log("Hint: Another definition - "+fullInfo.Definitions[0]);
            fullInfo.Definitions.push(fullInfo.Definitions.splice(0, 1)[0]);
            guessTheWord(fullInfo);
        }
        else{
            console.log('\033[2J');
            console.log("The word is '"+fullInfo.word+'"');
            displayFullDict(fullInfo);
        }
    });
}

function prompt(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}

//Method to call api
function requestApi(url, cb){
    request(url, function callback(error, response, body) {
        //console.log(response);
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            cb(null, data);
        }
        else{
            console.log("\n\nSomething is wrong!!!");
            cb(error, null);
        }
    });
}

function displayResults(word, title, info){
    console.log();
    console.log(title+" of the word '"+word+"' are:");
    console.log("--------------------------------------");
    info.forEach(function(row){
        console.log("\t* "+row);
    });
}

function displayFullDict(fullInfo){
    console.log("\nFull dictionary of the word '"+fullInfo.word+"':");
    console.log("-----------------------------------------------");
    displayResults(fullInfo.word, "'Definitions'", fullInfo.Definitions);
    displayResults(fullInfo.word, "'Synonyms'", fullInfo.Synonyms);
    displayResults(fullInfo.word, "'Antonyms'", fullInfo.Antonyms);
    displayResults(fullInfo.word, "'Examples'", fullInfo.Examples);
}

var args = process.argv.slice(2);

if(args.length == 2){
    var method = args[0];
    var word = args[1];
    switch (method){
        case 'def':
            getDefinitions(word, function(result){
                displayResults(word, "'Definitions'", result);
            });
            break;
        case 'syn':
            getSynonyms(word, function(result){
                displayResults(word, "'Synonyms'", result);
            });
            break;
        case 'ant':
            getAntonyms(word, function(result){
                displayResults(word, "'Antonyms'", result);
            });
            break;
        case 'ex':
            getExamples(word, function(result){
                displayResults(word, "'Examples'", result);
            });
            break;
        case 'dict':
            getFullDict(word, function(fullInfo){
                fullInfo["word"] = word;
                displayFullDict(fullInfo);
            });
            break;
    }
}
else if(args.length == 1){
    play();
}
else{
    getWOD(function(word){
        console.log("\nWord of the Day is : "+ word);
        getFullDict(word, function(fullInfo){
            fullInfo["word"] = word;
            displayFullDict(fullInfo);
        });
    });
}

