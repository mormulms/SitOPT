situation_template_mapping
==========================

This module maps a situation template in XML format to a node-red flow.
	
How to run/test the implementation
----------------------------------

1. Start Node-red either locally or on a remote server.
    - if you start locally and use default configuration (port 1880) then you don't need to do anything
    - if you use a remote machine or a different configuration, please edit the settings.properties
2. Start the RMP either locally or on a remote server
    - if you start locally and use default configuration (port 1337) then you don't need to do anything
    - if you use a remote machine or a different configuration, please edit the settings.properties
3. Start the situationsverwaltung either locally or on a remote server
    - if you start locally and use default configuration (port 10010) then you don't need to do anything
    - if you use a remote machine or a different configuration, please edit the settings.properties
4. Map the IDs of ContextNodes in your template to the IDs of the corresponding sensors in the SitDB. (example in examples directory)
5. Map the template. The call looks like this: `java -jar situation_template_v01.jar $MAPPING $TEMPLATE`

NOTE: the properties file has to be located either in the working directory, or in the home directory of the current user.
In case of latter variant, it has to be named "situation_mapping.properties"

Examples
--------

Examples are located in the examples directory. There is an example of a template and an example of a mapping.

|File|Description|
|----|-----------|
|mapping.json|This file contains the mapping of context nodes to sensors. The values are the name of the sensor in the RMP and the id in the SitDB.|
|TemperatureSitTemplate.xml|This file describes a situation that is true, when at least one of the sensors reports a value greater than 29°C.|

How to generate the JAXB classes
--------------------------------

Steps to generate a Java data model from the XSD file (Java JDK has to be installed).

1) only once: Add C:/Program Files/Java/jdk../bin to system path variable

2) in folder "situation_template_mapping" execute `xjc -d src/ -p situationtemplate.model situation_template_draft01.xsd` in the command line to generate the classes to folder src/situationtemplate/model

(Optional: You can call "ant build" to export the JAXB classes to a jar file)
