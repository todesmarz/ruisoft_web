---
layout: default
title: clock - Rui Software
---

<article id="time" style="font-size: 10vmax;text-align:center;" />

<script type="text/javascript">
var datemode = false;
function refreshClock()
{
    var nowTime = new Date();
    var value = "";
    if (datemode) {
        value = nowTime.toLocaleDateString() + "<br>";
    }
    value = value + nowTime.toLocaleTimeString();
    $("#time").html(value);

    setTimeout(refreshClock,300);
}

$(function(){
    $("#time").on("click", function() { datemode = !datemode;} );
    refreshClock();
});
</script>