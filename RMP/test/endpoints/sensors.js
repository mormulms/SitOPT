/**
 * Created by armin on 26.04.16.
 */
var http = require('http');
var querystring = require('querystring');
var should = require('should');
var setup = require('./../_setup.js')._setup;



describe('sensors', function () {
    var sensorId = "super secret sensor id which will nowhere else be used.";
    var data = {
        sensorID: sensorId,
        objectID: "123",
        sensorUrl: "123",
        sensorType: "1",
        timeStamp: new Date().toDateString(),
        quality: "100",
        unit: "test",
        unitSymbol: "t"
    };
    var options = {
        host: "localhost",
        port: 1337,
        path: "/sensor",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    before(function (done) {
        setup.init(done);
    });

    it('should create sensor', function (done) {
        setup.api.sensor.find({"sensorID": sensorId}, function (error, result) {
            should.not.exist(error);
            if (result.length >= 1) {
                for (var i = 0; i < result.length; i++) {
                    result[i].remove();
                }
            }
            options.method = "POST";
            var d = querystring.stringify(data);
            options.headers["Content-Length"] = Buffer.byteLength(d);
            var request = http.request(options, function (res) {
                res.on('error', function (error) {
                    should.fail();
                });
                res.on('end', function (data) {
                    setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                        should.equal(1, docs.length);
                        setup.api.sensor.findOneAndRemove({"sensorID": sensorId}, function (e, r) {
                            done();
                        });
                    });
                });
                res.on('data', function (data) {
                });
            });
            request.write(d);
            request.end();
        });
    });

    it('should update sensor', function (done) {
        this.timeout(10000);
        setup.api.sensor.find({"sensorID": sensorId}, function (error, result) {
            should.not.exist(error);
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    result[i].remove();
                }
            }
            options.method = "POST";
            var d = querystring.stringify(data);
            options.headers["Content-Length"] = Buffer.byteLength(d);
            var request = http.request(options, function (res) {
                res.on('error', function (error) {
                    should.fail();
                });
                res.on('end', function (chunk) {
                    setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                        should.equal(1, docs.length);
                        data.sensorUrl += "asdf";
                        options.method = "PUT";
                        options.path = "/sensor/" + data.objectID + "/" + data.sensorID.replace(/ /g, '%20');
                        d = querystring.stringify(data);
                        options.headers["Content-Length"] = Buffer.byteLength(d);
                        var req = http.request(options, function (res) {
                            res.on('error', function (error) {
                                should.fail();
                            });
                            res.on('end', function (c) {
                                setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                                    should.equal(1, docs.length);
                                    should.equal("123asdf", docs[0].sensorUrl);
                                    setup.api.sensor.findOneAndRemove({"sensorID": sensorId}, function (e, r) {
                                        done();
                                    });
                                });
                            });
                            res.on('data', function (data) {
                            });
                        });
                        req.write(d);
                        req.end();
                    });
                });
                res.on('data', function (data) {
                });
            });
            request.write(d);
            request.end();
        })
    });

    it('should delete sensor', function (done) {
        setup.api.sensor.find({"sensorID": sensorId}, function (error, documents) {
            should.not.exist(error);
            if (documents.length > 0) {
                for (var i = 0; i < documents.length; i++) {
                    documents[i].remove();
                }
            }
            options.method = "POST";
            options.path = "/sensor";
            var d = querystring.stringify(data);
            options.headers["Content-Length"] = Buffer.byteLength(d);
            var request = http.request(options, function (result) {
                result.on('error', function (err) {
                    should.fail();
                });
                result.on('end', function (end) {
                    setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                        should.not.exist(err);
                        should.equal(1, docs.length);
                        options.method = "DELETE";
                        options.path = "/sensor/" + data.objectID + "/" + data.sensorID.replace(/ /g, '%20');
                        d = querystring.stringify(data);
                        options.headers["Content-Length"] = Buffer.byteLength(d);
                        var req = http.request(options, function (res) {
                            res.on('error', function (error) {
                                should.fail();
                            });
                            res.on('end', function (c) {
                                setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                                    should.equal(0, docs.length);
                                    done()
                                });
                            });
                            res.on('data', function (data) {
                            });
                        });
                        req.write(d);
                        req.end();
                    });
                });
                result.on('data', function (data) {
                });
            });
            request.write(d);
            request.end();
        })
    });

    it('sensor should only be created once', function (done) {
        setup.api.sensor.find({"sensorID": sensorId}, function (error, result) {
            should.not.exist(error);
            if (result.length >= 1) {
                for (var i = 0; i < result.length; i++) {
                    result[i].remove();
                }
            }
            options.method = "POST";
            options.path = '/sensor';
            var d = querystring.stringify(data);
            options.headers["Content-Length"] = Buffer.byteLength(d);
            var request = http.request(options, function (res) {
                res.on('error', function (error) {
                    should.fail();
                });
                res.on('end', function (data) {
                    var r = http.request(options, function (resp) {
                        resp.on('error', function (error) {
                            should.fail();
                        });
                        resp.on('end', function (data) {
                            setup.api.sensor.find({"sensorID": sensorId}, function (err, docs) {
                                setup.api.sensor.find({"sensorID": sensorId}).remove().exec();
                                should.equal(1, docs.length);
                                done();
                            });
                        });
                        resp.on('data', function (data) {
                        });
                    });
                    r.write(d);
                    r.end();
                });
                res.on('data', function (data) {
                });
            });
            request.write(d);
            request.end();
        });
    });
});