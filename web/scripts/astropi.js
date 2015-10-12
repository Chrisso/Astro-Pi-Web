
/// <reference path="../bower_components/jquery/dist/jquery.js" />
/// <reference path="../bower_components/bootstrap/dist/js/bootstrap.js" />
/// <reference path="../bower_components/d3/d3.js" />

function onHistoryUpdate(target, json) {
    $(target).width($("#history_host").width());
    $(target).height(($("#history_host").width() / 21) * 9); // resize to wide screen

    var margin = { top: 20, right: 20, bottom: 20, left: 60 };
    var width = $(target).width() - margin.left - margin.right;
    var height = $(target).height() - margin.top - margin.bottom;

    var scales = {};
    scales.x = d3.time.scale().range([0, width]);
    scales.y = d3.scale.linear().range([height, 0]);

    var axis = {};
    axis.x = d3.svg.axis().scale(scales.x).orient("bottom");
    axis.y = d3.svg.axis().scale(scales.y).orient("left");

    var svg = d3.select(target).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = [];
    for (var i = 0; i < json.length; i++) {
        data.push({
            date: new Date(json[i][0]),
            value: json[i][1]
        });
    }

    scales.x.domain(d3.extent(data, function (d) { return d.date; }));
    scales.y.domain(d3.extent(data, function (d) { return d.value; }));

    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(axis.x);
    svg.append("g").attr("class", "y axis").call(axis.y);

    var line = d3.svg.line()
        .x(function (d) { return scales.x(d.date); })
        .y(function (d) { return scales.y(d.value); });

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}

function onSensorUpdate(data) {
    $("#sensor_temperature").html(data.temperature.toFixed(1) + "&deg;C");
    $("#sensor_humidity").html(data.humidity.toFixed(1) + "%");
    $("#sensor_pressure").html(data.pressure.toFixed(1) + "mbar");
    $("#sensor_timestamp").text(data.timestamp);
}

function doSensorUpdate() {
    $.getJSON("services/json/sensors.php", { q: "recent", ts: new Date().getTime() }, onSensorUpdate)
        .always(function () {
            window.setTimeout(doSensorUpdate, 10000);
        });
}

$(document).ready(function () {
    $("a[data-link=sensors").click(function (evt) {
        evt.preventDefault();
        $("a[data-link=ledmatrix").parent().removeClass("active");
        $("a[data-link=sensors]").parent().addClass("active");
        $("div[data-group=sensors").show();
        $("div[data-group=ledmatrix").hide();
    });
    $("a[data-link=ledmatrix").click(function (evt) {
        evt.preventDefault();
        $("a[data-link=sensors").parent().removeClass("active");
        $("a[data-link=ledmatrix]").parent().addClass("active");
        $("div[data-group=ledmatrix").show();
        $("div[data-group=sensors").hide();
    });
    $("a[data-color]").click(function (evt) {
        evt.preventDefault();
        var color = d3.rgb($(this).data("color"));
        $("#led_message")
            .data("color", color)
            .css("color", color.darker().toString());

    });
    $("#led_setmessage").click(function () {
        var params = { q: "message", v: $("#led_message").val(), ts: new Date().getTime() };
        if (params.v.trim().length == 0)
            return; // nothing to display
        if ($("#led_message").data("color")) {
            var c = $("#led_message").data("color");
            params.r = c.r;
            params.g = c.g;
            params.b = c.b;
        }
        $.getJSON("services/json/ledmatrix.php", params, function () {
            $("#led_message").val("");
        });
    });
    $.getJSON(
        "services/json/sensors.php",
        { q: "temperature", ts: new Date().getTime() },
        function (data) { onHistoryUpdate("#history_temperature", data); });
    $.getJSON(
        "services/json/sensors.php",
        { q: "humidity", ts: new Date().getTime() },
        function (data) { onHistoryUpdate("#history_humidity", data); });
    $.getJSON(
        "services/json/sensors.php",
        { q: "pressure", ts: new Date().getTime() },
        function (data) { onHistoryUpdate("#history_pressure", data); });
    doSensorUpdate();
});
