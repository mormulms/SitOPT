

# Projects

## Setup

More details on the installation of the modules can be found in the corresponding directories.

### Requirements

 - Tomcat8
 - Node.JS (executable may be called node or nodejs)
 - Java8
 - MongoDB
 - CouchDB
 - Swagger
 
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

``./db_setup.sh $COUCHDB_SERVER $MONGODB_SERVER``

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
