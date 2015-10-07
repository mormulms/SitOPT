package api;

import java.io.File;
import java.io.StringReader;
import java.util.Date;

import javax.xml.bind.JAXB;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;

import mapping.Mapper;
import mapping.ObjectIdSensorIdMapping;
import situationtemplate.model.TSituationTemplate;

/**
 * Class implementing the interface of the mapping
 */
public class Mapping implements MappingInterface {

	/**
	 * Invokes the mapping of the situation template and the deployment to Node-RED
	 * 
	 * @param situationTemplateAsXML
	 * 				 the situation template as XML string
	 * @param doOverwrite
	 * 				 determines whether the currently deployed flows shall be overwritten
	 * @param url
	 * 				 the URL of the machine 
	 */
	@Override
	public void mapAndDeployXMLString(String situationTemplateAsXML, boolean doOverwrite, ObjectIdSensorIdMapping sensorMapping, boolean debug) {
		
		// input is defined, parse the XML model
		TSituationTemplate situationTemplate = JAXB.unmarshal(new StringReader(situationTemplateAsXML), TSituationTemplate.class);

		Mapper mapper = new Mapper(situationTemplate);
		Date date = new Date();
		mapper.map(doOverwrite, sensorMapping, date.getTime(), debug);	
	}
	
	/**
	 * Invokes the mapping of the situation template and the deployment to Node-RED
	 * 
	 * @param situationTemplatePath
	 * 				 the path to the situation template XML as string
	 * @param doOverwrite
	 * 				 determines whether the currently deployed flows shall be overwritten
	 * @param url
	 * 				 the URL of the machine 
	 */
	@Override
	public void mapAndDeploy(String situationTemplatePath, boolean doOverwrite, ObjectIdSensorIdMapping sensorMapping, boolean debug) {
		try {
			// input is defined, parse the XML model
			JAXBContext jc;
			jc = JAXBContext.newInstance(TSituationTemplate.class);

			Unmarshaller u = jc.createUnmarshaller();
			File file = new File(situationTemplatePath);
			JAXBElement<TSituationTemplate> root = u.unmarshal(new StreamSource(file), TSituationTemplate.class);

			TSituationTemplate situationTemplate = root.getValue();

			Mapper mapper = new Mapper(situationTemplate);
			Date date = new Date();
			mapper.map(doOverwrite, sensorMapping, date.getTime(), debug);

		} catch (JAXBException e) {
			System.err.println("Could not parse the XML file, an error occurred.");
			e.printStackTrace();
		}
	}
}
