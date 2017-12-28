loadTrainingData = function() {
  nGramDB.remove({});
  nGramDB.insert({type: "monogramFreq", totalFreq: 0});
  nGramDB.insert({type: "bigramFreq", totalFreq: 0});
  nGramDB.insert({type: "trigramFreq", totalFreq: 0});

  var filename = "", articleString = "";

  for(fileNum=1 ; fileNum<=10 ; fileNum++)
  {
    filename = fileNum+".txt";
    articleString = Assets.getText("articles/"+filename);

    articleString = articleString.replace(/\r\n/g, " ");
    articleString = articleString.replace(/\n+/g, " ");
    articleString = articleString.replace(/\s+/g, " ");

    articleString = "# "+articleString+" #";
    articleString = articleString.split(" ");
    processNGram(articleString);
  }
  //calculateNGramFreqProb();
};

var processNGram = function(str) {
  for(wdNum=0 ; wdNum<str.length ; wdNum++)
  {
    var searchResult;
    //Trigram
    if(wdNum < str.length-2)
    {
      var trigram1 = str[wdNum];
      var trigram2 = str[wdNum+1];
      var trigram3 = str[wdNum+2];

      searchResult =
        nGramDB.findOne({trigram1: trigram1, trigram2: trigram2, trigram3: trigram3});
      if(searchResult === undefined)
      {
        nGramDB.insert({
          type: "trigram",
          trigram1: trigram1,
          trigram2: trigram2,
          trigram3: trigram3,
          rawFreq: 1
        });
      }
      else
      {
        nGramDB.update({
          trigram1: trigram1,
          trigram2: trigram2,
          trigram3: trigram3
        }, {
          $inc: {rawFreq: 1}
        });
      }
    }
    nGramDB.update({type: "trigramFreq"}, {$inc: {totalFreq: 1}});
    //Bigram
    if(wdNum < str.length-1)
    {
      var bigram1 = str[wdNum];
      var bigram2 = str[wdNum+1];

      searchResult =
        nGramDB.findOne({bigram1: bigram1, bigram2: bigram2});
      if(searchResult === undefined)
      {
        nGramDB.insert({
          type: "bigram",
          bigram1: bigram1,
          bigram2: bigram2,
          rawFreq: 1
        });
      }
      else
      {
        nGramDB.update({
          bigram1: bigram1,
          bigram2: bigram2
        }, {
          $inc: {rawFreq: 1}
        });
      }
      nGramDB.update({type: "bigramFreq"}, {$inc: {totalFreq: 1}});
    }
    //Monogram
    var monogram = str[wdNum];

    searchResult =
      nGramDB.findOne({monogram: monogram});
    if(searchResult === undefined)
    {
      nGramDB.insert({
        type: "monogram",
        monogram: monogram,
        rawFreq: 1
      });
    }
    else
    {
      nGramDB.update({
        monogram: monogram
      }, {
        $inc: {rawFreq: 1}
      });
    }
    nGramDB.update({type: "monogramFreq"}, {$inc: {totalFreq: 1}});
  }
  //console.log(nGramDB.find({type: "monogram", rawFreq: {$gte: 50}}).fetch());
};
