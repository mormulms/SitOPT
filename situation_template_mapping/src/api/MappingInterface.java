package api;

import mapping.ObjectIdSensorIdMapping;

/**
 * The interface of the mapping
 */
public interface MappingInterface {

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
	public void mapAndDeploy(String situationTemplatePath, boolean doOverwrite, ObjectIdSensorIdMapping sensorMapping, boolean debug);
	
	public void mapAndDeployXMLString(String situationTemplateAsXML, boolean doOverwrite, ObjectIdSensorIdMapping sensorMapping, boolean debug);
	
}
