/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

//建立posSearch功能接收msg與engLexicon，從msg中抽取目標查詢字，並查詢該字的
//詞類(part of speech)
posSearch = function(msg, engLexicon) {
  //設定posQ字串變數設定pos問題的關鍵字串
  var posQ = "What is the POS of the word ";
  //建立posSearchResults變數準備儲存搜尋結果
  var posSearchResults = "";
  //確認接收到的訊息msg中是否有找到posQ這個問題的關鍵字串
  if(msg.indexOf(posQ) > -1)
  {
    //創造儲存目標查詢字的變數
    var targetWord = "";
    //目標字在字串中的起點是跳過所有問題關鍵字串的部份，而關鍵字串的長度
    //posQ.length代表了關鍵字串posQ結束的位置
    var startPos = posQ.length;
    var endPos;
    //根據句尾有沒有問號來決定目標
    if(msg.indexOf("?") > -1)
    {
      //句尾有問號，則目標字的終點是msg.indexOf("?")代表的問號開始前的位置
      endPos = msg.indexOf("?");
    }
    else
    {
      //句尾沒有問號，則目標字的終點就是句尾位置，而訊息的長度msg.length本身
      //就代表句尾位置
      endPos = msg.length;
    }
    //利用substring功能把目標字根據起點終點取出存入targetWord
    targetWord = msg.substring(startPos, endPos);
    //從engLexicon資料庫中使用findOne功能查詢唯一一筆Word欄位等於目標字targetWord
    //的資料，存入wordInfo
    var wordInfo = engLexicon.findOne({Word: targetWord});
    //如果有找到資料，wordInfo就不會是undefined
    if(wordInfo !== undefined)
    {
      //檢查wordInfo的POS名稱是不是在起點(0)以ad開頭，像是adverb或adjective
      //以使用不同的冠詞a/an
      if(wordInfo.POS.indexOf("ad") === 0)
      {
        //組合回傳訊息
        posSearchResults = "It's an "+wordInfo.POS+".";
      }
      else
      {
        //組合回傳訊息
        posSearchResults = "It's a "+wordInfo.POS+".";
      }
    }
    //如果找不到查詢字資料的話
    else
    {
      //回傳訊息設定為預設的訊息
      posSearchResults = "Sorry, I can't find this word.";
    }
  }
  //回傳搜尋結果
  return posSearchResults;
};
