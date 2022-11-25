---
layout: default
title: clock - Rui Software
---

<article id="time" style="font-size: 6vmax;" />

<script type="text/javascript">
function refreshClock()
{
    var nowTime = new Date();
    $("#time").text(nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds());

    setInterval('refreshClock()',1000);
}

$(function(){
    refreshClock();
});
</script>