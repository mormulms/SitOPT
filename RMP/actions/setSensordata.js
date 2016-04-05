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

	/*error: [server: web] error processing form: Error: bad content-type header, unkn
own content-type: text/plain;charset=UTF-8
info: [ action @ web ] to=129.69.209.37, action=setSensordata, params={"action":
"setSensordata","apiVersion":1}, duration=1, error=Error: undefined is a require
d parameter for this action
Test*/
	
	
    run: function(api, data, next){
        //Logging of when data was sent
		//console.log(data.params.timeStamp);
       /* if (data.params.timeStamp != undefined) {
            var t = new Date(parseInt(data.params.timeStamp));
            console.log("Sent: " + t);
            var d = new Date();
            console.log("Received: " + d);
            var de = new Date(d - t);
            console.log("Delta: " + (parseInt(de.getHours())-1) + ":" + de.getMinutes() + ":" + de.getSeconds() + ":" + de.getMilliseconds())
        }*/
		
		//console.log(data.params);
		//api.sensorCache.findOneAndUpdate(data.params.sensorID, {$set: {value: data.params.value, timeStamp: date, quality: data.params.quality}}, {upsert: true}, 
		//)	function(error, sensor) {console.log(error)});
        
	
		api.sensorCache.findOne({'sensorID':data.params.sensorID}, function(error, sensordata){


			
			if (error){
				console.log(error);
				console.log("Update");
                next(error);
			}else{
				if (sensordata != null){
					console.log("Update")
					console.log(new Date().getTime());
					//var date = new Date().getTime();
					sensordata.value= data.params.value;
					sensordata.timeStamp= new Date().getTime();
					sensordata.quality = data.params.quality;
					sensordata.save(function(e){
						if (e){
							console.log(e);
							console.log("UpdateError");
							next(e);
						}else{
							data.response.payload = sensordata;
							next();
						}
					});
					next();
				}else{
					api.sensor.findOne({'sensorID':data.params.sensorID}, function(err, sensor) {
						if (err) {
							console.log(err);
							console.log("Third");
							next(err);
						} else {
							if (sensor != null) {
								var val = new api.sensorCache({sensorID: data.params.sensorID,
									value: data.params.value,
									timeStamp: new Date().getTime(),
									quality: data.params.quality,
									sensorQuality: 1,
									sensorType: 'generic'
								});
							} else {
								var val = new api.sensorCache({sensorID: data.params.sensorID,
									value: data.params.value,
									timeStamp: new Date().getTime(),
									quality: data.params.quality,
									sensorQuality: sensor.quality,
									sensorType: sensor.sensorType
								});
							}
							val.save(function (er) {
								if (er) {
									console.log(er);
									console.log("Fourth");
									next(er);
								} else {
									data.response.payload = val;
									next();
								}
							})
						}
					});
				}
			}
		});
		
		/*api.sensor.findOne({sensorID: data.params.sensorID}, function(error, sensor) {
            if (error) {
                console.log(error);
				console.log("error");
                next(error);
            } else if (sensor != null) {
                api.sensorCache.findOneAndUpdate({sensorID: data.params.sensorID},
                    {sensorID: data.params.sensorID,
                        value: data.params.value,
                        timeStamp: date,
                        quality: data.params.quality,
                        sensorQuality: sensor.quality,
                        sensorType: sensor.sensorType
                    }, {upsert: true}, function (err, c) {
                        if (err) {
                            console.log(err);
                            next(err);
                        } else {
                            data.response.payload = c;
                            next();
                        }
                    });
            } else {
				if (typeof sensor != 'undefined') {
					var val = new api.sensorCache({sensorID: data.params.sensorID,
						value: data.params.value,
						timeStamp: date,
						quality: data.params.quality,
						sensorQuality: 1,
						sensorType: 'generic'
					});
				} else {
					var val = new api.sensorCache({sensorID: data.params.sensorID,
						value: data.params.value,
						timeStamp: date,
						quality: data.params.quality,
						sensorQuality: sensor.quality,
						sensorType: sensor.sensorType
					});
				}
                val.save(function (err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    } else {
                        data.response.payload = val;
                        next();
                    }
                })
                console.log("Unknown sensor");
                next("Unknown sensor");
            }
        });*/
    }
};