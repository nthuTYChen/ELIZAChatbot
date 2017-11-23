/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

var randomResponses = {
  neutral:
    [
      "Could you tell me more about it?",
      "I'm afriad this is not a good idea.",
      "Hmm. This very interesting.",
      "Life is a box of chocolate, right?"
    ],
  emotional:
    ["You need to calm down a little bit.",
     "I like it a lot."
    ],
  suspicious:
    ["I'm not interested in this question.",
     "This is a very good question.",
     "I can feel your uncertainty.",
     "挖恩災~"
    ]
};



chooseRandomResponse = function(emotion) {
  var finalChoice = "";
  var emotionResponses = randomResponses[emotion];

  var numOfChoices = emotionResponses.length;
  var randomNum = Math.random();
  randomNum = randomNum*numOfChoices;
  randomNum = Math.floor(randomNum);
  finalChoice = emotionResponses[randomNum];

  return finalChoice;
};
