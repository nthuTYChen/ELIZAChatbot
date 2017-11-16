/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Nov 16, 2017
*/

//建立常用的打招呼字串陣列
var commonGreetings = [
  "Hello", "What's up", "How are you"
];

//建立常用的說再見字串陣列
var commonFarewells = [
  "Bye", "See you", "See ya", "Goodbye"
];

//建立socialResponse功能，根據接收到的訊息msg判斷是不是應該要做出打招呼或說再見
//的回應
socialResponse = function(msg) {
  //建立儲存回應類別的變數
  var responseType = "";

  //把接收到的訊息msg利用toUpperCase()轉換為全大寫，消除大小寫在比對上造成的差異
  var upperCaseMsg = msg.toUpperCase();

  //利用for迴圈檢查upperCaseMsg裡是否有包含任一個commonGreetings陣列裡的打招呼方式
  for(index=0 ; index<commonGreetings.length ; index++)
  {
    //每一個commonGreetings陣列裡的打招呼方式在比較之前也利用toUpperCase()
    //功能轉換成大寫存入greeting
    var greeting = commonGreetings[index].toUpperCase();
    //使用indexOf確認upperCaseMsg裡是否有包含greeting的字串
    if(upperCaseMsg.indexOf(greeting) > -1)
    {
      //如果有包含，將responseType設定為greetings
      responseType = "greetings";
      //判斷完畢就沒有需要再執行剩下的迴圈，所以使用break指令停止迴圈
      break;
    }
  }

  //使用相同的方式檢查upperCaseMsg裡有沒有任何一個commonFarewells陣列裡的的
  //說再見方式
  for(index=0 ; index<commonFarewells.length ; index++)
  {
    var farewell = commonFarewells[index].toUpperCase();
    if(upperCaseMsg.indexOf(farewell) > -1)
    {
      responseType = "farewells";
      break;
    }
  }

  //根據回應的類別設定回應的訊息，如果類別是打招呼的話
  if(responseType === "greetings")
  {
    //回傳打招呼的訊息
    return "Hi, nice to meet you.";
  }
  //如果類別是說再見的話
  else if(responseType === "farewells")
  {
    //回傳說再見的訊息
    return "See you soon again!";
  }
  //如果以上兩者皆非
  else
  {
    //回傳空白字串代表接收到的訊息既不是打招呼，也不是說再見
    return "";
  }
};
