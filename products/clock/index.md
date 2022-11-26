---
layout: default
title: clock - Rui Software
---

<article id="time" style="font-size: 12vmax;text-align:center;" />

<script type="text/javascript">
var datemode = false;
function refreshClock()
{
    var nowTime = new Date();
    var value = "";
    if (datemode) {
        value = nowTime.toLocaleDateString() + " ";
    }
    value = value + nowTime.toLocaleTimeString();
    $("#time").text(value);

    setInterval('refreshClock()',1000);
}

$(function(){
    $("#time").on("click", function() { datemode = !datemode;} );
    refreshClock();
});
</script>