exports.action = {
    name:                   'setSituationData',
    description:            'setSituationData',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        thingID: {required: true},
        sitTempID: {required: true},
        thing: {required: true},
        situationtemplate: {required: true},
        occured: {required: true},
        timestamp: {required: false}
    },

    run: function(api, data, next){
        data.params.sensorID = data.params.thingID + "." + data.params.sitTempID;
        data.params.quality = 100; //TODO: find real object structure
        data.params.timeStamp = data.params.timestamp || new Date().toString();
        data.params.value = data.params.occured;
        require('./setSensordata.js').action(api, data, next);
    }
};