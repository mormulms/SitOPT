/**
 * Created by armin on 26.04.16.
 */
var http = require('http');
var querystring = require('querystring');
var should = require('should');
var MongoClient = require('mongodb').MongoClient;



describe('sensors', function () {
    var templateId = "super secret situation id which will nowhere else be used.";
    var thingId = "super secret situation id which will nowhere else be used.";
    var db = null;
    var url = 'mongodb://localhost:27017/SitDB';
    before(function(done) {
        MongoClient.connect(url, function(err, database) {
            db = database;
            done();
        });
    });

    var data = {
        thing: thingId,
        timeStamp: new Date().toDateString(),
        situationtemplate: templateId,
        occured: true,
        sensorvalues: []
    };
    var options = {
        host: "localhost",
        port: 10010,
        path: "/situations",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    it('should create situation', function (done) {
        db.collection('Situations').find( { "thing": thingId, "situationtemplate": templateId } ).toArray(function (err, items) {
            should.not.exist(err);
            if (items.length > 0) {
                done("sensor exists")
            } else {
                var d = querystring.stringify(data);
                options.headers["Content-Length"] = Buffer.byteLength(d);
                var request = http.request(options, function (res) {
                    res.on("error", function(error) {
                        should.not.exist(error);
                    });
                    res.on("end", function (data) {

                    });
                    res.on("data", function (data) {
                        db.collection('Situations').find( { "thing": thingId, "situationtemplate": templateId } ).toArray(function (e, is) {
                            should.not.exist(e);
                            should.equal(1, is.length);
                            done();
                        });
                    })
                });
                done()
            }
        });
    });
});