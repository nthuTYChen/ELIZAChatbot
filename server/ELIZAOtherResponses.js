/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

var randomResponses = {
  neutral:
    [
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



chooseRandomResponse = function(msg, msgWordsPOS, emotion, engLexicon) {
  var finalChoice = "", keyword = "", synonym = "";
  var emotionResponses = randomResponses[emotion];

  var msgWords = msg.split(" ");

  for(index=msgWordsPOS.length-1 ; index>-1 ; index--)
  {
    if(msgWordsPOS[index] === "noun")
    {
      keyword = msgWords[index];
      var searchResult = engLexicon.findOne({Word: keyword});
      if(searchResult !== undefined)
      {
        synonym = searchResult.Synonym;
        break;
      }
    }
  }

  var numOfChoices = emotionResponses.length;
  var randomNum = Math.random();
  randomNum = randomNum*numOfChoices;
  randomNum = Math.floor(randomNum);
  finalChoice = emotionResponses[randomNum];

  if(synonym !== "")
  {
    finalChoice = finalChoice.replace("%w%", synonym);
  }
  else
  {
    finalChoice = finalChoice.replace("%w%", "this");
  }

  return finalChoice;
};
