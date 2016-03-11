

# Projects

## Setup

### Requirements

 - Tomcat8
 - Node.JS
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

If you want to install the complete suite on one computer, simply execute
following commands:

``git clone https://github.com/mormulms/SitOPT.git``

``cd SitOPT``

``sudo ./build.sh``

``sudo cp situation_template_mapping/settings.properties ~tomcat8/situation_mapping.properties``

``sudo cp situation_template_mapping/settings.properties ~root/situation_mapping.properties``

Everything is up and running now.

### ComputeSensor

ComputeSensor for hardware monitoring
This is a project, simply for creating mock data.

### Nexus Schema

XML schema files for context model and situation model. 


### situation_template_mapping

Mapper for situation templates to Node-RED JSON


#### Setup

``cd situation_template_mapping && ant``

``cp situation_template_v01.jar ../SitTempModelingTool/lib``

``cp situation_template_v01.jar ../Situation\ Dashboard/public/mapper/nodeRed/mappingString.jar``

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

## SoapUI

Web-Service test cases for context server query and data insert testing.
