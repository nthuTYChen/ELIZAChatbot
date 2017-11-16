//建立posSearch功能接收msg與engLexicon
posSearch = function(msg, engLexicon) {
  //設定posQ字串變數設定pos問題的關鍵字串
  var posQ = "What is the POS of the word ";
  //建立posSearchResults變數準備儲存搜尋結果
  var posSearchResults = "";
  //確認接收到的訊息msg中是否有找到posQ這個問題的關鍵字串
  if(msg.indexOf(posQ) > -1)
  {
    var targetWord = "";
    var startPos = posQ.length;
    var endPos;
    if(msg.indexOf("?") > -1)
    {
      endPos = msg.indexOf("?");
    }
    else
    {
      endPos = msg.length;
    }
    targetWord = msg.substring(startPos, endPos);
    var wordInfo = engLexicon.findOne({Word: targetWord});
    if(wordInfo !== undefined)
    {
      if(wordInfo.POS.indexOf("ad") === 0)
      {
        posSearchResults = "It's an "+wordInfo.POS+".";
      }
      else
      {
        posSearchResults = "It's a "+wordInfo.POS+".";
      }
    }
    else
    {
      posSearchResults = "Sorry, I can't find this word.";
    }
  }
  //回傳搜尋結果
  return posSearchResults;
};
