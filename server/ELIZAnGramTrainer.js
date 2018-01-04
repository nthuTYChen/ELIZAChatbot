/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Dec 28, 2017
*/

produceAIArticle = function(msg) {
  var AIMsgRegExp = /(what|how|tell me).* AI/ig;
  if(msg.match(AIMsgRegExp) !== null)
  {
    return generateRandomAIArticle();
  }
  else
  {
    return "";
  }
};

var generateRandomAIArticle = function() {
  var randomAIArticle = "", nGramNum = 100;
  var allInitialTrigrams = nGramDB.find({trigram1: "#"}).fetch();

  var initialTrigram = randomNGramSelection(allInitialTrigrams);
  randomAIArticle =
    initialTrigram.trigram1+" "+initialTrigram.trigram2+" "+
    initialTrigram.trigram3+" ";

  var newNGram1 = initialTrigram.trigram2;
  var newNGram2 = initialTrigram.trigram3;

  var selectedNewNGram;

  for(wd=1 ; wd<=nGramNum ; wd++)
  {
    var trigramMatches =
      nGramDB.find({trigram1: newNGram1, trigram2: newNGram2}).fetch();
    if(trigramMatches.length > 0)
    {
      selectedNewNGram = randomNGramSelection(trigramMatches);
      randomAIArticle = randomAIArticle+selectedNewNGram.trigram3+" ";
      newNGram1 = newNGram2;
      newNGram2 = selectedNewNGram.trigram3;
    }
    else
    {
      var bigramMatches = nGramDB.find({bigram1: newNGram2}).fetch();
      if(bigramMatches.length > 0)
      {
        selectedNewNGram = randomNGramSelection(bigramMatches);
        randomAIArticle = randomAIArticle+selectedNewNGram.bigram2+" ";
        newNGram1 = newNGram2;
        newNGram2 = selectedNewNGram.bigram2;
      }
      else
      {
        var monogramMatches = nGramDB.find({type: "monogram"}).fetch();
        selectedNewNGram = randomNGramSelection(monogramMatches);
        randomAIArticle = randomAIArticle+selectedNewNGram.monogram+" ";
        newNGram1 = newNGram2;
        newNGram2 = selectedNewNGram.monogram;
      }
    }
  }

  var trigramMatches = nGramDB.find({trigram1: newNGram2, trigram3: "#"});
  if(trigramMatches.length > 0)
  {
    selectedNewNGram = randomNGramSelection(trigramMatches);
    randomAIArticle = randomAIArticle+selectedNewNGram.trigram2+" #";
  }
  else
  {
    randomAIArticle = randomAIArticle+" #";
  }

  return randomAIArticle;
};

var randomNGramSelection = function(NGrams) {
  var totalRawFreq = 0;
  for(NGram=0 ; NGram<NGrams.length ; NGram++)
  {
    totalRawFreq = totalRawFreq+NGrams[NGram].rawFreq;
  }
  var randomNum = Math.random()*totalRawFreq;
  totalRawFreq = 0;
  for(newNGram=0 ; newNGram<NGrams.length ; newNGram++)
  {
    totalRawFreq = totalRawFreq+NGrams[newNGram].rawFreq;
    if(totalRawFreq > randomNum)
    {
      return NGrams[newNGram];
    }
  }
};

