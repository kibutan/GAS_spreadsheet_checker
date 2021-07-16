//
//GAS scriptをREST APIっぽく使うには、「公開」→「ウェブアプリとして公開」する
//で、この関数は発行されたURLに対するPOSTリクエストに対して呼び出される。
//やっている事自体はPOSTされたJSONのStore,およびDateを読み取って、それが2文字3文字のときにその文字を
//スプレッドシートのD列に記載するといったモノ。
//
function doPost(e) {
  //PostされたJsonをパース、Store, Dateに分解する
  const params = JSON.parse(e.postData.getDataAsString());  // Postされたデータそのもの(e)をJsonパース
  const store = params.store;  // => "store"が取れる
//  const date = params.date

  //Postされた値がFalseのときの初期化
  if(!store) store = "A"
//  if(!date) date = new Date(0,0,0,0,0,0);
  
  //簡単なバリデーションチェック(店舗略称は2~3文字。正規表現に置き換えたいけども。)
  const length = store.length;
  if (!(length >= 2 && length <= 3))store = "";
  
  //SpreadSheetを取得、そのE列の末尾+1行を探す。GASだともっと簡単な書き方あった気もする。
  const sheet=SpreadsheetApp.getActiveSheet();
  const columnBVals = sheet.getRange('E:E').getValues(); // E列の値を配列で取得;
  const LastRow = columnBVals.filter(String).length;  //空白を除き、配列の数を取得
  const NextRow = LastRow + 1;

  //見つけた末尾+1行に
  sheet.getRange(NextRow, 5).setValue(store);
  Logger.log(store + "hoge");

  //レスポンスとしてJsonを返す(いらない気もする)
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "success!" }));
  return output;
}
