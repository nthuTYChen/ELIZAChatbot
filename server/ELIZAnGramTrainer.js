/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Jan 4, 2018
*/

//自動產生AI相關文章的功能，接收main.js傳過來ELIZA收到的訊息msg
produceAIArticle = function(msg) {
  //建立一個Regular Expression來判斷收到的訊息是不是符合下面類似的句型：
  //What is AI? How do you think about AI? Tell me something about AI.
  var AIMsgRegExp = /(what|how|tell me).* AI/ig;
  //如果msg內容符合上面的Regular Expression，msg.match(AIMsgRegExp)的結果
  //就不會是null
  if(msg.match(AIMsgRegExp) !== null)
  {
    //符合Regular Expression的情況，呼叫generateRandomAIArticle功能，以產生一篇
    //AI相關的文章，並且回傳這個結果到main.js
    return generateRandomAIArticle();
  }
  //不符合Regular Expression的情況下，回傳空字串到main.js
  else
  {
    return "";
  }
};

//自動產生AI相關文章
var generateRandomAIArticle = function() {
  //設定randomAIArticle變數儲存自動產生文章的內容，以及nGramNum變數設定
  //要用幾個NGram產生AI相關的文章
  var randomAIArticle = "", nGramNum = 100;
  
  //先從nGramDB資料庫找出所有以文章標記開頭的Trigrams，如：# This is，# It is等
  //把所有的結果用fetch()功能轉成陣列後儲存到allInitialTrigrams變數
  var allInitialTrigrams = nGramDB.find({trigram1: "#"}).fetch();

  //把allInitialTrigrams傳送到randomNGramSelection功能，隨機選擇一個起始的Trigram
  //並且把這個Trigram儲存到initialTrigram變數裡
  var initialTrigram = randomNGramSelection(allInitialTrigrams);
  
  //把initialTrigram中的個別monogram加到randomAIArticle中，並且用空格分隔每個
  //各別的monogram
  randomAIArticle =
    initialTrigram.trigram1+" "+initialTrigram.trigram2+" "+
    initialTrigram.trigram3+" ";

  //把initialTrigram的後面兩個monogram做為新的NGram的前兩個monogram。例：
  //如果initialTrigram是# This is，那下一步就是要找This is開頭的Trigram，或是
  //is開頭的Bigram。所以在這邊我們把initialTrigram的trigram2存到newNGram1變數中，
  //然後把initialTrigram的trigram3存到newNGram2變數中
  var newNGram1 = initialTrigram.trigram2;
  var newNGram2 = initialTrigram.trigram3;

  //建立一個selectedNewNGram變數儲存下一個NGram的資訊
  var selectedNewNGram;

  //執行for迴圈，按照nGramNum設定的數目決定要用幾個NGram「接龍」產生這篇文章
  for(wd=1 ; wd<=nGramNum ; wd++)
  {
    //首先先尋找可以接下去的Trigram。假設initialTrigram是# This is，那就希望可以找到
    //This is開頭的Trigram。所以新的Trigram的搜尋條件使用trigram1符合newNGram1內容
    //trigram2符合newNGram2的內容，再用fetch()把搜尋結果轉換成陣列存到trigramMatches
    var trigramMatches =
      nGramDB.find({trigram1: newNGram1, trigram2: newNGram2}).fetch();
    //如果有找到符合條件的trigram，那陣列的長度會大於0
    if(trigramMatches.length > 0)
    {
      //把trigramMatches傳到randomNGramSelection功能裡，隨機選擇一個trigram，再把
      //結果存到selectedNewNGram裡
      selectedNewNGram = randomNGramSelection(trigramMatches);
      //把新的Trigram的最後一個monogram (trigram3)加上一個空格，加到目前的
      //randomAIArticle，再取代目前的randomAIArticle
      randomAIArticle = randomAIArticle+selectedNewNGram.trigram3+" ";
      //把newNGram2「往前移」存入newNGram1，再把新的Trigram的trigram3「往前移」
      //存入newNGram2，更新下一次NGram搜尋的起始關鍵字
      newNGram1 = newNGram2;
      newNGram2 = selectedNewNGram.trigram3;
    }
    //如果沒有找到符合條件的trigram，那就退一步(back-off)，搜尋bigram
    else
    {
      //使用newNGram2，也是目前randomAIArticle的最後一個字，做為bigram1的內容，
      //搜尋所有符合以newNGram2開頭的bigram，並用fetch()轉換成陣列存到bigramMatches中
      var bigramMatches = nGramDB.find({bigram1: newNGram2}).fetch();
      //一樣，有搜尋結果的話bigramMatches陣列長度會大於零
      if(bigramMatches.length > 0)
      {
        //把所有找到的bigram放到randomNGramSelection功能中，隨機選擇一個bigram
        //存入selectedNewNGram
        selectedNewNGram = randomNGramSelection(bigramMatches);
        //把新的bigram的bigram2這個monogram加上一個空格後，附加到目前的randomAIArticle中，
        //再取代原本的randomAIArticle
        randomAIArticle = randomAIArticle+selectedNewNGram.bigram2+" ";
        //一樣把newNGram2「往前移」存入newNGram1，然後目前的bigram的bigram2「往前移」
        //存入newNGram2
        newNGram1 = newNGram2;
        newNGram2 = selectedNewNGram.bigram2;
      }
      //如果連符合條件的bigram都找不到，再退一步，只找monogram
      else
      {
        //從資料庫把所有的monogram找出來(條件是type為monogram的資料)，再用fetch()
        //轉換為陣列
        var monogramMatches = nGramDB.find({type: "monogram"}).fetch();
        //因為一定有monogram，所以不用再檢查monogramMatches的陣列長度是否大於0
        //把所有的monogram放入randomNGramSelection功能中，隨機選擇一個monogram後
        //存入selectedNewNGram
        selectedNewNGram = randomNGramSelection(monogramMatches);
        //把目前的monogram附加到原本的randomAIArticle上，再取代原本的randomAIArticle
        randomAIArticle = randomAIArticle+selectedNewNGram.monogram+" ";
        //一樣把newNGram2「往前移」存入newNGram1，再把目前的monogram往前移，存入
        //newNGram2
        newNGram1 = newNGram2;
        newNGram2 = selectedNewNGram.monogram;
      }
    }
  }

  //結束for迴圈後，準備收尾，先試著找看看是否有連結目前文章最後一個字newNGram2以及
  //文章符號#的trigram。因此從nGramDB中搜尋trigram1是newNGram2，以及trigram3是
  //文章符號#的trigram。
  var trigramMatches = nGramDB.find({trigram1: newNGram2, trigram3: "#"});
  //一樣，有搜尋結果的話trigramMatches陣列長度會大於零
  if(trigramMatches.length > 0)
  {
    //把trigramMatches傳到randomNGramSelection功能裡，隨機選擇一個trigram，再把
    //結果存到selectedNewNGram裡
    selectedNewNGram = randomNGramSelection(trigramMatches);
    //把選擇的trigram中的trigram2加上空格以及文章符號#，附加到原本的randomAIArticle
    //上，再取代原本的randomAIArticle
    randomAIArticle = randomAIArticle+selectedNewNGram.trigram2+" #";
  }
  //如果沒找到符合的trigram，就算了。把randomAIArticle加上空格及文章結尾符號就結束
  else
  {
    randomAIArticle = randomAIArticle+" #";
  }
  //回傳整篇文章到produceAIArticle功能中
  return randomAIArticle;
};

