/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

var randomResponses = [
  "Could you tell me more about it?",
  "I'm afriad this is not a good idea.",
  "Hmm. This very interesting.",
  "Life is a box of chocolate, right?"
];

chooseRandomResponse = function() {
  var finalChoice = "";
  var numOfChoices = randomResponses.length;
  var randomNum = Math.random();
  randomNum = randomNum*numOfChoices;
  randomNum = Math.floor(randomNum);
  finalChoice = randomResponses[randomNum];

  return finalChoice;
};
