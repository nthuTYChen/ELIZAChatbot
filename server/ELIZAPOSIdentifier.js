posIdentifier = function(msg, engLexicon) {
  var msgWords = msg.split(" ");
  var msgWordsPOS = [];
  for(index=0 ; index<msgWords.length ; index++)
  {
    var currentWord = msgWords[index];
    var wordInfo = engLexicon.findOne({Word: currentWord});
    if(wordInfo !== undefined)
    {
      msgWordsPOS.push(wordInfo.POS);
    }
    else
    {
      msgWordsPOS.push("na");
    }
  }
  return msgWordsPOS;
};
