
/// <reference path="../bower_components/jquery/dist/jquery.js" />
/// <reference path="../bower_components/bootstrap/dist/js/bootstrap.js" />

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
    doSensorUpdate();
});
