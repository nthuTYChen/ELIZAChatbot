weatherInfo = function(msg) {
  var time = "present";
  var weatherRegex = /(temperature|weather).*in (\w+)/i;
  var timeRegex = /will|tomorrow/ig;
  var weatherRequest = msg.match(weatherRegex);
  if(weatherRequest === null)
  {
    return "";
  }
  else
  {
    if(msg.match(timeRegex) !== null)
    {
      time = "future";
    }
    var lastArrayPos = weatherRequest.length-1;
    var targetCity = weatherRequest[lastArrayPos];

    var APIKey = "0f9acd286be670dbec09507843f8f78b";
    var wtInfoURL;
    if(time === "present")
    {
      wtInfoURL = "http://api.openweathermap.org/data/2.5/weather?APPID="+
       APIKey+"&q="+targetCity+"&units=metric";
    }
    else
    {
      wtInfoURL = "http://api.openweathermap.org/data/2.5/forecast?APPID="+
       APIKey+"&q="+targetCity+"&units=metric&cnt=24";
    }
    var wtData, wtDataMsg;

    try
    {
      wtData = HTTP.get(wtInfoURL);
      wtData = wtData.data;
      if(time === "present")
      {
        wtDataMsg = "It is "+wtData.weather[0].description+
          ", and the current temperature is "+wtData.main.temp+"C.";
      }
      else
      {
        wtData = wtData.list[23];
        wtDataMsg = "It is "+wtData.weather[0].description+
          " tomorrow, and the expected temperature is "+wtData.main.temp+"C.";
      }
      return wtDataMsg;
    }
    catch(error)
    {
      if(error.response.data.cod === "404")
      {
        return "Sorry, I don't know this city.";
      }
      else
      {
        return "Sorry, but there's an internet connection issue.";
      }
    }
  }
};

/*var processWtData = function(error, result) {
  var wtData;
  if(error !== null)
  {
    wtData = error.response.data;
    if(wtData.cod === "404")
    {
      console.log("Sorry, I don't know this city.");
      return "Sorry, I don't know this city.";
    }
    else
    {
      console.log("Sorry, but there's an internet connection issue.");
      return "Sorry, but there's an internet connection issue.";
    }
  }
  else
  {
    wtData = result.data;
    console.log("It's "+wtData.weather[0].description+
      ", and the current temperature is "+wtData.main.temp+"C.");
  }
};*/
