/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 9, 2017
*/

//找字的功能wordSearch，會接收訊息msg跟英語字彙資料庫engLexicon
wordSearch = function(msg, engLexicon) {
  //建立儲存搜尋結果的變數，並定義為空白字串
  var wordSearchResult = "";
  //判斷msg裡是否有關鍵字Which 10。有此關鍵字才會執行以下的搜尋功能
  //否則wordSearchResult會維持空白字串的狀態
  if(msg.indexOf("Which 10") > -1)
  {
    //建立儲存搜尋結果的變數allMatches，但是不賦予意義，讓他保持undefined的狀況
    var allMatches;
    //判斷msg裡是否包含verb此關鍵字
    if(msg.indexOf("verb") > -1)
    {
      //搜尋engLexicon所有POS是verb的字
      allMatches = engLexicon.find({POS: "verb"});
    }
    //判斷msg裡是否包含noun此關鍵字
    else if(msg.indexOf("noun") > -1)
    {
      //搜尋engLexicon所有POS是noun的字
      allMatches = engLexicon.find({POS: "noun"});
    }
    //判斷msg裡是否包含adjective此關鍵字
    else if(msg.indexOf("adjective") > -1)
    {
      //搜尋engLexicon所有POS是adjective的字
      allMatches = engLexicon.find({POS: "adjective"});
    }
    //如果有任何搜尋結果的話，allMatches不會是undefined
    if(allMatches !== undefined)
    {
      //把搜尋到的資料用fetch()轉換成陣列
      allMatches = allMatches.fetch();
      //利用for迴圈取出前10筆資料
      for(index=0 ; index<10 ; index++)
      {
        var randomNum = Math.random();
        randomNum = randomNum*allMatches.length;
        randomNum = Math.floor(randomNum);
        //把每一筆字的資料的拼字Word取出，累加到wordSearchResult
        wordSearchResult = wordSearchResult+allMatches[randomNum].Word+", ";
      }
      //最後在wordSearchResult前加上There you go:的訊息
      wordSearchResult = "There you go: "+wordSearchResult;
    }
    //如果沒有任何搜尋結果的話，allMatches會維持undefined
    else
    {
      //將wordSearchResult填入預設的找不到任何資訊的訊息
      wordSearchResult = "Sorry, I got nothing for you.";
    }
  }
  //回傳wordSearchResult到main.js裡
  return wordSearchResult;
};
