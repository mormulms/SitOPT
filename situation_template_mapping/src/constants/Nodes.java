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
	public static String getGreaterThanNode(String comparisonValue) {
		return "var curr = msg.payload;\n\nif (curr > "	+ comparisonValue + ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "lower than" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getLowerThanNode(String comparisonValue) {
		return "var curr = msg.payload;\n\nif (curr < "	+ comparisonValue	+ ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "equals" node
	 * 
	 * @param comparisonValue
	 *            the value to be compared
	 * 
	 * @return the node as JSON string
	 */
	public static String getEqualsNode(String comparisonValue) {
		return "var curr = msg.payload;\n\nif (curr == " + comparisonValue + ") {\n\tmsg.payload = true;\n} else {\n\tmsg.payload = false;\n}\n\nreturn msg;";
	}

	/**
	 * Generates the JavaScript implementation of the "status code" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static String getNotEquals(String conditionValues) {
		return "if (msg.statusCode != " + conditionValues + ") {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;";
	}
	
	/**
	 * Generates the JavaScript implementation of the "between" node
	 * 
	 * @param conditionValues
	 * 			 the status code to be checked
	 * 
	 * @return the node in JSON
	 */
	public static Object getBetween(List<String> conditionValues) {
		
		String condValue1 = conditionValues.get(0);
		String condValue2 = conditionValues.get(1);
		
		return "if (" + condValue1 + " < msg.statusCode < " + condValue2 + ") {\n  msg.payload = true;\n return msg;  \n} else {\n  msg.payload = false;\n return msg;\n}\n\nreturn null;";
	}
	
	/**
	 * Generates the JavaScript implementation of the "AND" node
	 * 
	 * @return the AND Node in JavaScript
	 */
	public static String getANDNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = true;\n  for (var i = 0; i < context.values.length; i++) {\n\tif (!(context.values[i])) {\n\t  returnValue = false;\n\t}\n  }\n  msg.payload = returnValue; \n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}
	
	/**
	 * Generates the JavaScript implementation of the "OR" node
	 * 
	 * @return the OR Node in JavaScript
	 */
	public static Object getORNode(String numberOfInputs) {
		return "context.values = context.values || new Array();\ncontext.values.push(msg.payload);\n\nvar inputs = " + numberOfInputs + ";\nif (context.values.length == inputs) {\n  var returnValue = false;\n  for (var i = 0; i < inputs; i++) {\n\tif (context.values[i]) {\n\t  returnValue = true;\n\t}\n  }\n\n  msg.payload = returnValue;\n  context.values = null;\n  \n  return msg;\n} else {\n  return null;\n}\n\n";
	}
}