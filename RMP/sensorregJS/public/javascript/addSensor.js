/**
 * Created by armin on 27.09.15.
 */
function save() {
    $(".alert").remove();
    var url = location.protocol + "//" + location.host + "/api/sensor";
    var objectID = $('#objectID').val();
    var sensorID = $('#sensorID').val();
    var sensorUrl = $('#sensorUrl').val();
    var sensorType = $('#sensorType').val();
    if (!(sensorUrl == null || sensorUrl == "" || sensorID == null || sensorID == "" || sensorType == null || sensorType == "" || objectID == null || objectID == "")) {
        var match = sensorUrl.match(/^https?:\/\/(localhost|[a-zA-Z0-9.-]+\.[a-zA-Z]+)(:[0-9]+)?(\/$|\/[^\/]+)*$/);
        if (match != null && match[0].length == sensorUrl) {
            $.post(url, {
                objectID: objectID,
                sensorID: sensorID,
                sensorUrl: sensorUrl,
                sensorType: sensorType
            }, function (res, code) {
                console.log(res);
                if (code == "success") {
                } else {
                    console.log(JSON.stringify(res));
                }
            });
        } else {
            var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Enter a valid URL for the Sensor URL.</div>";
            $('#addSensorContent').prepend(error);
        }
    } else {
        var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Not all fields are filled.</div>";
        $('#addSensorContent').prepend(error);
    }
}