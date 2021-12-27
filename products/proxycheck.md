# Proxy Check

<div id="proxy_result">
<div><img src="//res.primasm.com/img/loading.gif" alt="" /></div>
</div>

----

このページでは、このページにアクセスした際に<br /> ブラウザー等があなたの情報をどれだけ公開しているかを表示しております。
あなたのIPアドレスが表示されても問題はありませんし<br /> なにかされることはありませんが、IPアドレスを隠して匿名のプロキシサーバーを用いて接続した際に
実際に匿名で通信ができているかも確認することができます。


<script type="text/javascript">// <![CDATA[
$(function()
{
  var url = "//api.primasm.com/env/";

  $.ajax({
    type: "GET",
    url: url,
    dataType:"jsonp",
    jsonpCallback: 'response',
    cache:false, 
    headers: {
        'X-Alt-Referer': document.referrer 
    },
    success: function(data) {
     console.log(data);
      var date = new Date();
      var proxyInfo = $("<ul>");
      for (var i = 0; i < data.ProxyEnv.length; i++) {
        proxyInfo.append($("<li>")
         .append($("<label>").attr("title", data.ProxyEnv[i].Description).html(data.ProxyEnv[i].Title))
         .append($("<label>").html(data.ProxyEnv[i].Value).css("color", data.ProxyEnv[i].FontColor))
        )
      }
      for (var i = 0; i < data.DoubtProxyEnv.length; i++) {
        proxyInfo.append($("<li>")
         .append($("<label>").attr("title", data.DoubtProxyEnv[i].Description).html(data.DoubtProxyEnv[i].Title))
         .append($("<label>").html(data.DoubtProxyEnv[i].Value).css("color", data.DoubtProxyEnv[i].FontColor))
        )
      }
      for (var i = 0; i < data.NonProxyEnv.length; i++) {
        proxyInfo.append($("<li>")
         .append($("<label>").attr("title", data.NonProxyEnv[i].Description).html(data.NonProxyEnv[i].Title))
         .append($("<label>").html(data.NonProxyEnv[i].Value).css("color", data.NonProxyEnv[i].FontColor))
        )
      }

      var infoArea = $();
      infoArea = infoArea.add($("<label>").html("取得時間 : " + date.getFullYear() + "年" + ("00" + (date.getMonth() + 1)).slice(-2) + "月" + ("00" + date.getDate()).slice(-2) + "日" + ("00" + date.getHours()).slice(-2) + "時" + ("00" + date.getMinutes()).slice(-2) + "分" + ("00" + date.getSeconds()).slice(-2) + "秒"))
       .add($("<hr>"))
       .add($("<ul>")
        .append($("<li>")
         .append($("<label>").attr("title", data.Host.Description).html(data.Host.Title))
         .append($("<label>").html(data.Host.Value).css("color", data.Host.FontColor))
        )
        .append($("<li>")
         .append($("<label>").attr("title", data.Address.Description).html(data.Address.Title))
         .append($("<label>").html(data.Address.Value).css("color", data.Address.FontColor))
        )
        .append($("<li>")
         .append($("<label>").attr("title", data.UserAgent.Description).html(data.UserAgent.Title))
         .append($("<label>").html(data.UserAgent.Value).css("color", data.UserAgent.FontColor))
        )
        .append($("<li>")
         .append($("<label>").attr("title", data.AcceptContentsType.Description).html(data.AcceptContentsType.Title))
         .append($("<label>").html(data.AcceptContentsType.Value).css("color", data.AcceptContentsType.FontColor))
        )
        .append($("<li>")
         .append($("<label>").attr("title", data.AcceptLang.Description).html(data.AcceptLang.Title))
         .append($("<label>").html(data.AcceptLang.Value).css("color", data.AcceptLang.FontColor))
        )
        .append($("<li>")
         .append($("<label>").attr("title", data.AcceptEncoding.Description).html(data.AcceptEncoding.Title))
         .append($("<label>").html(data.AcceptEncoding.Value).css("color", data.AcceptEncoding.FontColor))
        )
       .add($("<hr>"))
       .add(proxyInfo)
       .add($("<hr>"))
       .add($("<label>").html(data.AnalyzeHost.Address + "  "))
       .add($("<a>").attr("title", data.AnalyzeHost.ToolTip).attr("href", data.AnalyzeHost.URL).html("Whois"))
       .add($("<br>"))
       .add($("<label>").html("プロキシサーバー匿名度判定：" + data.CheckResult))
       .add($("<br>"))
       .add($("<label>").html("総合評価：" + data.TotalResult))
       .add($("<br>"))
       .add($("<label>").html("国：" + data.Country + " " + data.Local))
       );

      $('#proxy_result').html("").append(infoArea);
    },
    error: function() {
      $('#proxy_result').html("取得ができませんでした。");
    }
  });
});
// ]]></script>
