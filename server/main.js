/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Jan 4, 2018
*/

//把msgRecords的mongoDB資料庫連結到msgRecords這個伺服器端的Global Variable
msgRecords = new Mongo.Collection("msgRecords");
//把nGramDB的mongoDB資料庫連結到nGramDB這個伺服器端的Global Variable
nGramDB = new Mongo.Collection("nGramDB");
var engLexicon = new Mongo.Collection("engLexicon");

Meteor.startup(function(){
  //所有在程式啟動時會在伺服器執行的程式碼都會放在這裡
  //ELIZALoadLexicon.js中把英語字彙列表讀到engLexicon資料庫的loadEngLexicon功能
  //在每個新的App裡只需要執行一次，執行完就可以用註解標記標起來
  //loadEngLexicon(engLexicon);
  
  //ELIZAnGramTrainer.js中把AI文章中的NGram讀到NGramDB中的功能
  //在每個新的App裡只需要執行一次，執行完就可以用註解標記標起來
  //loadTrainingData();
});

//所有大腦(伺服器)的功能都會在這裡定義
Meteor.methods({
  //接收訊息的大腦功能msgReceiver，會接收到一個訊息msg。
  /***請勿變更此功能內容***/
  msgReceiver: function(msg) {

    //每一個訊息都會被放進msgRecords資料庫，而每一筆資料都會包含三種資訊：
    //time代表訊息被存入資料庫的時間(new Date()會得到當下的系統時間)、speaker
    //代表說話者(接收到的訊息的說話者是You)、msg則是訊息本身(接收到的msg變數)
    msgRecords.insert({time: new Date(), speaker: "You", msg: msg});

    //呼叫運算接收到的訊息的內部功能processMsg，並傳送msg訊息
    processMsg(msg);
    //回傳一個執行完畢的訊號
    return;
  },
  //重設訊息資料庫的大腦功能resetELIZA。
  /***除預設訊息的內容之外，請勿變更此功能***/
  resetELIZA: function() {
    //移除所有msgRecords資料庫的記憶
    msgRecords.remove({});
    //移除所有資料後放入一筆預設的訊息資料
    msgRecords.insert({time: new Date(), speaker: "ELIZA", msg: "This is ELIZA. How are you doing today?"});
    //回傳一個執行完畢的訊號
    return;
  }
});

//自訂的大腦功能函數，只能在伺服器內部呼叫。在這邊是由msgReceiver這個大腦功能呼叫
//會接收到一個msg訊息並進行訊息運算與處理
var processMsg = function(msg) {  //請勿變更此行
  //建立一個processResults變數儲存訊息運算處理的結果
  var processResults = "";  //請勿變更此行
  //建立儲存情緒類別和每個字的詞類的變數
  var emotion = "", msgWordsPOS = [];
  //「以下」是你可以編輯的部份，請將你的ELIZA處理訊息的核心程式碼放在以下的段落內

  //第一步：先把訊息msg傳送至ELIZAEmotionChecker.js檢查訊息的情緒。回傳的情緒類別
  //存入emotion變數
  emotion = emotionChecker(msg);

  //第二步：把訊息跟英語詞彙資料庫傳送到ELIZAPOSIdentifier.js中的posIdentifier
  //功能，查詢每個字的詞類。詞類陣列回傳後存入msgWordsPOS變數。
  msgWordsPOS = posIdentifier(msg, engLexicon);

  //第三步：把訊息傳入ELIZASocialSkill.js裡的socialResponse功能是否是打招呼或說再見
  //處理結果存入processResults
  processResults = socialResponse(msg);

  //第四步：processResults為空白字串代表還沒有適當回應
  if(processResults === "")
  {
    //呼叫ELIZAWordSearch.js中的wordSearch功能，看是不是詢問字彙的問題，並且把收到
    //的訊息msg跟engLexicon傳過去。wordSearch回傳的查詢結果儲存至processResults
    processResults = wordSearch(msg, engLexicon);
  }

  //第五步：processResults為空白字串代表還沒有適當回應
  if(processResults === "")
  {
    //呼叫ELIZAPOSSearch.js中的posSearch功能，看是不是詢問詞類的問題，並且把收到的
    //訊息msg跟engLexicon傳過去。posSearch回傳的結果儲存至processResults
    processResults = posSearch(msg, engLexicon);
  }

  //第六步：processResults為空白字串代表還沒有適當回應
  if(processResults === "")
  {
    //呼叫ELIZAweatherInfo.js中的weatherInfo功能，把ELIZA接收到的訊息msg傳過去
    //看看是不是查詢天氣的訊息，再把回傳結果存到processResults中
    processResults = weatherInfo(msg);
  }

  //第七步：processResults為空白字串代表還沒有適當回應
  if(processResults === "")
  {
    //呼叫ELIZAnGramTrainer.js中的produceAIArticle功能，把ELIZA接收到的訊息msg
    //傳過去，看是不是詢問AI相關資訊的訊息，再把回傳結果存到processResults中
    processResults = produceAIArticle(msg);
  }

  //第八步：processResults為空白字串代表還沒有適當回應
  if(processResults === "")
  {
    //呼叫ELIZAOtherResponses.js中的chooseRandomResponse，以獲得一個隨機的回應。
    //傳入訊息msg、詞類查詢結果msgWordsPOS、情緒類別emotion、以及英語字彙資料庫
    //engLexicon
    processResults = chooseRandomResponse(msg, msgWordsPOS, emotion, engLexicon);
  }

  //「以上」是你可以編輯的部份，請將你的ELIZA處理訊息的核心程式碼放在以上的段落內

  //在msgRecords資料庫放入運算訊息之後的結果，做為ELIZA的回應，請勿變更此行
  msgRecords.insert({time: new Date(), speaker: 'ELIZA', msg: processResults});
};//請勿變更此行
