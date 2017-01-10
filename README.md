

# Projects

## Setup

More details on the installation of the modules can be found in the corresponding directories.

### Requirements

 - Tomcat8
 - Node.JS (executable may be called node or nodejs) (Legacy)
 - Java8
 - MongoDB
 - CouchDB
 - Swagger
 - ant
 
### Installation (tested on Ubuntu 16.04)
 - Tomcat8:
``$ sudo apt-get install tomcat8``
 
 - Node.js
``$ sudo apt-get install nodejs-legacy``
``$ sudo apt-get install npm``
 
 - Java8
``$ sudo add-apt-repository ppa:webupd8team/java``
``$ sudo apt-get update``
``$ sudo apt-get install oracle-java8-installer``

 - MongoDB
``$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927``
``$ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list``
``$ sudo apt-get update``
``$ sudo apt-get install -y mongodb-org``
``$ sudo nano /etc/systemd/system/mongodb.service``
  Paste in the following contents and save:
  
  ``[Unit]
  Description=High-performance, schema-free document-oriented database
  After=network.target

  [Service]
  User=mongodb
  ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

  [Install]
  WantedBy=multi-user.target``
  
``$ sudo systemctl start mongodb (start MongoDB to verify installation, no output expected)``
``$ sudo systemctl status mongodb (check if Mongo is running)``
``$ sudo systemctl enable mongodb (automatically start Mongo when starting system)``
  
  - CouchDB
``$ sudo apt-get update``
``$ sudo apt-get upgrade``
``$ sudo apt-get install software-properties-common``
``$ sudo add-apt-repository ppa:couchdb/stable``
``$ sudo apt-get update``
``$ sudo apt-get install couchdb``

Default config does not allow remote access to CouchDB. Change config files local.ini and default.ini located in /etc/couchdb/
Change "bind_address" in both .ini files from "127.0.0.1" to "0.0.0.0" to enable remote access

  - Swagger
``$ npm install -g swagger``

  - Ant
``$ npm install -g ant``

### Defaults

These are the default ports, where every module runs:

|Module              |Path                     |
|--------------------|-------------------------|
|RMP                 |:1337/                   |
|SitTempModelingTool |:8080/SitTempModelingTool|
|Situation Dashboard |:3001/                   |
|Situationsverwaltung|:10010/                  |

### Complete Installation 

#### Linux

If you want to install the complete suite on one computer, simply execute
following commands:

``git clone https://github.com/mormulms/SitOPT.git``

``cd SitOPT``

``sudo ./build.sh``

``sudo cp situation_template_mapping/settings.properties ~tomcat8/situation_mapping.properties``

``sudo cp situation_template_mapping/settings.properties ~root/situation_mapping.properties``

``./db_setup.sh $COUCHDB_SERVER $MONGODB_SERVER`` (both are localhost if installed locally)

Everything is up and running now.

#### Windows

Windows doesn't have a script for installing SitOPT. If you want to install 
SitOPT on Windows, you have to install each module on its own.

### ComputeSensor

ComputeSensor for hardware monitoring
This is a project, simply for creating mock data.

#### Start

``cd ComputeSensor``

``nodejs app.js``

### Nexus Schema

XML schema files for context model and situation model. 


### situation_template_mapping

Mapper for situation templates to Node-RED JSON


#### Setup (Linux)

``cd situation_template_mapping && ant``

``cp situation_template_v01.jar ../SitTempModelingTool/lib``

``cp situation_template_v01.jar ../Situation\ Dashboard/public/mapper/nodeRed/mappingString.jar``

#### Setup (Windows)

``cd situation_template_mapping``

``ant``

``copy situation_template_v01.jar ..\SitTempModelingTool\lib``

``copy situation_template_v01.jar "..\Situation Dashboard\public\mapper\nodeRed\mappingString.jar"``

### RMP

Resource Management Platform that stores all context values that are needed to recognize situations.

#### Setup

``cd RMP && npm install``

``npm start``

### SitTempModelingTool

Tool for modeling SituationTemplates and exporting them as XML and deploying them to NodeRed.

#### Setup

``cd SitTempModelingTool && ant``

Either deploy via tomcat or execute following commands:

``sudo cp -R WebContent/* /var/lib/tomcat8/webapps/SitTempModelingTool``

``sudo cp SitTempModelingTool.war /var/lib/tomcat8/webapps``

``sudo /etc/init.d/tomcat8 restart``

### Situationsverwaltung

SitDB with API

#### Setup (Linux)

``cd Situationsverwaltung``

``npm install``

``node_modules/.bin/swagger project start``

#### Setup (Windows)

``cd Situationsverwaltung``

``npm install``

``node_modules\.bin\swagger project start``

#### Situation Dashboard

Frontend for SitDB

#### Setup (Linux)

``cd Situation\ Dashboard``

``npm install``

``nodejs server.js``

#### Setup (Windows)

``cd "Situation Dashboard"``

``npm install``

``nodejs server.js``

## SoapUI

Web-Service test cases for context server query and data insert testing.
