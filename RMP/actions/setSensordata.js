/**
 * sets the data of a single sensor.
 */
exports.action = {
    name:                   'setSensordata',
    description:            'setSensordata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorID: {required: true},
        value: {required: true},
        timeStamp: {required: false},
        quality: {required: true}
    },

    run: function(api, data, next){
        //Logging of when data was sent
        if (data.params.timeStamp != undefined) {
            var t = new Date(parseInt(data.params.timeStamp));
            console.log("Sent: " + t);
            var d = new Date();
            console.log("Received: " + d);
            var de = new Date(d - t);
            console.log("Delta: " + (parseInt(de.getHours())-1) + ":" + de.getMinutes() + ":" + de.getSeconds() + ":" + de.getMilliseconds())
        }
        var date = data.params.timeStamp || new Date();
        api.sensor.findOne({sensorID: data.params.sensorID}, function(error, sensor) {
            if (error) {
                console.log(error);
                next(error);
            } else {
                var val = new api.sensorCache({sensorID: data.params.sensorID,
                    value: data.params.value,
                    timeStamp: date,
                    quality: data.params.quality,
                    sensorQuality: sensor.quality,
                    sensorType: sensor.sensorType
                });
                val.save(function (err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    } else {
                        data.response.payload = val;
                        next();
                    }
                })
            }
        });
    }
};