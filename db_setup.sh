#! /bin/bash

COUCH=$1

curl -X PUT http://$(COUCH):5984/Sensor
curl -X PUT http://$(COUCH):5984/Agent
curl -X PUT http://$(COUCH):5984/Thing
curl -X PUT http://$(COUCH):5984/Situationstemplate
curl -X PUT http://$(COUCH):5984/Situation
curl -X PUT http://$(COUCH):5984/Actuator

MONGO=$2

mongo SitDB --host $(MONGO) --eval 'db.createCollection("Sensor")'
mongo SitDB --host $(MONGO) --eval 'db.createCollection("Agent")'
mongo SitDB --host $(MONGO) --eval 'db.createCollection("Thing")'
mongo SitDB --host $(MONGO) --eval 'db.createCollection("Situationstemplate")'
mongo SitDB --host $(MONGO) --eval 'db.createCollection("Situation")'
mongo SitDB --host $(MONGO) --eval 'db.createCollection("Actuator")'

mongo RBS --host $(MONGO) --eval 'db.createCollection("caches")'
mongo RBS --host $(MONGO) --eval 'db.createCollection("sensors")'
