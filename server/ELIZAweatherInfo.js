/*
    ELIZA Chatbot Course Materials Created by CHEN, Tsung-Ying
    for the NTHU course "Basic Web Linguistic Application Development"
    Last Updated on Dec 14, 2017
*/

//建立weatherInfo功能，接收來自於main.js的訊息msg，分析是否為查詢天氣的訊息
weatherInfo = function(msg) {
  //建立時間變數，決定是查詢當下的天氣或是未來的天氣
  var time = "present";
  //建立一個Regular Expression，檢查句子中是否有符合temperature|weather...in (...)
  //這樣的形式。並且在發現符合時回傳字串群組(\w)中的字串當作城市名稱
  var weatherRegex = /(temperature|weather).*in (\w+)/i;
  //建立另一個Regular Expression，用來判斷句子中是否有will或tomorrow的關鍵字
  var timeRegex = /will|tomorrow/ig;
  //用match()功能比對msg訊息內容和weatherRegex這個Regular Expression
  //然後把比對結果儲存到weatherRequest變數中
  var weatherRequest = msg.match(weatherRegex);
  //如果Regular Expression比對結果不符合，weatherRequest的內容會是null
  if(weatherRequest === null)
  {
    //回傳空字串到main.js，代表不是詢問天氣的訊息
    return "";
  }
  //如果比對結果符合，進行查詢天氣的動作
  else
  {
    //首先先決定是查詢目前天氣或是明天天氣
    //比對msg內容與timeRegex，看訊息中是否含有will或tomorrow的字串
    //如果符合...
    if(msg.match(timeRegex) !== null)
    {
      //就把時間變數改為future
      time = "future";
    }
    
    //從weatherRequest這個Regular Expression的比對結果陣列取得城市名稱
    //weatherRegex這個Regular Expression的最後一個字串群組(\w)預設代表城市名稱
    //所以一定是weatherRequest這個比對結果陣列中最後一個位置的資料
    
    //建立lastArrayPos變數依據weatherRequest陣列的長度取得最後一個位置的編號
    var lastArrayPos = weatherRequest.length-1;
    //從weatherRequest陣列的最後一個位置lastArrayPos取得城市名稱，並儲存到
    //targetCity變數裡面
    var targetCity = weatherRequest[lastArrayPos];

    //建立APIKey變數，儲存OpenWeatherMap的APIKey
    //這邊使用的是課堂的公用APIKey，可自行替換為你的帳號的APIKey
    var APIKey = "0f9acd286be670dbec09507843f8f78";
    //建立wtInfoURL準備儲存OpenWeatherMap的連線查詢天氣資料網址
    var wtInfoURL;
    
    //根據查詢天氣的時間點不同組合查詢天氣網址，詳細使用方法可洽OpenWeatherMap網站
    if(time === "present")
    {
      //目前天氣的查詢網址
      //2.5/後加上的關鍵字是weather，才是查詢目前天氣
      //APPID=後面加上上面的APIKey變數作為認證使用
      //q=加上targetCity作為查詢目標城市
      //units=metric代表回傳公制單位的數字
      wtInfoURL = "http://api.openweathermap.org/data/2.5/weather?APPID="+
       APIKey+"&q="+targetCity+"&units=metric";
    }
    else
    {
      //未來天氣的查詢網址
      //2.5/後加上的關鍵字的forecase，才是查詢未來天氣
      //cnt=24代表回傳未來24個小時的每個小時天氣資料
      wtInfoURL = "http://api.openweathermap.org/data/2.5/forecast?APPID="+
       APIKey+"&q="+targetCity+"&units=metric&cnt=24";
    }
    
    //建立儲存天氣資料變數wtData以及回傳查詢結果訊息變數wtDataMsg
    var wtData, wtDataMsg;

    //試著執行try範圍內的程式碼
    try
    {
      //利用HTTP.get連線查詢天氣網址，並且把查詢回傳的資料物件存入wtData
      wtData = HTTP.get(wtInfoURL);
      //回傳資料物件中只有data欄位內才是關鍵的天氣資料，所以取出data欄位的部份
      //取代原本的wtData
      wtData = wtData.data;
      //根據查詢的天氣時間組合不同的回傳訊息
      //目前天氣
      if(time === "present")
      {
        //把目前天氣的描述跟氣溫組合存入wtDataMsg
        wtDataMsg = "It is "+wtData.weather[0].description+
          ", and the current temperature is "+wtData.main.temp+"C.";
      }
      //明天天氣
      else
      {
        //查詢未來天氣會回傳24筆資料，包含在回傳資料物件的list陣列中
        //取出最後一筆資料(陣列中的第23個位置)，代替原本的wtData
        wtData = wtData.list[23];
        //把明天天氣的描述跟氣溫組合存入wtDataMsg
        wtDataMsg = "It is "+wtData.weather[0].description+
          " tomorrow, and the expected temperature is "+wtData.main.temp+"C.";
      }
      //最後回傳天氣查詢訊息到main.js
      return wtDataMsg;
    }
    //當try範圍內的程式碼執行產生錯誤時，執行收到error訊息的catch範圍內的程式碼
    catch(error)
    {
      //假設error主要的來源是利用HTTP.get連線查詢天氣時產生的錯誤。
      //檢查回傳的錯誤訊息error中的response.data.cod欄位是不是"404"字串
      //是的話代表找不到這個城市的天氣資料
      if(error.response.data.cod === "404")
      {
        //回傳找不到城市資料的對應訊息回main.js
        return "Sorry, I don't know this city.";
      }
      //如果不是"404"，可能是其他的網路連線錯誤
      else
      {
        //回傳其他網路錯誤的對應訊息回main.js
        return "Sorry, but there's an internet connection issue.";
      }
    }
  }
};