//讀取NGram的功能
loadTrainingData = function() {
  //先移除舊的nGramDB資料
  nGramDB.remove({});
  //插入三筆分別統計monogram、bigram跟trigram的總次數(totalFreq)的資料
  //totalFreq起始值是0，代表次數是0
  nGramDB.insert({type: "monogramFreq", totalFreq: 0});
  nGramDB.insert({type: "bigramFreq", totalFreq: 0});
  nGramDB.insert({type: "trigramFreq", totalFreq: 0});

  //建立儲存檔案名稱用的變數filename以及儲存文章字串用的變數articleString
  var filename = "", articleString = "";

  //使用for迴圈按順序讀入AI文章，起始值fileNum是1，所以從1.txt開始讀取
  //目前是10篇文章，所以會讀取到10.txt，可按照文章多寡變更
  for(fileNum=1 ; fileNum<=10 ; fileNum++)
  {
    //組合fileNum數字與.txt副檔名成為目標檔案名稱
    filename = fileNum+".txt";
    //利用Assets.getText讀取private/articles下的filename，存到articleString
    articleString = Assets.getText("articles/"+filename);

    //把(連續的)換行符號、連續的空白以單一個空白取代
    articleString = articleString.replace(/\r\n/g, " ");
    articleString = articleString.replace(/\n+/g, " ");
    articleString = articleString.replace(/\s+/g, " ");

    //頭尾加上#號代表文章的起點與終點，且用空白隔開
    articleString = "# "+articleString+" #";
    //以空白為基準使用split功能斷字，然後把斷字產生的陣列存回articleString
    articleString = articleString.split(" ");
    //把字串陣列articleString傳入processNGram功能進行NGram的處理與計算
    processNGram(articleString);
  }
  //calculateNGramFreqProb();
};

//處理字串陣列str，並計算NGram的功能
var processNGram = function(str) {
  //從字串陣列中的第一個字(wdNum=0)開始處理
  for(wdNum=0 ; wdNum<str.length ; wdNum++)
  {
    //建立searchResult變數儲存資料庫搜尋的結果
    var searchResult;
    //處理Trigram：目前的wdNum必須小於str陣列長度2以上，這樣才能用目前的字跟後面
    //兩個字組合成為一個trigram
    if(wdNum < str.length-2)
    {
      //Trigram的第一個部份：目前的字
      var trigram1 = str[wdNum];
      //Trigram的第二個部份：下一個字
      var trigram2 = str[wdNum+1];
      //Trigram的第三個部份：下下個字
      var trigram3 = str[wdNum+2];
      //搜尋NGramDB中是否有trigram1、trigram2、trigram3有符合變數
      //trigram1、trigram2、trigram3內容的資料
      searchResult =
        nGramDB.findOne({trigram1: trigram1, trigram2: trigram2, trigram3: trigram3});
      //如果沒有符合的資料searchResult就會是undefined
      if(searchResult === undefined)
      {
        //沒有符合的資料就用insert把這個trigram放入nGramDB中
        nGramDB.insert({
          type: "trigram",  //type欄位為trigram
          trigram1: trigram1, //trigram1欄位為trigram1的變數內容
          trigram2: trigram2, //trigram2欄位為trigram2的變數內容
          trigram3: trigram3, //trigram3欄位為trigram3的變數內容
          rawFreq: 1 //第一次發現這個trigram，所以rawFreq(次數)是1
        });
      }
      //有符合的資料的話，用update更新rawFreq欄位就可以了
      else
      {
        //update功能的第一個物件是搜尋標準，所以一樣是搜尋NGramDB中是否有trigram1、
        //trigram2、trigram3有符合變數trigram1、trigram2、trigram3內容的資料
        //第二個物件則是更新的動作，這邊我們使用$inc，代表rawFreq這個欄位會累加
        //而rawFreq: 1代表是累加1
        nGramDB.update({
          trigram1: trigram1,
          trigram2: trigram2,
          trigram3: trigram3
        }, {
          $inc: {rawFreq: 1}
        });
      }
      //每處理完一trigram後，更新trigramFreq這筆資料的totalFreq，累加1
      nGramDB.update({type: "trigramFreq"}, {$inc: {totalFreq: 1}});
    }
    //處理Bigram：目前的wdNum必須小於str陣列長度1以上，這樣才能用目前的字跟後面
    //一個字組合成為一個bigram
    //以下程式碼邏輯與上面雷同，不再次說明
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
    //處理Bigram：目前的字本身就是monogram
    //以下程式碼邏輯與上面雷同，不再次說明
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
