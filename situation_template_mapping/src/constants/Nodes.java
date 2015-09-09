package constants;

import java.util.List;

/**
 * This class offers methods to generate the Node-RED function nodes as JSON
 */
public class Nodes {
	private final static String compareString = "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'%s', 'sensorquality':'%s', 'value':curr, "
			+ "'timestamp':1, 'quality':1}; \n if (curr %s %s) {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	private final static String statusCodeString = "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'%s', 'sensorquality':'%s', 'value':curr, "
			+ "'timestamp':1, 'quality':1}; \n if (msg.statusCode %s %s) {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}"
			+ "\n\nreturn null;";
	private final static String accumulationString = "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\n"
			+ "context.sensorValues = context.sensorValues || new Array();\ncontext.sensorValues.push(msg.situation);\n\nvar inputs = %s;\n"
			+ "if (context.values.length == inputs) {\n	msg.situation = [];\n var returnValue = true;\n    var counter = 0;    for (var i = 0; i < inputs; i++)"
			+ "{\n		msg.situation.push(context.sensorValues[i]);\n		%s\n  	}\n\n		if (returnValue) {\n		msg.situation.push("
			+ "{'thing':'%s', 'timestamp':'1', 'situationtemplate':'%s' , 'occured':true});\n	} else {\n		msg.situation.push({'thing':'%s', "
			+ "'timestamp':'1', 'situationtemplate':'%s' , 'occured':false});\n	}	\n  	context.values = null;\n	context.sensorValues = null;\n\n	"
			+ "var jsonStr = '{\"situation\": []}';\n	var obj = JSON.parse(jsonStr);\n\n	for (var i = 0; i < msg.situation.length; i++) {\n		"
			+ "obj.situation.push(msg.situation[i]);\n	}\n\n	msg.payload = obj;\n\n  	return msg;\n} else {\n	return null;\n}";
	private final static String betweenString = "var curr = parseInt(msg.payload);\n msg.situation = {'sensor':'%s', 'sensorquality':'%s', "
			+ "'value':curr, 'timestamp':1, 'quality':1}; \n if (%s < msg.statusCode && msg.statusCode < %s) {\n  msg.payload = true;\n return msg;  \n} "
			+ "else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;";
	
	/**
	 * Generates the JavaScript implementation of the "greater than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getGreaterThanNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, sensorQuality, ">", comparisonValue);
	}

	/**
	 * Generates the JavaScript implementation of the "lower than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getLowerThanNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, sensorQuality, "<", comparisonValue);
	}

	/**
	 * Generates the JavaScript implementation of the "equals" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getEqualsNode(String comparisonValue, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(compareString, sensorId, sensorQuality, "==", comparisonValue);
	}

	/**
	 * Generates the JavaScript implementation of the "status code" node
	 * 
	 * @param conditionValue
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static String getNotEquals(String conditionValue, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		return String.format(statusCodeString, sensorId, sensorQuality, "!=", conditionValue);
	}
	
	/**
	 * Generates the JavaScript implementation of the "between" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static Object getBetween(List<String> conditionValues, String objectID, String situationTemplateID, String sensorId, String sensorQuality, String quality) {
		
		String condValue1 = conditionValues.get(0);
		String condValue2 = conditionValues.get(1);
		
		return String.format(betweenString, sensorId, sensorQuality, condValue1, condValue2);
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n                returnValue = counter == " + numberOfInputs + ";\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n                returnValue = counter >= 1;\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "XOR" node
	 * 
	 * @return the XOR Node in JavaScript
	 */
	public static Object getXORNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (!context.values[i]) {\n            counter++;}\n            returnValue = counter == 1;\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNotNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n            returnValue = counter < " + numberOfInputs + ";\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNotNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (context.values[i]) {\n	  		counter++;}\n            returnValue = counter == 0;\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
	
	/**
	 * Generates the JavaScript implementation of the "XOR" node
	 * 
	 * @return the XOR Node in JavaScript
	 */
	public static Object getXORNotNode(String numberOfInputs, String objectID, String situationTemplateID) {
		final String immediateReturnValue = "if (context.values[i]) {\n            counter++;}\n            returnValue = counter != 1;\n";
		return String.format(accumulationString, numberOfInputs, immediateReturnValue, objectID, situationTemplateID, objectID, situationTemplateID);
	}
}