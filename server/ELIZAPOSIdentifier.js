/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 23, 2017
*/

//查詢訊息中每個字的詞類功能。接收ELIZA收到的訊息msg以及英語詞彙資料庫engLexicon
posIdentifier = function(msg, engLexicon) {
  //將訊息msg以空白為基準，用split功能切割為一個陣列存入msgWords，
  //每個陣列的位置代表一個字
  var msgWords = msg.split(" ");
  //建立msgWordsPOS變數，準備儲存每個字的詞類
  var msgWordsPOS = [];
  //以for迴圈查詢msgWords陣列中的每個字
  for(index=0 ; index<msgWords.length ; index++)
  {
    //將目前的字msgWords[index]存入currentWord變數
    var currentWord = msgWords[index];
    //使用findOne功能查詢engLexicon資料庫中唯一Word欄位符合currentWord的資料
    //並且將資料儲存至wordInfo變數
    var wordInfo = engLexicon.findOne({Word: currentWord});
    //如有查詢的結果，wordInfo將不會是undefined的狀態
    if(wordInfo !== undefined)
    {
      //將該筆wordInfo裡的詞類POS欄位的資料，用陣列的push功能，增加到msgWordsPOS
      //陣列中的最後一個位置
      msgWordsPOS.push(wordInfo.POS);
    }
    //如果沒有查詢的結果，wordInfo變數將會是undefined的狀態
    else
    {
      //將na這個字串用陣列的push功能增加到msgWordsPOS陣列中的最後一個位置，代表
      //找不到這個字的詞類
      msgWordsPOS.push("na");
    }
  }
  //把msgWordsPOS詞類陣列回傳至main.js
  return msgWordsPOS;
};
