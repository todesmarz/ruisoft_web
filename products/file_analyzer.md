---
layout: default
title: natsuic - Rui Software
---
<script type="text/javascript">function _arrayBufferToBase64( buffer, size ) {
    var binary = '';
    var bytes = new Uint8Array( buffer, 0, size);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}
function fileAnalyze(){
  var table = $('#resultTable');
  if ($('thead tr', table).length) {
    $('thead tr', table).remove();
  }
  if ($('tbody tr', table).length) {
    $('tbody tr', table).remove();
  }
  $("#resultTableTitle").text("");

  var files = document.getElementById('file_name_text').files;
  if (!files.length) {
    return;
  }
  var file = files[0];
  if (!window.FileReader) {
    alert("ご利用のブラウザはサポートしていません");
    return;
  }
  var fr = new FileReader();
  if (!fr.readAsArrayBuffer) {
    alert("ご利用のブラウザはサポートしていません");
    return;
  }

  // ファイル読み込み時のイベントを設定
  fr.onload = function(event){
      // ファイルのデータが入ったArrayBufferオブジェクトを取得
      var data = event.target.result;
      var sendData = _arrayBufferToBase64(data, 1024);

      $.ajax({
        type:"get",
        url:"//api.primasm.com/fileanalyzer/index/" + sendData + "/",
        cache:true,
        dataType: "jsonp",
        jsonpCallback: 'response',
        success: function(json_data) {   // 200 OK時
          $("#resultTableTitle").text("解析結果 : " + file.name);
          $('thead', table).append('<tr><td>一致</td><td>拡張子</td><td>ファイルの説明</td></tr>');
          var jsonResultData = json_data.result;
          for(var resultkey in jsonResultData){
            $.ajax({
              type:"get",
              url:"//fuel.primasm.com/fileanalyzer/result/" + jsonResultData[resultkey].Id ,
              cache:true,
              dataType:"jsonp",
              jsonpCallback: 'response',
              success:function(dataDetailData){
                var jsonDetailData = dataDetailData;
                $('tbody', table).append('<tr><td >' + (jsonResultData[resultkey].Hit / jsonResultData[resultkey].Total * 100) + "%</td><td>" +  jsonDetailData.Ext + '</td><td>' + jsonDetailData.Descript + '</td></tr>');
              }
            });}
         },
        error: function() {         // HTTPエラー時
          alert("Server Error. Pleasy try again later.");
        },
      });
    };

  // ファイルデータへのアクセス開始。ArrayBufferオブジェクトとしてデータを取得する。
  fr.readAsArrayBuffer(file);

  return false;
}
$(function () {
  jQuery.event.props.push('dataTransfer');
  $("#analyzeForm").submit(function() {fileAnalyze();return false;});
});</script><style type="text/css">#resultTable {
   border-collapse: collapse;
   border: 1px solid black; /* 外枠 */
}
#resultTable th, #resultTable td {
   border-style: solid dotted; /* 線種 */
   border-width: 1px; /* 線の太さ */
   border-color: black; /* 線色 */
}</style>

## ファイル解析
選択したファイルを解析し、どのようなファイルか判断します。
拡張子がないファイルや、復元後のファイルなどがなんのファイルか分からなくなった場合に使用してください。

ファイルサイズは上限30Mbyte
ファイルは、サーバーへアップロードされますが、解析後は保持することなく削除を行います。

<font color="red">現在、30ファイル形式に対応</font>

---

<form id="analyzeForm" name="analyzeForm" action="#">
<input type="file" id="file_name_text" name="file_name" size="30"><p><input type="submit" class="btn btn-success" value="&#35299;&#26512;"></p></form>
<p id="resultTableTitle"></p>
<table id="resultTable"><thead style="background-color:#2e8b57;color:white;"></thead><tbody></tbody></table>
