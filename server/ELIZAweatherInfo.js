weatherInfo = function(msg) {
  var weatherRegex = /(temperature|weather).*in (\w+)/i;
  var weatherRequest = msg.match(weatherRegex);
  if(weatherRequest === null)
  {
    return "";
  }
  else
  {
    console.log(weatherRequest);
    var lastArrayPos = weatherRequest.length-1;
    var targetCity = weatherRequest[lastArrayPos];
    console.log(targetCity);
  }
};
