
/// <reference path="../bower_components/jquery/dist/jquery.js" />
/// <reference path="../bower_components/bootstrap/dist/js/bootstrap.js" />
/// <reference path="../bower_components/d3/d3.js" />

function onHistoryUpdate(target, json) {
    $(target).height(($(target).width() / 21) * 9); // resize to wide screen

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
