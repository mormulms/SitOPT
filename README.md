SitOPT
======

- situation_template_mapping: contains an Eclipse project of the mapping implementation from an XML-based situation template into Nod-RED compliant JSON.
	
----------------------------------
How to run/test the implementation
----------------------------------

1) Run Node-RED on port 1880

2) Run the app.js application using NodeJS in folder situation_template_mapping/test/

3) Import project to Eclipse

4) Only once, or if the schema changes: Generate the JAXB classes (see "howto generate java classes"), they will be deployed in the right place, don't commit these classes.

5) Only once, or if the test file location changes: Enter Situation Template Test file: right Click on Project => Run as => Run Configuration => Arguments => Add "test/situation_template_draft01.xml" 

6) Apply => Run

7) Now the mapping is processed and the flow is deployed automatically to Node-RED. You can check the result on the Node-RED GUI.

--------------------------------
How to generate the JAXB classes
--------------------------------

Steps to generate a Java data model from the XSD file (Java JDK has to be installed).

1) only once: Add C:/Program Files/Java/jdk../bin to system path variable

2) in folder "situation_template_mapping" execute "xjc -d src/ -p situationtemplate.model situation_template_draft01.xsd" in the command line to generate the classes to folder src/situationtemplate/model

(Optional: You can call "ant build" to export the JAXB classes to a jar file)
