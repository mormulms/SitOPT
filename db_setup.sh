#! /bin/bash

COUCH=$1

curl -X PUT http://${COUCH}:5984/Sensor
curl -X PUT http://${COUCH}:5984/Agent
curl -X PUT http://${COUCH}:5984/Thing
curl -X PUT http://${COUCH}:5984/Situationstemplate
curl -X PUT http://${COUCH}:5984/Situation
curl -X PUT http://${COUCH}:5984/Actuator

MONGO=$2

mongo SitDB --host ${MONGO} --eval 'db.createCollection("Sensors")'
mongo SitDB --host ${MONGO} --eval 'db.createCollection("Agents")'
mongo SitDB --host ${MONGO} --eval 'db.createCollection("Things")'
mongo SitDB --host ${MONGO} --eval 'db.createCollection("Situationstemplates")'
mongo SitDB --host ${MONGO} --eval 'db.createCollection("Situations")'
mongo SitDB --host ${MONGO} --eval 'db.createCollection("Actuators")'

mongo RBS --host ${MONGO} --eval 'db.createCollection("caches")'
mongo RBS --host ${MONGO} --eval 'db.createCollection("sensors")'
