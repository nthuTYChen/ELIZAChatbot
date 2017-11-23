/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 23, 2017
*/

//判斷情緒類別的功能。接收ELIZA所得到的訊息msg
emotionChecker = function(msg) {
  //建立emotion變數，並設定預設的情緒類別改為neutral
  var emotion = "neutral";
  //檢查訊息是否代有驚嘆號，有的話把情緒類別改為emotional
  if(msg.indexOf("!") > -1)
  {
    emotion = "emotional";
  }
  //沒有驚嘆號的話檢查是否有包含問號，有的話把情緒類別改為suspicious
  else if(msg.indexOf("?") > -1)
  {
    emotion = "suspicious";
  }
  //回傳情緒類別。如果沒有問號也沒有驚嘆號，則會回傳預設內容neutral
  return emotion;
};
