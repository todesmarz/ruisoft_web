---
layout: default
title: ドメイン情報表示 - Rui Software
---
<script type="text/javascript">$(function()
{
 var form = $("#domainform");
 form.submit(function(event)
 {
  var url = "//api.primasm.com/domaininfo/index/" +  $('input.inputtext', form).val() + ".json";
  $('#domainInformation').css("display", "block").html('').next().css("display", "block");

  $.ajax({
    type: "GET",
    url: url,
    dataType:"jsonp",
    jsonpCallback: 'response',
    cache:false,
    success: function(data) {
      var items = [];
      $.each(data, function(key, val) {
        items.push('<tr><td>' + key + ':</td><td>' + val + '</td></tr>');
      });

      $('<table />', {
        html: items.join('')
      }).appendTo('#domainInformation');
     $('#domainInformation').append($("<hr>")).next().css("display", "none");
    },
    error: function() {
      $('#domainInformation').html("取得ができませんでした。").next().css("display", "none");
    }
  });
  return false;
 });
});</script>

<form id="domainform" action="#" method="">&#35519;&#12409;&#12383;&#12356;&#12489;&#12513;&#12452;&#12531;&#21517;&#12434;&#20837;&#21147;&#12375;&#12390;&#12367;&#12384;&#12373;&#12356;:
<div class="input-group">
<input class="form-control inputtext" size="64" type="text" placeholder="&#12489;&#12513;&#12452;&#12531;&#21517;"><span class="input-group-btn"><br><button class="btn btn-success" type="submit"><i class="glyphicon glyphicon-search">&nbsp;</i></button><br></span>
</div>
</form>

<hr><div id="domainInformation" style="display: none;"></div>
<div style="text-align: center; display: none;"><img src="//res.primasm.com/img/loading.gif" alt="" /></div>
ドメイン情報を入力することで
サーバーアドレスやWho is(ドメイン登録情報)の表示ができます。

入力例:
「googole.co.jp」
「www.google.co.jp」
