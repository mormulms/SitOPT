package api;

import java.io.File;
import java.io.StringReader;
import java.util.Date;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;

import mapping.Mapper;
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
	public void mapAndDeployXMLString(String situationTemplateAsXML, boolean doOverwrite, String url, boolean debug) {
		
		try {
			// input is defined, parse the XML model
			JAXBContext jc;
			jc = JAXBContext.newInstance(TSituationTemplate.class);
	
			Unmarshaller u;
			u = jc.createUnmarshaller();
	
			TSituationTemplate situationTemplate = (TSituationTemplate) u.unmarshal(new StringReader(situationTemplateAsXML));
		
			Mapper mapper = new Mapper(situationTemplate);
			Date date = new Date();
			mapper.map(doOverwrite, url, date.getTime(), debug);
		} catch (JAXBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
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
	public void mapAndDeploy(String situationTemplatePath, boolean doOverwrite, String url, boolean debug) {
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
			mapper.map(doOverwrite, url, date.getTime(), debug);

		} catch (JAXBException e) {
			System.err.println("Could not parse the XML file, an error occurred.");
			e.printStackTrace();
		}
	}
}
