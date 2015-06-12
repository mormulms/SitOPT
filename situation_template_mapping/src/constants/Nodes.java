package constants;

import java.util.List;

/**
 * This class offers methods to generate the Node-RED function nodes as JSON
 */
public class Nodes {

	/**
	 * Generates the JavaScript implementation of the "greater than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getGreaterThanNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorquality, String quality) {
		return "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'"+ sensorId +"', 'sensorquality':'" +sensorquality+ "', 'value':curr, 'timestamp':1, 'quality':1}; \n if (curr > "	+ comparisonValue + ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "lower than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getLowerThanNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorquality, String quality) {
		return "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'"+ sensorId +"', 'sensorquality':'" +sensorquality+ "', 'value':curr, 'timestamp':1, 'quality':1}; \n if (curr < "	+ comparisonValue	+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "equals" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getEqualsNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorquality, String quality) {
		return "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'"+ sensorId +"', 'sensorquality':'" +sensorquality+ "', 'value':curr, 'timestamp':1, 'quality':1}; \n if (curr == " + comparisonValue + ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "status code" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static String getNotEquals(String conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorquality, String quality) {
		return "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'"+ sensorId +"', 'sensorquality':'" +sensorquality+ "', 'value':curr, 'timestamp':1, 'quality':1}; \n if (msg.statusCode != " + conditionValues + ") {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;";
	}
	
	/**
	 * Generates the JavaScript implementation of the "between" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static Object getBetween(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorquality, String quality) {
		
		String condValue1 = conditionValues.get(0);
		String condValue2 = conditionValues.get(1);
		
		return "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'"+ sensorId +"', 'sensorquality':'" +sensorquality+ "', 'value':curr, 'timestamp':1, 'quality':1}; \n if (" + condValue1 + " < msg.statusCode < " + condValue2 + ") {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;";
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNode(String numberOfInputs, String objectID, String situationTemplateID) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\ncontext.sensorValues = context.sensorValues || new Array();\ncontext.sensorValues.push(msg.situation);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n	msg.situation = [];  msg.situation.push({'thing':'"+ objectID +"', 'timestamp':'1', 'situationtemplate':'"+ situationTemplateID + "'});\n	var returnValue = true;\n  	for (var i = 0; i < inputs; i++){\n		msg.situation.push(context.sensorValues[i]);\n		if (!(context.values[i])) {\n	  		returnValue = false;\n		}\n  	}\n\n	msg.payload = returnValue;\n  	context.values = null;\n	context.sensorValues = null;\n\n	var jsonStr = '{\"situation\": []}';\n	var obj = JSON.parse(jsonStr);\n\n	for (var i = 0; i < msg.situation.length; i++) {\n		obj.situation.push(msg.situation[i]);\n	}\n\n	msg.situation = obj;\n\n  	return msg;\n} else {\n	return null;\n}";
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNode(String numberOfInputs, String objectID, String situationTemplateID) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\ncontext.sensorValues = context.sensorValues || new Array();\ncontext.sensorValues.push(msg.situation);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n	msg.situation = [];  msg.situation.push({'thing':'"+ objectID +"', 'timestamp':'1', 'situationtemplate':'"+ situationTemplateID + "'});\n	var returnValue = false;\n  	for (var i = 0; i < inputs; i++){\n		msg.situation.push(context.sensorValues[i]);\n		if (context.values[i]) {\n	  		returnValue = true;\n		}\n  	}\n\n	msg.payload = returnValue;\n  	context.values = null;\n	context.sensorValues = null;\n\n	var jsonStr = '{\"situation\": []}';\n	var obj = JSON.parse(jsonStr);\n\n	for (var i = 0; i < msg.situation.length; i++) {\n		obj.situation.push(msg.situation[i]);\n	}\n\n	msg.situation = obj;\n\n  	return msg;\n} else {\n	return null;\n}";
	}
}