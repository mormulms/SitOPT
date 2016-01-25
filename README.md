

# Projects

## ComputeSensor

ComputeSensor for hardware monitoring

## Nexus Schema

XML schema files for context model and situation model. 


## situation_template_mapping

Mapper for situation templates to Node-RED JSON

### Setup

``cd situation_template_mapping && ant``

``cp situation_template_v01.jar ../SitTempModelingTool/lib``

``cp situation_template_v01.jar ../Situation\ Dashboard/public/mapper/nodeRed/mappingString.jar``

## RMP

Resource Management Platform that stores all context values that are needed to recognize situations.

### Setup

``cd RMP && npm install``

``npm start``

## SitTempModelingTool

Tool for modeling SituationTemplates and exporting them as XML and deploying them to NodeRed.

### Setup

``cd SitTempModelingTool && ant``

Afterwards deployment via tomcat/glassfish

## SoapUI

Web-Service test cases for context server query and data insert testing.
