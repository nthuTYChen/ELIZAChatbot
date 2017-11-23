/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

//建立隨機回應的物件randomResponses，其中有三個欄位neutral, emotional, suspicious
//分別代表針對不同情緒類別的回應，而每個欄位內容都是一個訊息陣列，可以設定各種不同
//的訊息模板，經由隨機的選取過程做為回應
var randomResponses = {
  neutral:
    [
      //每個訊息模板中的%w%是用來標記最後會被替換掉的部份
      "Could you tell me more about %w%?"
    ],
  emotional:
    [
      "You seem a bit emotional when talking about %w%."
    ],
  suspicious:
    [
      "%w% is a very tricky thing."
    ]
};

//選取隨機回應以達到打哈哈效果的功能。接收ELIZA收到的訊息msg、詞類查詢結果msgWordsPOS
//情緒類別emotion、英語詞彙資料庫engLexicon
chooseRandomResponse = function(msg, msgWordsPOS, emotion, engLexicon) {
  //建立儲存最終回應選擇、關鍵字、關鍵字同意字的變數
  var finalChoice = "", keyword = "", synonym = "";
  //根據情緒類別emotion讀取randomResponses中對應情緒的模板訊息陣列
  var emotionResponses = randomResponses[emotion];

  //將訊息msg以空白為基準利用split功能分割為一個陣列，儲存至msgWords變數。陣列中
  //每個位置代表msg中的一個字
  var msgWords = msg.split(" ");

  //利用遞減的for迴圈，從msgWordsPOS的詞類中尋找名詞
  for(index=msgWordsPOS.length-1 ; index>-1 ; index--)
  {
    //如果詞類是名詞的話…
    if(msgWordsPOS[index] === "noun")
    {
      //把對應的msgWords裡的字儲存到keyword變數中
      keyword = msgWords[index];
      //從engLexicon資料庫中用findOne功能，找出唯一一筆Word欄位符合keyword的詞彙
      //資訊，再存入searchResult
      var searchResult = engLexicon.findOne({Word: keyword});
      //如果有找到對應的詞彙資料，searchResult就不會是undefined
      if(searchResult !== undefined)
      {
        //從詞彙資料的Synonym欄位取得同義字的內容，然後儲存到synonym變數裡面
        synonym = searchResult.Synonym;
        //尋找最靠近句尾的名詞的任務已經結束，所以可以中斷遞減for迴圈的執行
        break;
      }
    }
  }

  //根據前面取得的情緒類別回應陣列的長度，來確定回應選擇的數量，並且把這數字存入
  //numOfChoices變數
  var numOfChoices = emotionResponses.length;
  
  //產生介於0-1之間(不含1)的亂數，並存到randomNum變數裡
  var randomNum = Math.random();
  //0-0.99999999之間的亂數乘以numOfChoices，就會變成0-numOfChoices之間
  //(不含numOfChoices)的數字，再代替掉原本的randomNum
  randomNum = randomNum*numOfChoices;
  //利用Math.floor功能把randomNum的小數點無條件捨去後，代替原本的randomNum
  randomNum = Math.floor(randomNum);
  //根據最後的亂數整數randomNum，隨機取得emotionResponses陣列中的任一回應模板
  //存入finalChoice
  finalChoice = emotionResponses[randomNum];

  //如果剛剛有找到同義字，synonym就會有新的內容，而不會是空的字串
  if(synonym !== "")
  {
    //把回應模板中的%w%部份以synonym取代
    finalChoice = finalChoice.replace("%w%", synonym);
  }
  //最後都沒有找到同義字的話
  else
  {
    //把回應模板中的%w%以預設的this訊息取代
    finalChoice = finalChoice.replace("%w%", "this");
  }
  //回傳最終的回應
  return finalChoice;
};