//隨機選擇NGram的功能，接收generateRandomAIArticle功能中傳過來的NGrams陣列
var randomNGramSelection = function(NGrams) {
  //設定累加的NGram頻率變數，以NGram的出現頻率決定NGram被選擇的機率
  var totalRawFreq = 0;
  //先利用for迴圈把NGrams中所有的rawFreq累加至totalRawFreq變數中
  //比如說ABC.rawFreq = 381, ABD.rawFreq = 102, ABE.rawFreq = 15
  //那累加起來的totalRawFreq就會是498
  for(NGram=0 ; NGram<NGrams.length ; NGram++)
  {
    totalRawFreq = totalRawFreq+NGrams[NGram].rawFreq;
  }
  //產生一個0至totalRawFreq之間的變數，存到randomNum裡
  //如果是上面的例子，就是0到498之間(不含498)的數字
  var randomNum = Math.random()*totalRawFreq;
  
  //把totalRawFreq歸零，因為我們還要利用累加rawFreq的方式，讓totalRawFreq大於
  //randomNum的時候選擇目前的NGram回傳
  totalRawFreq = 0;
  
  //一樣執行迴圈，開始重新累加所有NGram的rawFreq到totalRawFreq中
  for(newNGram=0 ; newNGram<NGrams.length ; newNGram++)
  {
    totalRawFreq = totalRawFreq+NGrams[newNGram].rawFreq;
    //每次累加完畢，就檢查目前的totalRawFreq是否大於randomNum
    if(totalRawFreq > randomNum)
    {
      //如果大於randomNum，就選擇回傳目前的NGram，然後停止迴圈的執行
      return NGrams[newNGram];
      //以上面的例子來說，因為ABC.rawFreq的數字很大，所以有很大的機率累加完ABC.rawFreq
      //就totalRawFreq就大於randomNum，所以回傳ABC的機率最高。而會有比較低的
      //機率會累加完ABD.rawFreq之後，totalRawFreq才會比randomNum大。因此回傳ABD的
      //機率較低。而因為ABE.rawFreq最小，所以會有很低的機率累加完ABE.rawFreq之後，
      //totalRawFreq才會比randomNum大。因此，回傳ABE的機會最小(但不是沒有)。
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
