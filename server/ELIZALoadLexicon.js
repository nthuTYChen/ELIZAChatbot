loadEngLexicon = function(engLexicon) {
  //移除所有舊的字彙資料庫
  engLexicon.remove({});
  //利用Assets.getText讀取private資料夾下的純文字檔
  var lexiconList = Assets.getText("engLexicon_1000.csv");
  //\r\n合起來是Windows裡所使用的換行字元
  //MacOS則是使用\n，所以請依照你的電腦系統的不同來使用不同的換行字元
  //為了去除系統之前換行字元的差異，在此增加一段程式碼解決這個問題。
  //先檢查讀進來的字串是不是用\r\n換行
  if(lexiconList.indexOf("\r\n") > -1)
  {
    //如果是用\r\n換行，把所有的\r\n用replace的功能換成\n
    lexiconList.replace(/\r\n/g, "\n");
  }
  //最後一律在split功能裡使用\n，以行為單位切割為陣列。這樣不論是\r\n還是\n做為換行
  //都不會有差異了。
  lexiconList = lexiconList.split("\n");
  //利用for迴圈，再把每一行在split()功能中以逗號為分隔單位轉換為陣列(成為個別的欄位)
  for(index=0 ; index<lexiconList.length ; index++)
  {
    lexiconList[index] = lexiconList[index].split(",");
  }
  //把lexiconList的第一行儲存為欄位名稱陣列colNames
  var colNames = lexiconList[0];
  //從第二行開始處理lexiconList中每行的英語字彙資訊
  for(row=1 ; row<lexiconList.length ; row++)
  {
    //每處理一行新的資訊的時候，就建立一個新的空物件變數word以便儲存各個欄位資料
    var word = {};
    //處理一行中每一個欄位的資料
    for(col=0 ; col<lexiconList[row].length ; col++)
    {
      //根據欄位col從欄位名稱陣列colNames中取得該欄的名稱，儲存至colName變數裡
      var colName = colNames[col];
      //將word物件變數中的colName特性定義為目前行數的欄位內容
      word[colName] = lexiconList[row][col];
    }
    //每行資訊整理成為word物件變數後，將此變數插入至engLexicon資料庫中。
    engLexicon.insert(word);
  }
};
