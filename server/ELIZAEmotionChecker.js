emotionChecker = function(msg) {
  var emotion = "neutral";
  if(msg.indexOf("!") > -1)
  {
    emotion = "emotional";
  }
  else if(msg.indexOf("?") > -1)
  {
    emotion = "suspicious";
  }
  return emotion;
};
